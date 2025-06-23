
export interface ParsedAthlete {
  name: string;
  country_of_origin?: string;
  nationality?: string;
  date_of_birth?: string;
  date_of_death?: string;
  is_active?: boolean;
  positions?: string[];
  profile_picture_url?: string;
}

export interface ImportResult {
  inserted_count: number;
  updated_count: number;
  skipped_count: number;
  errors: string[];
}

export interface DuplicateInfo {
  name: string;
  willBeUpdated: boolean;
}

export type ImportStep = "upload" | "mapping" | "preview" | "import" | "complete";
