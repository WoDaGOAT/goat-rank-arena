
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Loader2, RefreshCw, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import EnrichmentPreviewDialog from "./EnrichmentPreviewDialog";

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

interface EnrichmentResult {
  processed: number;
  suggestions_found: number;
  errors: string[];
  athlete_suggestions: AthleteWithSuggestions[];
}

interface AthleteEnrichmentProps {
  onEnrichmentComplete?: () => void;
}

const AthleteEnrichment = ({ onEnrichmentComplete }: AthleteEnrichmentProps) => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [results, setResults] = useState<EnrichmentResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteWithSuggestions | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const enrichAthleteData = async () => {
    setIsEnriching(true);
    setResults(null);
    setProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      toast.info("Scanning for high-quality enrichment opportunities...");

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body: { athlete_ids: null }, // Process all athletes with missing data
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Enrichment error:', error);
        toast.error(`Enrichment scan failed: ${error.message}`);
        return;
      }

      setResults(data);
      setProgress(100);

      if (data.suggestions_found > 0) {
        toast.success(`Found ${data.suggestions_found} athletes with high-quality enrichment opportunities!`);
      } else {
        toast.info("No new high-quality enrichment opportunities found");
      }

    } catch (error) {
      console.error('Error during enrichment:', error);
      toast.error("Failed to scan for enrichment opportunities");
    } finally {
      setIsEnriching(false);
    }
  };

  const handlePreviewSuggestions = (athlete: AthleteWithSuggestions) => {
    setSelectedAthlete(athlete);
    setShowPreviewDialog(true);
  };

  const handleApprovalComplete = () => {
    onEnrichmentComplete?.();
    // Refresh the enrichment scan
    enrichAthleteData();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            High-Quality Data Enrichment
          </CardTitle>
          <CardDescription>
            Scan for high-quality enrichment opportunities and preview suggestions before applying them.
            Only validated, high-confidence data from trusted sources will be suggested.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={enrichAthleteData}
              disabled={isEnriching}
              className="flex items-center gap-2"
            >
              {isEnriching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isEnriching ? "Scanning..." : "Scan for Opportunities"}
            </Button>
          </div>

          {isEnriching && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Scanning for high-quality enrichment opportunities...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Athletes Scanned</p>
                        <p className="text-2xl font-bold">{results.processed}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Enrichment Opportunities</p>
                        <p className="text-2xl font-bold text-green-600">{results.suggestions_found}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Ready for Review</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {results.athlete_suggestions.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {results.athlete_suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Athletes with High-Quality Enrichment Opportunities</h4>
                  <div className="space-y-2">
                    {results.athlete_suggestions.map((athlete, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{athlete.athlete_name}</span>
                          <Badge variant="outline" className="text-green-600">
                            {athlete.suggestions.length} high-quality suggestion(s)
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewSuggestions(athlete)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review & Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Processing Errors</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {results.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EnrichmentPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        athleteData={selectedAthlete}
        onApprovalComplete={handleApprovalComplete}
      />
    </>
  );
};

export default AthleteEnrichment;
