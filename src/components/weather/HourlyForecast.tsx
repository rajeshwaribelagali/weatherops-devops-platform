import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../../types/weather';
import { getWeatherCondition } from '../../services/weatherService';
import { WeatherIcon } from './WeatherIcon';

export const HourlyForecast: React.FC<{ hourly: HourlyForecastItem[]; unit: TemperatureUnit }> = ({ hourly, unit }) => {
  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const speedSymbol = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">Hourly Telemetry (Next 24 Hours)</h3>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {hourly.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode);
          return (
            <div
              key={item.time}
              className={`flex flex-col items-center min-w-[80px] py-3 px-2 rounded-xl border shrink-0 ${
                idx === 0 ? 'bg-cyan-950/40 border-cyan-800/60' : 'bg-slate-950/50 border-slate-800/60'
              }`}
            >
              <span className="text-xs font-mono text-slate-400">{item.formattedTime}</span>
              <div className="my-2"><WeatherIcon name={condition.iconName} className="w-5 h-5" /></div>
              <span className="text-sm font-bold font-mono text-slate-100">{item.temperature}{tempSymbol}</span>
              <div className="flex items-center gap-0.5 mt-2 text-[10px] font-mono text-cyan-400">
                <Droplets className="w-2.5 h-2.5" /><span>{item.precipitationProbability}%</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">{item.windSpeed} {speedSymbol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};