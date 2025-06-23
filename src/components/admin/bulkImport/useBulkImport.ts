
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ParsedAthlete, ImportResult, DuplicateInfo, ImportStep } from "./types";
import { parseCsvFile, parseDataWithMapping } from "./csvParser";
import { detectDuplicates } from "./duplicateDetector";
import { performBulkImport } from "./importService";

export const useBulkImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<ParsedAthlete[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<ImportStep>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const parseCSVHeaders = async (file: File) => {
    try {
      setIsProcessing(true);
      setProgress(10);

      const { headers, data } = await parseCsvFile(file);

      setCsvHeaders(headers);
      setCsvData(data);
      setStep("mapping");
      setProgress(100);
      
      toast.success(`CSV file loaded successfully. Found ${headers.length} columns and ${data.length} rows.`);
    } catch (error: any) {
      console.error("Error parsing CSV:", error);
      toast.error(error.message || "Failed to parse CSV file");
      setProgress(0);
      setStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseDataWithMappingHandler = async (mapping: Record<string, string>) => {
    try {
      setIsProcessing(true);
      setProgress(10);

      const data = parseDataWithMapping(csvHeaders, csvData, mapping);
      setProgress(50);

      const duplicateInfo = await detectDuplicates(data, updateMode);
      setDuplicates(duplicateInfo);
      setProgress(80);
      setParsedData(data);
      setStep("preview");
      setProgress(100);
      
      toast.success(`Successfully parsed ${data.length} athletes from CSV. ${duplicateInfo.length} duplicates detected.`);
    } catch (error: any) {
      console.error("Error parsing data with mapping:", error);
      toast.error(error.message || "Failed to parse CSV data");
      setProgress(0);
      setStep("mapping");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsProcessing(true);
      setStep("import");
      setProgress(0);

      setProgress(25);
      const result = await performBulkImport(parsedData, updateMode);
      setProgress(75);

      setImportResult(result);
      setStep("complete");
      setProgress(100);

      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });

      const message = updateMode 
        ? `Import completed! Added ${result.inserted_count} new athletes, updated ${result.updated_count} existing athletes, skipped ${result.skipped_count}`
        : `Import completed! Added ${result.inserted_count} athletes, skipped ${result.skipped_count} duplicates`;
      
      toast.success(message);
    } catch (error: any) {
      console.error("Error importing athletes:", error);
      toast.error(error.message || "Failed to import athletes");
      setProgress(0);
      setStep("preview");
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
    setDuplicates([]);
    setUpdateMode(false);
    setImportResult(null);
    setIsProcessing(false);
    setProgress(0);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);
    parseDataWithMappingHandler(mapping);
  };

  const handleUpdateModeChange = (checked: boolean) => {
    setUpdateMode(checked);
    setDuplicates(prev => prev.map(d => ({ ...d, willBeUpdated: checked })));
  };

  return {
    file,
    setFile,
    csvHeaders,
    csvData,
    columnMapping,
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
  };
};
