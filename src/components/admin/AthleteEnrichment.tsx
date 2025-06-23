
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, Loader2, RefreshCw } from "lucide-react";
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

      toast.info("Starting athlete data enrichment...");

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
        toast.success(`Successfully enriched ${data.updated} athletes!`);
        onEnrichmentComplete?.();
      } else {
        toast.info("No new data was found to add to athletes");
      }

    } catch (error) {
      console.error('Error during enrichment:', error);
      toast.error("Failed to enrich athlete data");
    } finally {
      setIsEnriching(false);
    }
  };

  const enrichSingleAthlete = async (athleteId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body: { single_athlete_id: athleteId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast.error(`Failed to enrich athlete: ${error.message}`);
        return;
      }

      if (data.updated > 0) {
        toast.success("Athlete data enriched successfully!");
        onEnrichmentComplete?.();
      } else {
        toast.info("No new data found for this athlete");
      }

    } catch (error) {
      console.error('Error enriching single athlete:', error);
      toast.error("Failed to enrich athlete data");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Athlete Data Enrichment
        </CardTitle>
        <CardDescription>
          Automatically fetch and fill missing athlete information from external sources like Wikipedia.
          This will update empty fields for country, nationality, date of birth, positions, and profile pictures.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
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
        </div>

        {isEnriching && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing athletes...</span>
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
                      <p className="text-sm font-medium">Updated</p>
                      <p className="text-2xl font-bold">{results.updated}</p>
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
                <h4 className="font-medium">Processing Details</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {results.details.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{detail.athlete_name}</span>
                      <Badge
                        variant={
                          detail.status === 'updated' ? 'default' :
                          detail.status === 'no_new_data' ? 'secondary' : 'destructive'
                        }
                      >
                        {detail.status === 'updated' ? 'Updated' :
                         detail.status === 'no_new_data' ? 'No new data' : 'Error'}
                      </Badge>
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
