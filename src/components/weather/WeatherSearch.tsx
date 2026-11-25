import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History, Globe2, Building2, ChevronDown, Check } from 'lucide-react';
import { GeoLocation } from '../../types/weather';
import { PRESET_CITIES } from '../../hooks/useWeather';

export const INDIAN_STATES = [
  'All States & UTs',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Gujarat',
  'West Bengal',
  'Kerala',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Goa',
  'Assam',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jharkhand',
  'Chhattisgarh',
  'Jammu & Kashmir',
  'Chandigarh',
  'Puducherry',
] as const;

export const POPULAR_INDIAN_AREAS = [
  { name: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', query: 'Koramangala Bengaluru' },
  { name: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', query: 'Whitefield Bengaluru' },
  { name: 'HSR Layout', city: 'Bengaluru', state: 'Karnataka', query: 'HSR Layout Bengaluru' },
  { name: 'Bandra', city: 'Mumbai', state: 'Maharashtra', query: 'Bandra Mumbai' },
  { name: 'Andheri', city: 'Mumbai', state: 'Maharashtra', query: 'Andheri Mumbai' },
  { name: 'Connaught Place', city: 'New Delhi', state: 'Delhi', query: 'Connaught Place Delhi' },
  { name: 'Cyber City', city: 'Gurugram', state: 'Haryana', query: 'DLF Cyber City' },
  { name: 'Hitec City', city: 'Hyderabad', state: 'Telangana', query: 'HITEC City Hyderabad' },
  { name: 'T Nagar', city: 'Chennai', state: 'Tamil Nadu', query: 'T Nagar Chennai' },
  { name: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', query: 'Salt Lake Kolkata' },
];

interface WeatherSearchProps {
  selectedLocation: GeoLocation;
  recentCities: GeoLocation[];
  onSelectCity: (location: GeoLocation) => void;
  onRemoveRecent: (id: number, e: React.MouseEvent) => void;
  onSearchApi: (query: string, signal?: AbortSignal, countryFilter?: string, stateFilter?: string) => Promise<GeoLocation[]>;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({
  selectedLocation,
  recentCities,
  onSelectCity,
  onRemoveRecent,
  onSearchApi,
}) => {
  const [scope, setScope] = useState<'india' | 'global'>('india');
  const [selectedState, setSelectedState] = useState<string>('All States & UTs');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);
    setSearchError(null);

    const countryFilter = scope === 'india' ? 'IN' : undefined;
    const stateFilter = (scope === 'india' && selectedState !== 'All States & UTs') ? selectedState : undefined;

    const timer = setTimeout(async () => {
      try {
        const data = await onSearchApi(query, controller.signal, countryFilter, stateFilter);
        setResults(data);
        setIsOpen(true);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setSearchError('Unable to reach geocoding service. Please check connection.');
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, scope, selectedState, onSearchApi]);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleQuickAreaSearch = (areaQuery: string) => {
    setQuery(areaQuery);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setScope('india')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scope === 'india'
                ? 'bg-gradient-to-r from-orange-500/20 via-emerald-500/10 to-emerald-500/20 text-white border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-sm">🇮🇳</span>
            <span>India Live Weather (State / City / Area)</span>
          </button>

          <button
            type="button"
            onClick={() => setScope('global')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scope === 'global'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Worldwide</span>
          </button>
        </div>

        {scope === 'india' && (
          <div className="relative" ref={stateDropdownRef}>
            <button
              type="button"
              onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-xl hover:border-slate-600 transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>State: <strong className="text-white font-semibold">{selectedState}</strong></span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStateDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-56 max-h-64 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 backdrop-blur-xl divide-y divide-slate-800/60">
                {INDIAN_STATES.map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSelectedState(st);
                      setIsStateDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left rounded-lg transition-colors ${
                      selectedState === st
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedState === st && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={
              scope === 'india'
                ? selectedState !== 'All States & UTs'
                  ? `Search area, locality, or district in ${selectedState} (e.g. Koramangala, Whitefield, Indiranagar)...`
                  : 'Search Indian State, City, or local Area (e.g. Bengaluru, Mumbai, Bandra, Koramangala, Connaught Place)...'
                : 'Search city, state, or capital worldwide (e.g. Tokyo, London, San Francisco)...'
            }
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-inner"
          />
          {isSearching && (
            <Loader2 className="absolute right-3.5 w-4 h-4 text-emerald-400 animate-spin" />
          )}
          {!isSearching && query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {searchError ? (
              <div className="p-4 text-xs text-rose-400">{searchError}</div>
            ) : results.length > 0 ? (
              <ul className="py-1.5 max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {results.map(city => (
                  <li key={`${city.id}-${city.latitude}-${city.longitude}`}>
                    <button
                      onClick={() => handleSelect(city)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100 group-hover:text-emerald-300">
                              {city.name}
                            </span>
                            {city.country_code === 'IN' && (
                              <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                🇮🇳 India
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {[city.admin3, city.admin2, city.admin1, city.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0 ml-3">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-xs text-slate-400 text-center">
                No matching locations found for "{query}" in {scope === 'india' ? (selectedState !== 'All States & UTs' ? selectedState : 'India') : 'Global'}.
              </div>
            )}
          </div>
        )}
      </div>

      {scope === 'india' && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Building2 className="w-3 h-3 text-emerald-400" /> Popular Localities:
          </span>
          {POPULAR_INDIAN_AREAS.map(area => (
            <button
              key={area.query}
              type="button"
              onClick={() => handleQuickAreaSearch(area.query)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <strong className="font-semibold text-emerald-400">{area.name}</strong>{' '}
              <span className="text-slate-500">({area.city})</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Major Metros:</span>
        {PRESET_CITIES.map(preset => {
          const isCurrent = selectedLocation.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isCurrent
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
              }`}
            >
              {preset.name}
            </button>
          );
        })}

        {recentCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 ml-auto">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <History className="w-3 h-3" /> Recent:
            </span>
            {recentCities.slice(0, 4).map(city => {
              const isCurrent = selectedLocation.id === city.id;
              return (
                <div
                  key={`recent-${city.id}`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                    isCurrent
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => handleSelect(city)}
                    className="hover:underline truncate max-w-[100px]"
                  >
                    {city.name}
                  </button>
                  <button
                    onClick={e => onRemoveRecent(city.id, e)}
                    className="p-0.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title={`Remove ${city.name} from recent history`}
                    aria-label={`Remove ${city.name}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};