import { Button } from "@/components/ui/button";
import type { ImportResult } from "@/types/import";

interface ImportPanelProps {
  isImporting: boolean;
  result?: ImportResult;
  errorMessage?: string;
  onImport: () => void;
}

// "Dumb" panel: a button to import from ArtBarcelona and the result.
export function ImportPanel({
  isImporting,
  result,
  errorMessage,
  onImport,
}: ImportPanelProps) {
  return (
    <section
      aria-labelledby="import-title"
      className="flex flex-col items-start gap-2"
    >
      <h2 id="import-title" className="text-lg font-semibold">
        Import openings
      </h2>
      <p className="text-sm text-muted-foreground">
        AI reads the ArtBarcelona agenda and adds the next openings as pending
        events for you to review.
      </p>
      <Button type="button" onClick={onImport} disabled={isImporting}>
        {isImporting ? "Importing... (about 30 s)" : "Import from ArtBarcelona"}
      </Button>
      {result && (
        <p role="status" className="text-sm text-muted-foreground">
          {result.imported} imported, {result.skipped} skipped.
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
