import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ColumnMappingStep from "./ColumnMappingStep";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedAthlete {
  name: string;
  country_of_origin?: string;
  nationality?: string;
  date_of_birth?: string;
  date_of_death?: string;
  is_active?: boolean;
  positions?: string[];
  profile_picture_url?: string;
}

interface ImportResult {
  inserted_count: number;
  skipped_count: number;
  errors: string[];
}

const BulkImportDialog = ({ open, onOpenChange }: BulkImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<ParsedAthlete[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "import" | "complete">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      parseCSVHeaders(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const parseCSVHeaders = async (file: File) => {
    try {
      setIsProcessing(true);
      setProgress(10);

      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row");
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const dataRows = lines.slice(1).map(line => 
        line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      );

      setCsvHeaders(headers);
      setCsvData(dataRows);
      setStep("mapping");
      setProgress(100);
      
      toast.success(`CSV file loaded successfully. Found ${headers.length} columns and ${dataRows.length} rows.`);
    } catch (error: any) {
      console.error("Error parsing CSV:", error);
      toast.error(error.message || "Failed to parse CSV file");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    parseDataWithMapping(mapping);
  };

  const parseDataWithMapping = (mapping: Record<string, string>) => {
    try {
      setIsProcessing(true);
      setProgress(10);

      const data: ParsedAthlete[] = [];

      for (const row of csvData) {
        if (row.length < csvHeaders.length) continue;

        const athlete: ParsedAthlete = { name: "" };

        csvHeaders.forEach((header, index) => {
          const dbField = mapping[header];
          const value = row[index]?.trim();
          
          if (!value || dbField === "skip") return;

          switch (dbField) {
            case "name":
              athlete.name = value;
              break;
            case "country_of_origin":
              athlete.country_of_origin = value;
              break;
            case "nationality":
              athlete.nationality = value;
              break;
            case "date_of_birth":
              athlete.date_of_birth = value;
              break;
            case "date_of_death":
              athlete.date_of_death = value;
              break;
            case "is_active":
              athlete.is_active = value.toLowerCase() === "true" || value.toLowerCase() === "yes" || value === "1";
              break;
            case "positions":
              athlete.positions = value.split(';').map(p => p.trim()).filter(Boolean);
              break;
            case "profile_picture_url":
              athlete.profile_picture_url = value;
              break;
          }
        });

        if (athlete.name) {
          data.push(athlete);
        }
      }

      setProgress(80);
      setParsedData(data);
      setStep("preview");
      setProgress(100);
      
      toast.success(`Successfully parsed ${data.length} athletes from CSV`);
    } catch (error: any) {
      console.error("Error parsing data with mapping:", error);
      toast.error(error.message || "Failed to parse CSV data");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleImport = async () => {
    try {
      setIsProcessing(true);
      setStep("import");
      setProgress(0);

      const athletesData = parsedData.map(athlete => ({
        id: crypto.randomUUID(),
        name: athlete.name,
        country_of_origin: athlete.country_of_origin || null,
        nationality: athlete.nationality || null,
        date_of_birth: athlete.date_of_birth || null,
        date_of_death: athlete.date_of_death || null,
        is_active: athlete.is_active !== undefined ? athlete.is_active : true,
        positions: athlete.positions || null,
        profile_picture_url: athlete.profile_picture_url || null,
      }));

      setProgress(25);

      const { data, error } = await supabase.rpc("bulk_insert_athletes", {
        p_athletes: JSON.stringify(athletesData)
      });

      setProgress(75);

      if (error) throw error;

      const result = data[0] as ImportResult;
      setImportResult(result);
      setStep("complete");
      setProgress(100);

      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });

      toast.success(`Import completed! Added ${result.inserted_count} athletes, skipped ${result.skipped_count} duplicates`);
    } catch (error: any) {
      console.error("Error importing athletes:", error);
      toast.error(error.message || "Failed to import athletes");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setColumnMapping({});
    setParsedData([]);
    setImportResult(null);
    setIsProcessing(false);
    setProgress(0);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const goBackToUpload = () => {
    setStep("upload");
    setCsvHeaders([]);
    setCsvData([]);
    setColumnMapping({});
  };

  const goBackToMapping = () => {
    setStep("mapping");
    setParsedData([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Athletes from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple athletes at once. You'll be able to map your CSV columns to database fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Select your CSV file. We'll detect the columns and let you map them to the appropriate fields.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Click to select CSV file</p>
                    <p className="text-sm text-gray-500">or drag and drop here</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">What happens next:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>We'll read your CSV headers</li>
                      <li>You'll map columns to database fields</li>
                      <li>Preview the mapped data</li>
                      <li>Import the athletes</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "mapping" && (
            <ColumnMappingStep
              csvHeaders={csvHeaders}
              onMappingComplete={handleMappingComplete}
              onBack={goBackToUpload}
            />
          )}

          {step === "preview" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Preview Import Data
                </CardTitle>
                <CardDescription>
                  Review the mapped data before importing. {parsedData.length} athletes found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-80 overflow-y-auto">
                  <div className="grid gap-2">
                    {parsedData.slice(0, 10).map((athlete, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{athlete.name}</p>
                          <p className="text-sm text-gray-500">
                            {athlete.country_of_origin} • {athlete.nationality}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {athlete.positions?.map((pos, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {pos}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {parsedData.length > 10 && (
                      <p className="text-center text-sm text-gray-500 py-2">
                        ... and {parsedData.length - 10} more athletes
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "import" && (
            <Card>
              <CardHeader>
                <CardTitle>Importing Athletes...</CardTitle>
                <CardDescription>
                  Please wait while we process your data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center">Processing {parsedData.length} athletes...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "complete" && importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Import Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-2xl font-bold text-green-600">{importResult.inserted_count}</p>
                      <p className="text-sm text-green-700">Added</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded">
                      <p className="text-2xl font-bold text-yellow-600">{importResult.skipped_count}</p>
                      <p className="text-sm text-yellow-700">Skipped (Duplicates)</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded">
                      <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                      <p className="text-sm text-red-700">Errors</p>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Import Errors:
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                Import {parsedData.length} Athletes
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
