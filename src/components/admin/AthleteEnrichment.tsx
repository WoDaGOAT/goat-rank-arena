
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, Loader2, RefreshCw, Eye, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface EnrichmentResult {
  processed: number;
  updated: number;
  errors: string[];
  details: Array<{
    athlete_name: string;
    status: 'updated' | 'no_new_data' | 'error';
    data_added?: any;
    data_found?: any;
  }>;
}

interface AthleteEnrichmentProps {
  onEnrichmentComplete?: () => void;
}

const AthleteEnrichment = ({ onEnrichmentComplete }: AthleteEnrichmentProps) => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [results, setResults] = useState<EnrichmentResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [showDataQuality, setShowDataQuality] = useState(false);

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

      toast.info("Starting enhanced athlete data enrichment with quality validation...");

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body: { athlete_ids: null }, // Process all athletes with missing data
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Enrichment error:', error);
        toast.error(`Enrichment failed: ${error.message}`);
        return;
      }

      setResults(data);
      setProgress(100);

      if (data.updated > 0) {
        toast.success(`Successfully enriched ${data.updated} athletes with validated data!`);
        onEnrichmentComplete?.();
      } else {
        toast.info("No new valid data was found to add to athletes");
      }

    } catch (error) {
      console.error('Error during enrichment:', error);
      toast.error("Failed to enrich athlete data");
    } finally {
      setIsEnriching(false);
    }
  };

  const getDataQualityIndicator = (detail: any) => {
    if (detail.status === 'updated' && detail.data_added) {
      const dataAdded = detail.data_added;
      let qualityScore = 0;
      let totalFields = 0;

      // Check quality of added data
      if (dataAdded.nationality) {
        totalFields++;
        if (dataAdded.nationality.length > 4 && !dataAdded.nationality.toLowerCase().includes('professional')) {
          qualityScore++;
        }
      }

      if (dataAdded.positions) {
        totalFields++;
        if (Array.isArray(dataAdded.positions) && dataAdded.positions.length > 0) {
          qualityScore++;
        }
      }

      if (dataAdded.profile_picture_url) {
        totalFields++;
        if (dataAdded.profile_picture_url.includes('upload.wikimedia.org')) {
          qualityScore++;
        }
      }

      if (totalFields === 0) return null;

      const percentage = (qualityScore / totalFields) * 100;
      
      if (percentage >= 80) return { type: 'high', color: 'text-green-600', icon: CheckCircle };
      if (percentage >= 50) return { type: 'medium', color: 'text-yellow-600', icon: AlertTriangle };
      return { type: 'low', color: 'text-red-600', icon: AlertCircle };
    }

    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Enhanced Athlete Data Enrichment
        </CardTitle>
        <CardDescription>
          Automatically fetch and validate athlete information from multiple sources with quality control.
          The system now includes nationality validation, position verification, and data quality indicators.
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
            {isEnriching ? "Enriching..." : "Enrich All Athletes"}
          </Button>

          {results && (
            <Button
              variant="outline"
              onClick={() => setShowDataQuality(!showDataQuality)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showDataQuality ? "Hide" : "Show"} Data Quality
            </Button>
          )}
        </div>

        {isEnriching && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing athletes with quality validation...</span>
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
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Processed</p>
                      <p className="text-2xl font-bold">{results.processed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Updated (Validated)</p>
                      <p className="text-2xl font-bold text-blue-600">{results.updated}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Errors</p>
                      <p className="text-2xl font-bold">{results.errors.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.details.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Processing Details with Quality Indicators</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {results.details.map((detail, index) => {
                    const qualityIndicator = getDataQualityIndicator(detail);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{detail.athlete_name}</span>
                          {qualityIndicator && (
                            <div className="flex items-center gap-1">
                              <qualityIndicator.icon className={`h-3 w-3 ${qualityIndicator.color}`} />
                              <span className={`text-xs ${qualityIndicator.color} capitalize`}>
                                {qualityIndicator.type} Quality
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            detail.status === 'updated' ? 'default' :
                            detail.status === 'no_new_data' ? 'secondary' : 'destructive'
                          }
                        >
                          {detail.status === 'updated' ? 'Updated' :
                           detail.status === 'no_new_data' ? 'No valid data' : 'Error'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showDataQuality && results.details.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">Data Quality Details</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {results.details
                    .filter(detail => detail.status === 'updated' && detail.data_added)
                    .map((detail, index) => (
                      <div key={index} className="text-xs p-3 bg-blue-50 rounded border">
                        <p className="font-medium text-blue-800">{detail.athlete_name}</p>
                        <div className="mt-1 space-y-1">
                          {detail.data_added.nationality && (
                            <p><span className="font-medium">Nationality:</span> {detail.data_added.nationality}</p>
                          )}
                          {detail.data_added.positions && (
                            <p><span className="font-medium">Positions:</span> {detail.data_added.positions.join(', ')}</p>
                          )}
                          {detail.data_added.profile_picture_url && (
                            <p><span className="font-medium">Image:</span> Added profile picture</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors</h4>
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
  );
};

export default AthleteEnrichment;
