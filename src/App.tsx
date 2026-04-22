import { useState } from 'react';
import { ApiKeyDialog } from './components/ApiKeyDialog';
import { UploadStep } from './components/UploadStep';
import { CvPreview } from './components/CvPreview';
import { CvEditor } from './components/CvEditor';
import { JobOfferPanel } from './components/JobOfferPanel';
import { downloadCvPdf } from './components/PdfDocument';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useCvStore } from './store/cvStore';
import { hasGatewayKey } from './lib/storage';
import { Download, FileText, KeyRound, Pencil, Printer, RotateCcw, ShieldAlert } from 'lucide-react';

export default function App() {
  const cv = useCvStore((s) => s.cv);
  const reset = useCvStore((s) => s.reset);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const keyConfigured = hasGatewayKey();

  const handleDownload = async () => {
    if (!cv) return;
    await downloadCvPdf(cv);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="font-serif text-lg font-semibold tracking-tight">CV Adjuster</span>
        </div>
        <div className="flex items-center gap-2">
          {cv && (
            <>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Discard current CV and start over?')) reset();
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start over
              </Button>
            </>
          )}
          <Button
            variant={keyConfigured ? 'ghost' : 'destructive'}
            size="sm"
            onClick={() => setStatusDialogOpen(true)}
          >
            {keyConfigured ? (
              <KeyRound className="mr-2 h-4 w-4" />
            ) : (
              <ShieldAlert className="mr-2 h-4 w-4" />
            )}
            Gateway
          </Button>
        </div>
      </header>

      <ApiKeyDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen} />

      {!cv ? (
        <UploadStep />
      ) : (
        <div className="mx-auto grid max-w-[1700px] grid-cols-12 gap-4 p-4">
          <aside className="no-print col-span-12 overflow-y-auto rounded-lg border bg-background lg:col-span-4 lg:max-h-[calc(100vh-5rem)]">
            <Tabs defaultValue="offer" className="w-full">
              <TabsList className="sticky top-0 z-10 m-2 grid w-[calc(100%-1rem)] grid-cols-2">
                <TabsTrigger value="offer">Job offer</TabsTrigger>
                <TabsTrigger value="edit">
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit CV
                </TabsTrigger>
              </TabsList>
              <TabsContent value="offer" className="mt-0">
                <JobOfferPanel />
              </TabsContent>
              <TabsContent value="edit" className="mt-0">
                <CvEditor />
              </TabsContent>
            </Tabs>
          </aside>

          <main className="col-span-12 overflow-y-auto lg:col-span-8 lg:max-h-[calc(100vh-5rem)]">
            <div className="pb-12">
              <CvPreview cv={cv} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
