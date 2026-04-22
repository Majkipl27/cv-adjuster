import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { hasGatewayKey } from '@/lib/storage';
import {
  DEFAULT_ADJUST_MODEL,
  DEFAULT_PARSE_MODEL,
  getAdjustModel,
  getParseModel,
} from '@/lib/storage';
import { CheckCircle2, KeyRound, XCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: Props) {
  const hasKey = hasGatewayKey();
  const parseModel = getParseModel();
  const adjustModel = getAdjustModel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Vercel AI Gateway
          </DialogTitle>
          <DialogDescription>
            All AI requests go through a same-origin proxy at{' '}
            <code className="rounded bg-muted px-1">/api/ai</code>, which the Vite dev server
            forwards to <code className="rounded bg-muted px-1">ai-gateway.vercel.sh</code> with the
            Authorization header injected server-side. The key never reaches the browser bundle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div
            className={`flex items-start gap-3 rounded-md border p-3 text-sm ${
              hasKey
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-destructive/40 bg-destructive/10 text-destructive'
            }`}
          >
            {hasKey ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div className="space-y-1">
              <p className="font-medium">
                {hasKey
                  ? 'AI_GATEWAY_API_KEY is loaded from .env.local.'
                  : 'AI_GATEWAY_API_KEY is not set.'}
              </p>
              {!hasKey && (
                <p>
                  Add a line like{' '}
                  <code className="rounded bg-black/5 px-1">
                    AI_GATEWAY_API_KEY=vck_…
                  </code>{' '}
                  to <code className="rounded bg-black/5 px-1">.env.local</code> and restart{' '}
                  <code className="rounded bg-black/5 px-1">pnpm dev</code>. Get a key at{' '}
                  <a
                    className="underline"
                    href="https://vercel.com/dashboard/ai-gateway/api-keys"
                    target="_blank"
                    rel="noreferrer"
                  >
                    vercel.com/dashboard/ai-gateway/api-keys
                  </a>
                  .
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1 rounded-md border p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parse model</span>
              <code className="text-xs">{parseModel}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adjust model</span>
              <code className="text-xs">{adjustModel}</code>
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
              Defaults are <code>{DEFAULT_PARSE_MODEL}</code> and{' '}
              <code>{DEFAULT_ADJUST_MODEL}</code>. Override via localStorage keys{' '}
              <code>cv-adjuster:parse-model</code> / <code>cv-adjuster:adjust-model</code>.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
