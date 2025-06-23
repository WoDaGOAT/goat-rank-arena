
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

interface ColumnMappingStepProps {
  csvHeaders: string[];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onBack: () => void;
}

const DATABASE_FIELDS = [
  { value: "name", label: "Name", required: true },
  { value: "country_of_origin", label: "Country of Origin" },
  { value: "nationality", label: "Nationality" },
  { value: "date_of_birth", label: "Date of Birth" },
  { value: "date_of_death", label: "Date of Death" },
  { value: "is_active", label: "Active Status" },
  { value: "positions", label: "Positions" },
  { value: "profile_picture_url", label: "Profile Picture URL" },
  { value: "skip", label: "Skip this column" },
];

const ColumnMappingStep = ({ csvHeaders, onMappingComplete, onBack }: ColumnMappingStepProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>(() => {
    // Auto-detect some common mappings
    const autoMapping: Record<string, string> = {};
    csvHeaders.forEach(header => {
      const lowerHeader = header.toLowerCase().trim();
      if (lowerHeader === "name" || lowerHeader === "player name" || lowerHeader === "athlete name") {
        autoMapping[header] = "name";
      } else if (lowerHeader === "country" || lowerHeader === "country_of_origin") {
        autoMapping[header] = "country_of_origin";
      } else if (lowerHeader === "nationality") {
        autoMapping[header] = "nationality";
      } else if (lowerHeader === "date_of_birth" || lowerHeader === "birth_date" || lowerHeader === "dob") {
        autoMapping[header] = "date_of_birth";
      } else if (lowerHeader === "date_of_death" || lowerHeader === "death_date") {
        autoMapping[header] = "date_of_death";
      } else if (lowerHeader === "is_active" || lowerHeader === "active" || lowerHeader === "status") {
        autoMapping[header] = "is_active";
      } else if (lowerHeader === "positions" || lowerHeader === "position") {
        autoMapping[header] = "positions";
      } else if (lowerHeader === "profile_picture_url" || lowerHeader === "image_url" || lowerHeader === "photo") {
        autoMapping[header] = "profile_picture_url";
      } else {
        autoMapping[header] = "skip";
      }
    });
    return autoMapping;
  });

  const handleMappingChange = (csvColumn: string, dbField: string) => {
    setMapping(prev => ({
      ...prev,
      [csvColumn]: dbField
    }));
  };

  const getUsedFields = () => {
    return Object.values(mapping).filter(field => field !== "skip");
  };

  const isFieldUsed = (field: string) => {
    return getUsedFields().includes(field);
  };

  const hasRequiredFields = () => {
    const usedFields = getUsedFields();
    return usedFields.includes("name");
  };

  const canProceed = () => {
    return hasRequiredFields() && Object.keys(mapping).length === csvHeaders.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Map CSV Columns to Database Fields
        </CardTitle>
        <CardDescription>
          Match your CSV columns to the corresponding database fields. The "Name" field is required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {csvHeaders.map((header, index) => {
            const selectedField = mapping[header] || "skip";
            const dbField = DATABASE_FIELDS.find(field => field.value === selectedField);
            
            return (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{header}</div>
                  <div className="text-sm text-muted-foreground">CSV Column</div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <Select
                    value={selectedField}
                    onValueChange={(value) => handleMappingChange(header, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select database field" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATABASE_FIELDS.map((field) => (
                        <SelectItem 
                          key={field.value} 
                          value={field.value}
                          disabled={field.value !== "skip" && field.value !== selectedField && isFieldUsed(field.value)}
                        >
                          {field.label}
                          {field.required && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                          {field.value !== "skip" && field.value !== selectedField && isFieldUsed(field.value) && (
                            <Badge variant="secondary" className="ml-2 text-xs">Used</Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {dbField?.required && selectedField === "skip" && (
                    <div className="text-xs text-red-600 mt-1">This field is required</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!hasRequiredFields() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 font-medium">Missing Required Field</div>
            <div className="text-red-600 text-sm">
              You must map at least one CSV column to the "Name" field to proceed.
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800 font-medium mb-2">Mapping Summary</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(mapping)
              .filter(([_, dbField]) => dbField !== "skip")
              .map(([csvCol, dbField]) => {
                const field = DATABASE_FIELDS.find(f => f.value === dbField);
                return (
                  <div key={csvCol} className="flex justify-between">
                    <span className="text-blue-700">{csvCol}</span>
                    <span className="text-blue-600">→ {field?.label}</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Upload
          </Button>
          <Button 
            onClick={() => onMappingComplete(mapping)} 
            disabled={!canProceed()}
          >
            Continue to Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColumnMappingStep;
