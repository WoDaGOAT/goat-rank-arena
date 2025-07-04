
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfileUpdater } from "@/hooks/useProfileUpdater";
import { useCallback } from "react";

interface ProfileFormProps {
    name: string;
    setName: (name: string) => void;
    country: string;
    setCountry: (country: string) => void;
    user: User;
    favoriteSports: string[];
    handleSportChange: (sport: string) => void;
    availableSports: string[];
}

const ProfileForm = ({ name, setName, country, setCountry, user, favoriteSports, handleSportChange, availableSports }: ProfileFormProps) => {
    const { handleSaveChanges } = useProfileUpdater();

    const handleNameChange = useCallback((value: string) => {
        setName(value);
    }, [setName]);

    const handleNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveChanges({ name, country, favoriteSports });
        }
    }, [name, country, favoriteSports, handleSaveChanges]);

    const handleNameBlur = useCallback(() => {
        handleSaveChanges({ name, country, favoriteSports });
    }, [name, country, favoriteSports, handleSaveChanges]);

    const handleCountryChange = useCallback((value: string) => {
        setCountry(value);
    }, [setCountry]);

    const handleCountryKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveChanges({ name, country, favoriteSports });
        }
    }, [name, country, favoriteSports, handleSaveChanges]);

    const handleCountryBlur = useCallback(() => {
        handleSaveChanges({ name, country, favoriteSports });
    }, [name, country, favoriteSports, handleSaveChanges]);

    const handleSportToggle = useCallback((sport: string) => {
        const newFavoriteSports = favoriteSports.includes(sport) 
            ? favoriteSports.filter(s => s !== sport)
            : [...favoriteSports, sport];
        
        handleSportChange(sport);
        handleSaveChanges({ name, country, favoriteSports: newFavoriteSports });
    }, [favoriteSports, name, country, handleSportChange, handleSaveChanges]);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Basic Info</h3>
            <div>
                <Label htmlFor="name-profile">Display Name</Label>
                <Input 
                    id="name-profile" 
                    value={name} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    onBlur={handleNameBlur}
                    className="bg-white/10 border-gray-600 focus:border-blue-500" 
                />
            </div>
            <div>
                <Label htmlFor="email-profile">Email</Label>
                <Input id="email-profile" type="email" value={user.email || ''} readOnly className="bg-white/10 border-gray-600 cursor-not-allowed" />
            </div>
            <div>
                <Label htmlFor="country-profile">Country</Label>
                <Input 
                    id="country-profile" 
                    value={country} 
                    onChange={(e) => handleCountryChange(e.target.value)}
                    onKeyDown={handleCountryKeyDown}
                    onBlur={handleCountryBlur}
                    className="bg-white/10 border-gray-600 focus:border-blue-500" 
                    placeholder="e.g. United States" 
                />
            </div>
            <div>
                <Label>Favorite Sport(s)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                    {availableSports.map(sport => (
                        <div key={sport} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sport-${sport}`}
                                checked={favoriteSports.includes(sport)}
                                onCheckedChange={() => handleSportToggle(sport)}
                                className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <Label htmlFor={`sport-${sport}`} className="font-normal cursor-pointer">{sport}</Label>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <Label>Date Joined</Label>
                <p className="text-gray-300 pt-2">{user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A'}</p>
            </div>
        </div>
    );
}

export default ProfileForm;
