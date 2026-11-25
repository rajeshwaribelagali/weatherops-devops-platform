import React from 'react';
import { 
  Sun, Moon, SunMedium, MoonStar, CloudSun, CloudMoon, 
  Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, 
  CloudHail, CloudSnow, Snowflake, Zap 
} from 'lucide-react';

export const WeatherIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Sun': return <Sun className={`${className} text-amber-400`} />;
    case 'SunMedium': return <SunMedium className={`${className} text-amber-300`} />;
    case 'Moon': return <Moon className={`${className} text-indigo-300`} />;
    case 'MoonStar': return <MoonStar className={`${className} text-indigo-300`} />;
    case 'CloudSun': return <CloudSun className={`${className} text-amber-400`} />;
    case 'CloudMoon': return <CloudMoon className={`${className} text-blue-300`} />;
    case 'Cloud': return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog': return <CloudFog className={`${className} text-slate-400`} />;
    case 'CloudDrizzle': return <CloudDrizzle className={`${className} text-cyan-400`} />;
    case 'CloudRain': return <CloudRain className={`${className} text-blue-400`} />;
    case 'CloudLightning': return <CloudLightning className={`${className} text-amber-400`} />;
    case 'CloudHail': return <CloudHail className={`${className} text-cyan-300`} />;
    case 'CloudSnow': return <CloudSnow className={`${className} text-blue-200`} />;
    case 'Snowflake': return <Snowflake className={`${className} text-cyan-200`} />;
    case 'Zap': return <Zap className={`${className} text-yellow-400`} />;
    default: return <Sun className={`${className} text-amber-400`} />;
  }
};