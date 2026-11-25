import React, { useState } from 'react';
import { TrendingUp, Thermometer, Droplets, Wind } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';

export const WeatherChart: React.FC<{ weather: WeatherData; unit: TemperatureUnit }> = ({ weather, unit }) => {
  const [metric, setMetric] = useState<'temperature' | 'precipitation' | 'wind'>('temperature');
  const hourly = weather.hourly.slice(0, 24);
  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const speedSymbol = unit === 'metric' ? 'km/h' : 'mph';

  const points = hourly.map(item => {
    if (metric === 'temperature') return item.temperature;
    if (metric === 'precipitation') return item.precipitationProbability;
    return item.windSpeed;
  });

  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const width = 800;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const coords = points.map((val, idx) => ({
    x: paddingX + (idx / (points.length - 1)) * (width - paddingX * 2),
    y: height - paddingY - ((val - minVal) / range) * (height - paddingY * 2),
    val,
    time: hourly[idx].formattedTime,
  }));

  const pathD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Forecast Analytics &amp; Trends</h3>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setMetric('temperature')}
            className={`px-3 py-1 text-xs rounded transition-all ${metric === 'temperature' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
          >
            Temperature
          </button>
          <button
            onClick={() => setMetric('precipitation')}
            className={`px-3 py-1 text-xs rounded transition-all ${metric === 'precipitation' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-400'}`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setMetric('wind')}
            className={`px-3 py-1 text-xs rounded transition-all ${metric === 'wind' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
          >
            Wind Speed
          </button>
        </div>
      </div>

      <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1e293b" />
          <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={3} fill="#06b6d4" />
              {i % 3 === 0 && (
                <text x={c.x} y={height - 6} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  {c.time}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};