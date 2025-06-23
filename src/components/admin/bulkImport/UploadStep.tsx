
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

interface UploadStepProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadStep = ({ onFileSelect }: UploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
            onChange={onFileSelect}
            className="hidden"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>We'll read your CSV headers</li>
              <li>You'll map columns to database fields</li>
              <li>Choose import mode (insert only or update existing)</li>
              <li>Preview the mapped data</li>
              <li>Import the athletes</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadStep;
