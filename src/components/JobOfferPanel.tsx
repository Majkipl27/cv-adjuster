import { useCvStore } from '@/store/cvStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { adjustCv } from '@/lib/ai';
import { Loader2, Sparkles, Undo2 } from 'lucide-react';

export function JobOfferPanel() {
  const cv = useCvStore((s) => s.cv);
  const originalCv = useCvStore((s) => s.originalCv);
  const jobOffer = useCvStore((s) => s.jobOffer);
  const setJobOffer = useCvStore((s) => s.setJobOffer);
  const setCv = useCvStore((s) => s.setCv);
  const setStatus = useCvStore((s) => s.setStatus);
  const status = useCvStore((s) => s.status);
  const errorMessage = useCvStore((s) => s.errorMessage);
  const revertToOriginal = useCvStore((s) => s.revertToOriginal);

  const run = async () => {
    if (!cv) return;
    try {
      setStatus('adjusting');
      const adjusted = await adjustCv(cv, jobOffer);
      setCv(adjusted);
      setStatus('adjusted');
    } catch (err) {
      console.error(err);
      setStatus('error', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const adjusting = status === 'adjusting';

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Job offer
        </h3>
        <p className="text-xs text-muted-foreground">
          Paste the full job description. We'll rewrite bullets, reorder skills, and tighten the
          summary to match - without inventing anything.
        </p>
      </div>
      <Textarea
        className="flex-1 min-h-[240px] resize-none"
        placeholder="Paste the full job offer here…"
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <Button onClick={run} disabled={adjusting || !jobOffer.trim() || !cv} size="lg">
          {adjusting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {adjusting ? 'Rewriting CV…' : 'Adjust CV to this offer'}
        </Button>

        <Button
          variant="outline"
          disabled={!originalCv || adjusting}
          onClick={revertToOriginal}
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Revert to original
        </Button>
      </div>

      {status === 'adjusted' && (
        <p className="text-sm text-emerald-600">CV updated. Download it as PDF below.</p>
      )}
      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
