
import { useState, useEffect } from 'react';
import { Profile } from '@/contexts/AuthContext';

export const useProfileForm = (profile: Profile | null) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
    
    useEffect(() => {
        if (profile) {
          setName(profile.full_name || '');
          setCountry(profile.country || '');
          setFavoriteSports(profile.favorite_sports || []);
        }
      }, [profile]);
    
    const handleSportChange = (sport: string) => {
        setFavoriteSports(prev => 
          prev.includes(sport) 
            ? prev.filter(s => s !== sport)
            : [...prev, sport]
        );
    };

    return {
        name,
        setName,
        country,
        setCountry,
        favoriteSports,
        handleSportChange,
    };
};
