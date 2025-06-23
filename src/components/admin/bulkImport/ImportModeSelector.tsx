
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { DuplicateInfo } from "./types";

interface ImportModeSelectorProps {
  updateMode: boolean;
  onUpdateModeChange: (checked: boolean) => void;
  duplicates: DuplicateInfo[];
}

const ImportModeSelector = ({ updateMode, onUpdateModeChange, duplicates }: ImportModeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Import Mode
        </CardTitle>
        <CardDescription>
          Choose how to handle duplicate athletes (matched by name).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="update-mode"
            checked={updateMode}
            onCheckedChange={onUpdateModeChange}
          />
          <Label htmlFor="update-mode" className="flex flex-col">
            <span className="font-medium">
              {updateMode ? "Insert & Update Mode" : "Insert Only Mode"}
            </span>
            <span className="text-sm text-muted-foreground">
              {updateMode 
                ? "Update existing athletes with new information from CSV"
                : "Skip existing athletes, only add new ones"
              }
            </span>
          </Label>
        </div>

        {duplicates.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm font-medium text-yellow-800">
              {duplicates.length} duplicate athlete(s) detected:
            </p>
            <div className="mt-2 max-h-20 overflow-y-auto">
              {duplicates.slice(0, 5).map((duplicate, index) => (
                <div key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                  <span>{duplicate.name}</span>
                  <Badge variant={duplicate.willBeUpdated ? "default" : "secondary"} className="text-xs">
                    {duplicate.willBeUpdated ? "Will Update" : "Will Skip"}
                  </Badge>
                </div>
              ))}
              {duplicates.length > 5 && (
                <p className="text-xs text-yellow-600 mt-1">
                  ... and {duplicates.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportModeSelector;
