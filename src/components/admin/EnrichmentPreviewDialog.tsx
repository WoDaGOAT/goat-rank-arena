
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Eye, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface EnrichmentSuggestion {
  field: string;
  current_value: any;
  suggested_value: any;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

interface AthleteWithSuggestions {
  athlete_id: string;
  athlete_name: string;
  suggestions: EnrichmentSuggestion[];
}

interface EnrichmentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  athleteData: AthleteWithSuggestions | null;
  onApprovalComplete: () => void;
}

const EnrichmentPreviewDialog = ({ 
  open, 
  onOpenChange, 
  athleteData, 
  onApprovalComplete 
}: EnrichmentPreviewDialogProps) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);

  const toggleSuggestion = (field: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(field)) {
      newSelected.delete(field);
    } else {
      newSelected.add(field);
    }
    setSelectedSuggestions(newSelected);
  };

  const getFieldDisplayName = (field: string) => {
    const fieldNames: Record<string, string> = {
      'country_of_origin': 'Country of Origin',
      'nationality': 'Nationality',
      'positions': 'Positions',
      'profile_picture_url': 'Profile Picture'
    };
    return fieldNames[field] || field;
  };

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value === null || value === undefined) {
      return 'None';
    }
    if (typeof value === 'string' && value.startsWith('http')) {
      return 'Image URL';
    }
    return value.toString();
  };

  const handleApplySuggestions = async () => {
    if (!athleteData || selectedSuggestions.size === 0) return;

    setIsApplying(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const approvedSuggestions = athleteData.suggestions.filter(
        suggestion => selectedSuggestions.has(suggestion.field)
      );

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body: { 
          apply_suggestions: {
            athlete_id: athleteData.athlete_id,
            suggestions: approvedSuggestions
          }
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error applying suggestions:', error);
        toast.error(`Failed to apply suggestions: ${error.message}`);
        return;
      }

      if (data?.success) {
        toast.success(`Successfully applied ${selectedSuggestions.size} suggestion(s) to ${athleteData.athlete_name}`);
        onApprovalComplete();
        onOpenChange(false);
        setSelectedSuggestions(new Set());
      }

    } catch (error) {
      console.error('Error during suggestion application:', error);
      toast.error("Failed to apply suggestions");
    } finally {
      setIsApplying(false);
    }
  };

  if (!athleteData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Review Data Enrichment for {athleteData.athlete_name}
          </DialogTitle>
          <DialogDescription>
            Review and approve high-quality data suggestions before applying them to the athlete profile.
            Only validated, high-confidence data is shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {athleteData.suggestions.map((suggestion, index) => (
            <Card 
              key={suggestion.field} 
              className={`cursor-pointer transition-all ${
                selectedSuggestions.has(suggestion.field) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleSuggestion(suggestion.field)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    {selectedSuggestions.has(suggestion.field) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    {getFieldDisplayName(suggestion.field)}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {suggestion.confidence} confidence
                    </Badge>
                    <Badge variant="secondary">
                      {suggestion.source}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Current Value</p>
                    <p className="text-sm bg-gray-100 p-2 rounded">
                      {formatValue(suggestion.current_value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Suggested Value</p>
                    <p className="text-sm bg-green-50 p-2 rounded border border-green-200">
                      {formatValue(suggestion.suggested_value)}
                    </p>
                  </div>
                </div>
                
                {suggestion.field === 'profile_picture_url' && suggestion.suggested_value && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-2">Preview</p>
                    <img 
                      src={suggestion.suggested_value} 
                      alt="Profile preview" 
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {athleteData.suggestions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No high-quality enrichment suggestions found for this athlete.</p>
                <p className="text-sm text-gray-500 mt-2">
                  All available data has been validated and meets quality standards.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-gray-600">
            {selectedSuggestions.size} of {athleteData.suggestions.length} suggestions selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplySuggestions}
              disabled={selectedSuggestions.size === 0 || isApplying}
            >
              {isApplying ? "Applying..." : `Apply ${selectedSuggestions.size} Suggestion(s)`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrichmentPreviewDialog;
