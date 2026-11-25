import React from 'react';
import { Wind, Droplets, Sun, Sunrise, Sunset, Gauge, Cloud, Compass } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { getWeatherCondition, getWindDirectionText, getUvCategory } from '../../services/weatherService';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCurrentProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherCurrent: React.FC<WeatherCurrentProps> = ({ weather, unit }) => {
  const { location, current, daily } = weather;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const windDirText = getWindDirectionText(current.windDirection);
  const uvCategory = getUvCategory(current.uvIndex);

  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const speedSymbol = unit === 'metric' ? 'km/h' : 'mph';
  const precipSymbol = unit === 'metric' ? 'mm' : 'in';
  const todayForecast = daily[0];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0e1726]/90 to-[#111c44]/80 border border-slate-800/80 p-5 md:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <span>{location.country_code ? `${location.country_code} ·` : ''}</span>
                <span>{location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E</span>
                <span>·</span>
                <span>Elev: {weather.elevation}m</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {location.name}
                {location.admin1 && <span className="text-slate-400 font-normal text-lg ml-2">{location.admin1}</span>}
              </h2>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl md:text-6xl font-extrabold text-white font-mono tracking-tighter tabular-nums">
                {current.temperature}
                <span className="text-2xl md:text-3xl font-normal text-cyan-400 ml-1">{tempSymbol}</span>
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <WeatherIcon name={condition.iconName} className="w-6 h-6" />
                  <span className="text-lg font-bold text-slate-100">{condition.label}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Feels like <strong className="text-slate-200">{current.apparentTemperature}{tempSymbol}</strong></span>
                  {todayForecast && (
                    <>
                      <span>·</span>
                      <span>H: <strong className="text-emerald-400">{todayForecast.temperatureMax}{tempSymbol}</strong></span>
                      <span>·</span>
                      <span>L: <strong className="text-blue-400">{todayForecast.temperatureMin}{tempSymbol}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md">
              {condition.description}. Atmospheric pressure is {current.surfacePressure} hPa with {current.cloudCover}% cloud coverage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:max-w-md w-full">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="flex items-center gap-1 font-medium"><Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind</span>
                <span className="font-mono text-[11px] text-cyan-300 font-bold">{windDirText}</span>
              </div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {current.windSpeed} <span className="text-xs font-normal text-slate-400">{speedSymbol}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">Gusts: {current.windGusts} {speedSymbol}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="flex items-center gap-1 font-medium"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity</span>
              </div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {current.relativeHumidity}<span className="text-xs font-normal text-slate-400">%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{current.relativeHumidity > 70 ? 'High' : 'Normal'}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="flex items-center gap-1 font-medium"><Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index</span>
                <span className={`text-[11px] font-semibold ${uvCategory.color}`}>{uvCategory.label}</span>
              </div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {current.uvIndex} <span className="text-xs font-normal text-slate-400">/ 11+</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{uvCategory.description}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-3 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500">Sunrise</div>
                  <div className="text-xs font-mono font-bold text-slate-200">{todayForecast?.sunrise ?? '--:--'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500">Sunset</div>
                  <div className="text-xs font-mono font-bold text-slate-200">{todayForecast?.sunset ?? '--:--'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-slate-400">Surface Pressure</div>
            <div className="text-sm font-bold font-mono text-white">{current.surfacePressure} hPa</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
          <Cloud className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-slate-400">Cloud Cover</div>
            <div className="text-sm font-bold font-mono text-white">{current.cloudCover}%</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
          <Droplets className="w-4 h-4 text-teal-400" />
          <div>
            <div className="text-slate-400">Precipitation</div>
            <div className="text-sm font-bold font-mono text-white">{current.precipitation} {precipSymbol}</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
          <Compass className="w-4 h-4 text-indigo-400" />
          <div>
            <div className="text-slate-400">Wind Heading</div>
            <div className="text-sm font-bold font-mono text-white">{current.windDirection}° ({windDirText})</div>
          </div>
        </div>
      </div>
    </div>
  );
};