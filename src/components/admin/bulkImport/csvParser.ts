
import { ParsedAthlete } from "./types";

export const parseCsvFile = async (file: File): Promise<{ headers: string[]; data: string[][] }> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error("CSV file must have a header row and at least one data row");
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const dataRows = lines.slice(1).map(line => 
    line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
  );

  return { headers, data: dataRows };
};

export const parseDataWithMapping = (
  csvHeaders: string[],
  csvData: string[][],
  mapping: Record<string, string>
): ParsedAthlete[] => {
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

  return data;
};
