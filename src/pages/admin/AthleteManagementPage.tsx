
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Upload, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AthleteTable from "@/components/admin/AthleteTable";
import AddAthleteDialog from "@/components/admin/AddAthleteDialog";
import BulkImportDialog from "@/components/admin/BulkImportDialog";
import { toast } from "sonner";

const AthleteManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);

  // Get athlete statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["athleteStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_athlete_stats");
      if (error) throw error;
      return data[0];
    },
  });

  // Get unique countries for filter
  const { data: countries } = useQuery({
    queryKey: ["athleteCountries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athletes")
        .select("country_of_origin")
        .not("country_of_origin", "is", null)
        .order("country_of_origin");
      
      if (error) throw error;
      
      const uniqueCountries = [...new Set(data.map(item => item.country_of_origin))];
      return uniqueCountries.filter(Boolean).sort();
    },
  });

  const resetFilters = () => {
    setSearchTerm("");
    setCountryFilter("");
    setActiveFilter("");
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Athlete Management</h1>
        <p className="text-muted-foreground">
          Manage athletes, add new ones, and import bulk data from CSV files.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.total_athletes || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Athletes</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.active_athletes || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Athletes</CardTitle>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.inactive_athletes || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.countries_count || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Badge variant="outline">Roles</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.positions_count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Athlete
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowBulkImportDialog(true)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Bulk Import from CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Athletes
          </CardTitle>
          <CardDescription>
            Search by name, country, nationality, or position. Use filters to narrow down results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search athletes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {countries?.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Athletes Database</CardTitle>
          <CardDescription>
            View and manage all athletes in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AthleteTable
            searchTerm={searchTerm}
            countryFilter={countryFilter}
            activeFilter={activeFilter}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddAthleteDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <BulkImportDialog
        open={showBulkImportDialog}
        onOpenChange={setShowBulkImportDialog}
      />
    </div>
  );
};

export default AthleteManagementPage;
