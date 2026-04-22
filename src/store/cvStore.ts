import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cv } from '@/lib/schema';

export type AppStatus =
  | 'idle'
  | 'extracting'
  | 'parsing'
  | 'parsed'
  | 'adjusting'
  | 'adjusted'
  | 'error';

interface CvState {
  cv: Cv | null;
  originalCv: Cv | null;
  jobOffer: string;
  status: AppStatus;
  errorMessage: string | null;

  setCv: (cv: Cv) => void;
  setOriginalCv: (cv: Cv) => void;
  updateCv: (updater: (cv: Cv) => Cv) => void;
  setJobOffer: (offer: string) => void;
  setStatus: (status: AppStatus, errorMessage?: string | null) => void;
  revertToOriginal: () => void;
  reset: () => void;
}

export const useCvStore = create<CvState>()(
  persist(
    (set, get) => ({
      cv: null,
      originalCv: null,
      jobOffer: '',
      status: 'idle',
      errorMessage: null,

      setCv: (cv) => set({ cv }),
      setOriginalCv: (cv) => set({ originalCv: cv }),
      updateCv: (updater) => {
        const current = get().cv;
        if (!current) return;
        set({ cv: updater(current) });
      },
      setJobOffer: (jobOffer) => set({ jobOffer }),
      setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
      revertToOriginal: () => {
        const original = get().originalCv;
        if (original) {
          set({ cv: structuredClone(original), status: 'parsed', errorMessage: null });
        }
      },
      reset: () =>
        set({
          cv: null,
          originalCv: null,
          jobOffer: '',
          status: 'idle',
          errorMessage: null,
        }),
    }),
    {
      name: 'cv-adjuster:store',
      partialize: (state) => ({
        cv: state.cv,
        originalCv: state.originalCv,
        jobOffer: state.jobOffer,
      }),
    },
  ),
);
