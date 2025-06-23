
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Filter, Database, Loader2 } from "lucide-react";
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

interface BulkSuggestion extends EnrichmentSuggestion {
  athlete_id: string;
  athlete_name: string;
  selected: boolean;
  id: string;
}

interface BulkEnrichmentApprovalProps {
  suggestions: AthleteWithSuggestions[];
  onBulkApprovalComplete: () => void;
}

const BulkEnrichmentApproval = ({ suggestions, onBulkApprovalComplete }: BulkEnrichmentApprovalProps) => {
  const [bulkSuggestions, setBulkSuggestions] = useState<BulkSuggestion[]>(() => {
    const flattened: BulkSuggestion[] = [];
    suggestions.forEach(athlete => {
      athlete.suggestions.forEach((suggestion, index) => {
        flattened.push({
          ...suggestion,
          athlete_id: athlete.athlete_id,
          athlete_name: athlete.athlete_name,
          selected: false,
          id: `${athlete.athlete_id}-${suggestion.field}-${index}`
        });
      });
    });
    return flattened;
  });

  const [fieldFilter, setFieldFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [isApplying, setIsApplying] = useState(false);

  const filteredSuggestions = bulkSuggestions.filter(suggestion => {
    if (fieldFilter !== "all" && suggestion.field !== fieldFilter) return false;
    if (confidenceFilter !== "all" && suggestion.confidence !== confidenceFilter) return false;
    return true;
  });

  const selectedCount = filteredSuggestions.filter(s => s.selected).length;
  const totalCount = filteredSuggestions.length;

  const handleSelectAll = (checked: boolean) => {
    setBulkSuggestions(prev => 
      prev.map(suggestion => ({
        ...suggestion,
        selected: filteredSuggestions.some(fs => fs.id === suggestion.id) ? checked : suggestion.selected
      }))
    );
  };

  const handleSelectSuggestion = (suggestionId: string, checked: boolean) => {
    setBulkSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === suggestionId ? { ...suggestion, selected: checked } : suggestion
      )
    );
  };

  const handleBulkApply = async () => {
    const selectedSuggestions = bulkSuggestions.filter(s => s.selected);
    
    if (selectedSuggestions.length === 0) {
      toast.error("Please select at least one suggestion to apply");
      return;
    }

    setIsApplying(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      // Group suggestions by athlete
      const suggestionsByAthlete = selectedSuggestions.reduce((acc, suggestion) => {
        if (!acc[suggestion.athlete_id]) {
          acc[suggestion.athlete_id] = [];
        }
        acc[suggestion.athlete_id].push({
          field: suggestion.field,
          suggested_value: suggestion.suggested_value,
          confidence: suggestion.confidence,
          source: suggestion.source
        });
        return acc;
      }, {} as Record<string, any[]>);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Apply suggestions for each athlete
      for (const [athleteId, suggestions] of Object.entries(suggestionsByAthlete)) {
        try {
          const { error } = await supabase.functions.invoke('enrich-athlete-data', {
            body: { 
              apply_suggestions: { 
                athlete_id: athleteId, 
                suggestions: suggestions 
              } 
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (error) {
            errorCount++;
            errors.push(`Error updating ${selectedSuggestions.find(s => s.athlete_id === athleteId)?.athlete_name}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (error) {
          errorCount++;
          errors.push(`Error updating ${selectedSuggestions.find(s => s.athlete_id === athleteId)?.athlete_name}: ${error}`);
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully applied enrichment to ${successCount} athlete(s)`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to apply enrichment to ${errorCount} athlete(s)`);
        errors.forEach(error => console.error(error));
      }

      onBulkApprovalComplete();

    } catch (error) {
      console.error('Bulk apply error:', error);
      toast.error("Failed to apply bulk enrichment");
    } finally {
      setIsApplying(false);
    }
  };

  const uniqueFields = [...new Set(bulkSuggestions.map(s => s.field))];
  const confidenceLevels = ['high', 'medium', 'low'];

  const getFieldDisplayName = (field: string) => {
    const fieldNames: Record<string, string> = {
      'country_of_origin': 'Country of Origin',
      'nationality': 'Nationality',
      'positions': 'Positions',
      'profile_picture_url': 'Profile Picture'
    };
    return fieldNames[field] || field;
  };

  const formatValue = (value: any, field: string) => {
    if (field === 'positions' && Array.isArray(value)) {
      return value.join(', ');
    }
    if (field === 'profile_picture_url' && value) {
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }
    return value || 'N/A';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Bulk Enrichment Approval
        </CardTitle>
        <CardDescription>
          Review and approve multiple enrichment suggestions at once across all athletes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={fieldFilter} onValueChange={setFieldFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {uniqueFields.map(field => (
                    <SelectItem key={field} value={field}>
                      {getFieldDisplayName(field)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                {confidenceLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selectedCount} of {totalCount} selected
            </span>
            <Button
              onClick={handleBulkApply}
              disabled={selectedCount === 0 || isApplying}
              className="flex items-center gap-2"
            >
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isApplying ? "Applying..." : `Apply Selected (${selectedCount})`}
            </Button>
          </div>
        </div>

        {/* Suggestions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCount === totalCount && totalCount > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Athlete</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Suggested Value</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuggestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No enrichment suggestions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell>
                      <Checkbox
                        checked={suggestion.selected}
                        onCheckedChange={(checked) => 
                          handleSelectSuggestion(suggestion.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {suggestion.athlete_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getFieldDisplayName(suggestion.field)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {formatValue(suggestion.current_value, suggestion.field)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-medium text-green-600">
                      {formatValue(suggestion.suggested_value, suggestion.field)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          suggestion.confidence === 'high' ? 'default' : 
                          suggestion.confidence === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {suggestion.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{suggestion.source}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Footer */}
        {filteredSuggestions.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              Showing {filteredSuggestions.length} enrichment opportunities across {[...new Set(filteredSuggestions.map(s => s.athlete_id))].length} athletes
            </div>
            <div className="text-sm font-medium">
              {selectedCount > 0 && `${selectedCount} suggestions selected for application`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkEnrichmentApproval;
