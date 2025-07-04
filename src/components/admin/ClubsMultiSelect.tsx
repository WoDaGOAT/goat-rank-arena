
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Club {
  id: string;
  name: string;
  country?: string;
  league?: string;
}

interface ClubsMultiSelectProps {
  selectedClubs: string[];
  onClubsChange: (clubs: string[]) => void;
  placeholder?: string;
}

const ClubsMultiSelect = ({ selectedClubs, onClubsChange, placeholder = "Select clubs..." }: ClubsMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch all clubs for autocomplete
  const { data: clubs = [], refetch: refetchClubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: async (): Promise<Club[]> => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Filter clubs based on search
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    !selectedClubs.includes(club.name)
  );

  const handleSelectClub = (clubName: string) => {
    if (!selectedClubs.includes(clubName)) {
      onClubsChange([...selectedClubs, clubName]);
    }
    setSearchValue("");
  };

  const handleRemoveClub = (clubName: string) => {
    onClubsChange(selectedClubs.filter(club => club !== clubName));
  };

  const handleAddNewClub = async () => {
    if (!searchValue.trim()) return;

    try {
      const { error } = await supabase
        .from("clubs")
        .insert([{ name: searchValue.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("Club already exists");
          return;
        }
        throw error;
      }

      handleSelectClub(searchValue.trim());
      await refetchClubs();
      setSearchValue("");
      setIsAddingNew(false);
      toast.success("Club added successfully");
    } catch (error: any) {
      toast.error("Failed to add club: " + error.message);
    }
  };

  const showAddNewButton = searchValue.trim() && 
    !clubs.some(club => club.name.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedClubs.length > 0 
              ? `${selectedClubs.length} club${selectedClubs.length > 1 ? 's' : ''} selected`
              : placeholder
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search clubs..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {searchValue ? "No clubs found." : "Start typing to search clubs..."}
              </CommandEmpty>
              <CommandGroup>
                {filteredClubs.map((club) => (
                  <CommandItem
                    key={club.id}
                    onSelect={() => handleSelectClub(club.name)}
                  >
                    <div className="flex flex-col">
                      <span>{club.name}</span>
                      {club.country && club.league && (
                        <span className="text-sm text-muted-foreground">
                          {club.league}, {club.country}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
                {showAddNewButton && (
                  <CommandItem onSelect={handleAddNewClub}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{searchValue}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected clubs display */}
      <div className="flex flex-wrap gap-2">
        {selectedClubs.map((clubName) => (
          <Badge key={clubName} variant="secondary" className="flex items-center gap-1">
            {clubName}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveClub(clubName)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ClubsMultiSelect;
