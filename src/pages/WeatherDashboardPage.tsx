import React from 'react';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { WeatherSearch } from '../components/weather/WeatherSearch';
import { WeatherCurrent } from '../components/weather/WeatherCurrent';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';
import { WeatherChart } from '../components/weather/WeatherChart';

export const WeatherDashboardPage: React.FC<{ weatherState: ReturnType<typeof useWeather> }> = ({ weatherState }) => {
  const { selectedLocation, weather, loading, error, unit, recentCities, selectCity, removeRecentCity, refreshWeather, searchCities } = weatherState;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <WeatherSearch
        selectedLocation={selectedLocation}
        recentCities={recentCities}
        onSelectCity={selectCity}
        onRemoveRecent={removeRecentCity}
        onSearchApi={searchCities}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Forecast Telemetry Error</div>
              <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
            </div>
          </div>
          <button onClick={refreshWeather} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /><span>Retry</span>
          </button>
        </div>
      )}

      {loading && !weather && (
        <div className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Querying Open-Meteo Global Forecast Models...</span>
        </div>
      )}

      {weather && (
        <div className="space-y-6">
          <WeatherCurrent weather={weather} unit={unit} />
          <WeatherChart weather={weather} unit={unit} />
          <HourlyForecast hourly={weather.hourly} unit={unit} />
          <DailyForecast daily={weather.daily} unit={unit} />
        </div>
      )}
    </div>
  );
};