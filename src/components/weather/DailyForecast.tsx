import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../../types/weather';
import { getWeatherCondition } from '../../services/weatherService';
import { WeatherIcon } from './WeatherIcon';

export const DailyForecast: React.FC<{ daily: DailyForecastItem[]; unit: TemperatureUnit }> = ({ daily, unit }) => {
  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const allMins = daily.map(d => d.temperatureMin);
  const allMaxs = daily.map(d => d.temperatureMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempSpan = Math.max(1, globalMax - globalMin);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">7-Day Synoptic Outlook</h3>
      </div>
      <div className="space-y-2.5">
        {daily.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode);
          const leftPercent = Math.max(0, Math.min(100, ((item.temperatureMin - globalMin) / tempSpan) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((item.temperatureMax - item.temperatureMin) / tempSpan) * 100));

          return (
            <div key={item.date} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border bg-slate-950/40 border-slate-800/50">
              <div className="flex items-center gap-3 w-36 shrink-0">
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
                  <WeatherIcon name={condition.iconName} className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{item.dayName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{item.formattedDate}</div>
                </div>
              </div>
              <div className="text-xs text-slate-300 w-28 truncate">{condition.label}</div>
              <div className="flex items-center gap-1 w-20 text-xs font-mono text-cyan-400">
                <Droplets className="w-3 h-3" /><span>{item.precipitationProbabilityMax}%</span>
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                <span className="w-8 text-right font-mono text-xs text-blue-300">{item.temperatureMin}{tempSymbol}</span>
                <div className="relative flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-amber-400" style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }} />
                </div>
                <span className="w-8 text-left font-mono text-xs text-amber-300 font-bold">{item.temperatureMax}{tempSymbol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};