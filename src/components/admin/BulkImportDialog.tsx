
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ColumnMappingStep from "./ColumnMappingStep";
import UploadStep from "./bulkImport/UploadStep";
import ImportModeSelector from "./bulkImport/ImportModeSelector";
import DataPreview from "./bulkImport/DataPreview";
import ImportProgress from "./bulkImport/ImportProgress";
import ImportResults from "./bulkImport/ImportResults";
import { useBulkImport } from "./bulkImport/useBulkImport";
import { toast } from "sonner";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkImportDialog = ({ open, onOpenChange }: BulkImportDialogProps) => {
  const {
    csvHeaders,
    parsedData,
    duplicates,
    updateMode,
    importResult,
    isProcessing,
    progress,
    step,
    setStep,
    parseCSVHeaders,
    handleMappingComplete,
    handleUpdateModeChange,
    handleImport,
    resetDialog,
  } = useBulkImport();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      parseCSVHeaders(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const goBackToUpload = () => {
    setStep("upload");
  };

  const goBackToMapping = () => {
    setStep("mapping");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Athletes from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple athletes at once. You can choose to update existing athletes or insert only new ones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === "upload" && (
            <UploadStep onFileSelect={handleFileSelect} />
          )}

          {step === "mapping" && (
            <ColumnMappingStep
              csvHeaders={csvHeaders}
              onMappingComplete={handleMappingComplete}
              onBack={goBackToUpload}
            />
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <ImportModeSelector
                updateMode={updateMode}
                onUpdateModeChange={handleUpdateModeChange}
                duplicates={duplicates}
              />
              <DataPreview
                parsedData={parsedData}
                duplicates={duplicates}
                updateMode={updateMode}
              />
            </div>
          )}

          {step === "import" && (
            <ImportProgress
              progress={progress}
              parsedDataLength={parsedData.length}
              updateMode={updateMode}
            />
          )}

          {step === "complete" && importResult && (
            <ImportResults
              importResult={importResult}
              updateMode={updateMode}
            />
          )}
        </div>

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={goBackToMapping}>
                Back to Mapping
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {updateMode ? "Import & Update" : "Import New Only"} ({parsedData.length} Athletes)
              </Button>
            </>
          )}
          
          {step === "complete" && (
            <>
              <Button variant="outline" onClick={resetDialog}>
                Import Another File
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
