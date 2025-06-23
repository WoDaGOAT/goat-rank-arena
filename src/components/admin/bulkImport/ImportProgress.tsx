
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ImportProgressProps {
  progress: number;
  parsedDataLength: number;
  updateMode: boolean;
}

const ImportProgress = ({ progress, parsedDataLength, updateMode }: ImportProgressProps) => {
  return (
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
          <p className="text-sm text-center">
            Processing {parsedDataLength} athletes in {updateMode ? "update" : "insert-only"} mode...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportProgress;
