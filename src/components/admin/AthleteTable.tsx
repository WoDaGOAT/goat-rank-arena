
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, ChevronLeft, ChevronRight, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import EditAthleteDialog from "./EditAthleteDialog";
import DeleteAthleteDialog from "./DeleteAthleteDialog";
import { useAthleteEnrichment } from "@/hooks/useAthleteEnrichment";
import { toast } from "sonner";
import EnrichmentPreviewDialog from "./EnrichmentPreviewDialog";

interface AthleteTableProps {
  searchTerm: string;
  countryFilter: string;
  activeFilter: string;
}

const AthleteTable = ({ searchTerm, countryFilter, activeFilter }: AthleteTableProps) => {
  const [page, setPage] = useState(0);
  const [editingAthlete, setEditingAthlete] = useState<any>(null);
  const [deletingAthlete, setDeletingAthlete] = useState<any>(null);
  const [enrichingAthleteId, setEnrichingAthleteId] = useState<string | null>(null);
  const [selectedAthleteForEnrichment, setSelectedAthleteForEnrichment] = useState<any>(null);
  const [showEnrichmentDialog, setShowEnrichmentDialog] = useState(false);
  const limit = 20;

  const { enrichAthlete, isEnriching } = useAthleteEnrichment();

  const { data: athleteData, isLoading, refetch } = useQuery({
    queryKey: ["athletesAdmin", searchTerm, countryFilter, activeFilter, page],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_athletes_admin", {
        p_search_term: searchTerm || null,
        p_country_filter: countryFilter || null,
        p_active_filter: activeFilter ? activeFilter === "true" : null,
        p_limit: limit,
        p_offset: page * limit,
      });

      if (error) throw error;
      return data;
    },
  });

  const athletes = athleteData || [];
  const totalCount = athletes[0]?.total_count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Simplified function to check if athlete has truly missing data
  const hasMissingData = (athlete: any) => {
    return !athlete.country_of_origin || 
           !athlete.nationality || 
           !athlete.year_of_birth || 
           !athlete.positions || 
           athlete.positions.length === 0 || 
           !athlete.profile_picture_url ||
           !athlete.career_start_year ||
           (!athlete.is_active && !athlete.career_end_year);
  };

  const handleEdit = (athlete: any) => {
    setEditingAthlete(athlete);
  };

  const handleDelete = (athlete: any) => {
    setDeletingAthlete(athlete);
  };

  const handleEnrichAthlete = async (athlete: any) => {
    setEnrichingAthleteId(athlete.id);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body: { single_athlete_id: athlete.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Enrichment error:', error);
        toast.error(`Enrichment failed: ${error.message}`);
        return;
      }

      if (data?.athlete_suggestions && data.athlete_suggestions.length > 0) {
        const athleteWithSuggestions = data.athlete_suggestions[0];
        if (athleteWithSuggestions.suggestions.length > 0) {
          setSelectedAthleteForEnrichment(athleteWithSuggestions);
          setShowEnrichmentDialog(true);
        } else {
          toast.info("No high-quality enrichment opportunities found for this athlete");
        }
      } else {
        toast.info("No enrichment opportunities found for this athlete");
      }

    } catch (error) {
      console.error('Error during enrichment:', error);
      toast.error("Failed to scan for enrichment opportunities");
    } finally {
      setEnrichingAthleteId(null);
    }
  };

  const onAthleteUpdated = () => {
    refetch();
    setEditingAthlete(null);
    setDeletingAthlete(null);
  };

  const handleEnrichmentComplete = () => {
    refetch();
    setShowEnrichmentDialog(false);
    setSelectedAthleteForEnrichment(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Clubs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Birth Year</TableHead>
                <TableHead>Career Span</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No athletes found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                athletes.map((athlete) => (
                  <TableRow key={athlete.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={athlete.profile_picture_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {athlete.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {athlete.name}
                    </TableCell>
                    <TableCell>
                      {athlete.country_of_origin || "N/A"}
                    </TableCell>
                    <TableCell>
                      {athlete.nationality || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {athlete.positions?.slice(0, 2).map((position: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {position}
                          </Badge>
                        ))}
                        {athlete.positions?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{athlete.positions.length - 2}
                          </Badge>
                        )}
                        {(!athlete.positions || athlete.positions.length === 0) && (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {athlete.clubs?.slice(0, 2).map((club: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {club}
                          </Badge>
                        ))}
                        {athlete.clubs?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{athlete.clubs.length - 2}
                          </Badge>
                        )}
                        {(!athlete.clubs || athlete.clubs.length === 0) && (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={athlete.is_active ? "default" : "secondary"}>
                        {athlete.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {athlete.year_of_birth || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {athlete.career_start_year || athlete.career_end_year ? (
                          <span>
                            {athlete.career_start_year || "?"} - {athlete.career_end_year || (athlete.is_active ? "Present" : "?")}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {hasMissingData(athlete) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEnrichAthlete(athlete)}
                            disabled={isEnriching || enrichingAthleteId === athlete.id}
                            className="text-blue-600 hover:text-blue-700"
                            title="Find high-quality data to enrich this athlete's profile"
                          >
                            <Database className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(athlete)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(athlete)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Dialogs */}
        {editingAthlete && (
          <EditAthleteDialog
            athlete={editingAthlete}
            open={!!editingAthlete}
            onOpenChange={(open) => !open && setEditingAthlete(null)}
            onAthleteUpdated={onAthleteUpdated}
          />
        )}

        {deletingAthlete && (
          <DeleteAthleteDialog
            athlete={deletingAthlete}
            open={!!deletingAthlete}
            onOpenChange={(open) => !open && setDeletingAthlete(null)}
            onAthleteDeleted={onAthleteUpdated}
          />
        )}
      </div>

      <EnrichmentPreviewDialog
        open={showEnrichmentDialog}
        onOpenChange={setShowEnrichmentDialog}
        athleteData={selectedAthleteForEnrichment}
        onApprovalComplete={handleEnrichmentComplete}
      />
    </>
  );
};

export default AthleteTable;
