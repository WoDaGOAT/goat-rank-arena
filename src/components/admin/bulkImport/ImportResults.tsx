
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ImportResult } from "./types";

interface ImportResultsProps {
  importResult: ImportResult;
  updateMode: boolean;
}

const ImportResults = ({ importResult, updateMode }: ImportResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Import Complete
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-2xl font-bold text-green-600">{importResult.inserted_count}</p>
              <p className="text-sm text-green-700">Inserted</p>
            </div>
            {updateMode && (
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-2xl font-bold text-blue-600">{importResult.updated_count}</p>
                <p className="text-sm text-blue-700">Updated</p>
              </div>
            )}
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-2xl font-bold text-yellow-600">{importResult.skipped_count}</p>
              <p className="text-sm text-yellow-700">Skipped</p>
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
  );
};

export default ImportResults;
