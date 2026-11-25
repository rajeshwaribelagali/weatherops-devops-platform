import { useState, useEffect, useCallback, useRef } from 'react';
import { GeoLocation, WeatherData, TemperatureUnit } from '../types/weather';
import { fetchWeatherData, searchCities } from '../services/weatherService';

export const PRESET_CITIES: GeoLocation[] = [
  { id: 1277333, name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, country: 'India', country_code: 'IN', admin1: 'Karnataka', admin2: 'Bengaluru Urban' },
  { id: 1275339, name: 'Mumbai', latitude: 19.076, longitude: 72.8777, country: 'India', country_code: 'IN', admin1: 'Maharashtra', admin2: 'Mumbai Suburban' },
  { id: 1261481, name: 'New Delhi', latitude: 28.6139, longitude: 77.209, country: 'India', country_code: 'IN', admin1: 'Delhi', admin2: 'New Delhi' },
  { id: 1269843, name: 'Hyderabad', latitude: 17.385, longitude: 78.4867, country: 'India', country_code: 'IN', admin1: 'Telangana', admin2: 'Hyderabad' },
  { id: 1264527, name: 'Chennai', latitude: 13.0827, longitude: 80.2707, country: 'India', country_code: 'IN', admin1: 'Tamil Nadu', admin2: 'Chennai' },
  { id: 1275004, name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, country: 'India', country_code: 'IN', admin1: 'West Bengal', admin2: 'Kolkata' },
  { id: 1259229, name: 'Pune', latitude: 18.5204, longitude: 73.8567, country: 'India', country_code: 'IN', admin1: 'Maharashtra', admin2: 'Pune' },
  { id: 1279233, name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, country: 'India', country_code: 'IN', admin1: 'Gujarat', admin2: 'Ahmedabad' },
  { id: 1269515, name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, country: 'India', country_code: 'IN', admin1: 'Rajasthan', admin2: 'Jaipur' },
];

const STORAGE_RECENT_KEY = 'weatherops_recent_cities_v1';
const STORAGE_UNIT_KEY = 'weatherops_temp_unit_v1';

export function useWeather() {
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch {
      // fallback
    }
    return PRESET_CITIES[0]; // Bengaluru (India) default
  });

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_UNIT_KEY);
      if (stored === 'imperial' || stored === 'metric') return stored;
    } catch {
      // fallback
    }
    return 'metric';
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [recentCities, setRecentCities] = useState<GeoLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.slice(0, 6);
      }
    } catch {
      // fallback
    }
    return [PRESET_CITIES[0], PRESET_CITIES[1], PRESET_CITIES[2]];
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadWeather = useCallback(async (location: GeoLocation, tempUnit: TemperatureUnit) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location, tempUnit, controller.signal);
      setWeather(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Failed to fetch weather forecast';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCity = useCallback((location: GeoLocation) => {
    setSelectedLocation(location);

    setRecentCities(prev => {
      const filtered = prev.filter(c => c.id !== location.id && !(c.latitude === location.latitude && c.longitude === location.longitude));
      const updated = [location, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const removeRecentCity = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentCities(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const next = prev === 'metric' ? 'imperial' : 'metric';
      try {
        localStorage.setItem(STORAGE_UNIT_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    loadWeather(selectedLocation, unit);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedLocation, unit, loadWeather]);

  const refreshWeather = useCallback(() => {
    loadWeather(selectedLocation, unit);
  }, [loadWeather, selectedLocation, unit]);

  return {
    selectedLocation,
    weather,
    loading,
    error,
    unit,
    recentCities,
    selectCity,
    removeRecentCity,
    toggleUnit,
    refreshWeather,
    searchCities,
  };
}