import { useCallback, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { extractText } from '@/lib/pdf-extract';
import { parseCv } from '@/lib/ai';
import { useCvStore } from '@/store/cvStore';
import { tomaszCv } from '@/lib/seed';
import { FileUp, Loader2, Sparkles } from 'lucide-react';

export function UploadStep() {
  const setCv = useCvStore((s) => s.setCv);
  const setOriginalCv = useCvStore((s) => s.setOriginalCv);
  const setStatus = useCvStore((s) => s.setStatus);
  const status = useCvStore((s) => s.status);
  const errorMessage = useCvStore((s) => s.errorMessage);

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      try {
        setStatus('extracting');
        const text = await extractText(file);
        if (!text.trim()) {
          throw new Error('Could not extract any text from the PDF. Is it a scanned image?');
        }
        setStatus('parsing');
        const cv = await parseCv(text);
        setCv(cv);
        setOriginalCv(structuredClone(cv));
        setStatus('parsed');
      } catch (err) {
        console.error(err);
        setStatus('error', err instanceof Error ? err.message : 'Unknown error');
      }
    },
    [setCv, setOriginalCv, setStatus],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') processFile(file);
  };

  const loading = status === 'extracting' || status === 'parsing';

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="font-serif text-5xl font-semibold tracking-tight">CV Adjuster</h1>
        <p className="mt-3 text-muted-foreground">
          Upload your CV PDF. We'll parse it with AI, render it in a clean Harvard-style template,
          and then rewrite it to fit any job offer you paste in - truthfully.
        </p>
      </div>

      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`w-full cursor-pointer border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-accent' : 'border-border'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          {loading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {status === 'extracting' ? 'Extracting text from PDF…' : 'Asking AI to parse your CV…'}
              </p>
            </>
          ) : (
            <>
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">Drop your PDF here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Processed entirely in your browser.</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />
        </CardContent>
      </Card>

      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-px w-16 bg-border" />
        <span>or</span>
        <div className="h-px w-16 bg-border" />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          const cloned = structuredClone(tomaszCv);
          setCv(cloned);
          setOriginalCv(structuredClone(tomaszCv));
          setStatus('parsed');
        }}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Load demo CV (skip upload)
      </Button>
    </div>
  );
}
