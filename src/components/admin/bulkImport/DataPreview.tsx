
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

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

interface DuplicateInfo {
  name: string;
  willBeUpdated: boolean;
}

interface DataPreviewProps {
  parsedData: ParsedAthlete[];
  duplicates: DuplicateInfo[];
  updateMode: boolean;
}

const DataPreview = ({ parsedData, duplicates, updateMode }: DataPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Preview Import Data
        </CardTitle>
        <CardDescription>
          Review the mapped data before importing. {parsedData.length} athletes found.
          {updateMode && duplicates.length > 0 && (
            <span className="block mt-1 text-blue-600">
              {duplicates.filter(d => d.willBeUpdated).length} athletes will be updated.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-y-auto">
          <div className="grid gap-2">
            {parsedData.slice(0, 10).map((athlete, index) => {
              const isDuplicate = duplicates.some(d => d.name === athlete.name);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {athlete.name}
                      {isDuplicate && (
                        <Badge variant={updateMode ? "default" : "secondary"} className="text-xs">
                          {updateMode ? "Update" : "Skip"}
                        </Badge>
                      )}
                    </p>
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
              );
            })}
            {parsedData.length > 10 && (
              <p className="text-center text-sm text-gray-500 py-2">
                ... and {parsedData.length - 10} more athletes
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
