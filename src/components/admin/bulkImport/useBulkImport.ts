
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  updated_count: number;
  skipped_count: number;
  errors: string[];
}

interface DuplicateInfo {
  name: string;
  willBeUpdated: boolean;
}

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
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "import" | "complete">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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

  const parseDataWithMapping = async (mapping: Record<string, string>) => {
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

      setProgress(50);

      // Check for existing athletes to detect duplicates
      const athleteNames = data.map(a => a.name);
      const { data: existingAthletes, error } = await supabase
        .from("athletes")
        .select("name")
        .in("name", athleteNames);

      if (error) throw error;

      const existingNames = new Set(existingAthletes?.map(a => a.name) || []);
      const duplicateInfo: DuplicateInfo[] = data
        .filter(athlete => existingNames.has(athlete.name))
        .map(athlete => ({
          name: athlete.name,
          willBeUpdated: updateMode
        }));

      setDuplicates(duplicateInfo);
      setProgress(80);
      setParsedData(data);
      setStep("preview");
      setProgress(100);
      
      toast.success(`Successfully parsed ${data.length} athletes from CSV. ${duplicateInfo.length} duplicates detected.`);
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
        p_athletes: JSON.stringify(athletesData),
        p_update_mode: updateMode
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

      const message = updateMode 
        ? `Import completed! Added ${result.inserted_count} new athletes, updated ${result.updated_count} existing athletes, skipped ${result.skipped_count}`
        : `Import completed! Added ${result.inserted_count} athletes, skipped ${result.skipped_count} duplicates`;
      
      toast.success(message);
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
    parseDataWithMapping(mapping);
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
