import { GeoLocation, WeatherData, DailyForecastItem, HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { observabilityService } from './observabilityService';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
}

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunny skies' : 'Clear starry skies',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Scattered clouds, predominantly sunny',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        category: 'clear',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Variable cloudiness with sun intervals',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Persistent dense cloud cover',
        iconName: 'Cloud',
        category: 'cloudy',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Restricted visibility, depositing rime fog',
        iconName: 'CloudFog',
        category: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light fine misty precipitation',
        iconName: 'CloudDrizzle',
        category: 'rain',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing mist on surfaces',
        iconName: 'CloudHail',
        category: 'snow',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Intermittent gentle rainfall',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady consistent precipitation',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Intense rain showers and downpours',
        iconName: 'CloudLightning',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Hazardous freezing rain causing glaze',
        iconName: 'CloudHail',
        category: 'snow',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        description: 'Accumulating snowfall',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Fine ice pellets and frozen grains',
        iconName: 'Snowflake',
        category: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Sudden convective rain bursts',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Brisk passing snow squalls',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Active electrical storm and convective gusts',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm & Hail',
        description: 'Severe storm with hail and intense winds',
        iconName: 'Zap',
        category: 'thunderstorm',
      };
    default:
      return {
        label: 'Variable',
        description: 'Unclassified atmospheric condition',
        iconName: 'CloudSun',
        category: 'cloudy',
      };
  }
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): { label: string; color: string; description: string } {
  if (uvIndex < 3) return { label: 'Low', color: 'text-emerald-400', description: 'Minimal sun hazard' };
  if (uvIndex < 6) return { label: 'Moderate', color: 'text-amber-400', description: 'Protection advised at midday' };
  if (uvIndex < 8) return { label: 'High', color: 'text-orange-400', description: 'Sun protection essential' };
  if (uvIndex < 11) return { label: 'Very High', color: 'text-rose-400', description: 'Extra caution needed' };
  return { label: 'Extreme', color: 'text-purple-400', description: 'Avoid midday direct sun' };
}

export async function searchCities(
  query: string,
  signal?: AbortSignal,
  countryFilter?: string,
  stateFilter?: string
): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const executeSearch = async (term: string) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=15&language=en&format=json`;
    const startTime = performance.now();
    try {
      const response = await fetch(url, { signal });
      const durationMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        observabilityService.recordRequest({
          endpoint: url,
          method: 'GET',
          status: response.status,
          durationMs,
          sizeBytes: 0,
          success: false,
        });
        return [];
      }

      const data = await response.json();
      const sizeBytes = JSON.stringify(data).length;

      observabilityService.recordRequest({
        endpoint: url,
        method: 'GET',
        status: response.status,
        durationMs,
        sizeBytes,
        success: true,
      });

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((item: any) => ({
        id: item.id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation,
        country_code: item.country_code,
        country: item.country,
        admin1: item.admin1,
        admin2: item.admin2,
        admin3: item.admin3,
        timezone: item.timezone,
      })) as GeoLocation[];
    } catch (err: unknown) {
      if (signal?.aborted) throw err;
      const durationMs = Math.round(performance.now() - startTime);
      observabilityService.recordRequest({
        endpoint: url,
        method: 'GET',
        status: 0,
        durationMs,
        sizeBytes: 0,
        success: false,
      });
      return [];
    }
  };

  let results = await executeSearch(trimmed);

  if (countryFilter) {
    let countryMatches = results.filter(
      r => r.country_code?.toUpperCase() === countryFilter.toUpperCase()
    );

    if (countryMatches.length === 0) {
      const retryTerm = stateFilter ? `${trimmed} ${stateFilter}` : `${trimmed} India`;
      const retryResults = await executeSearch(retryTerm);
      countryMatches = retryResults.filter(
        r => r.country_code?.toUpperCase() === countryFilter.toUpperCase()
      );
      if (countryMatches.length > 0) {
        results = retryResults;
      }
    }

    if (countryMatches.length > 0) {
      if (stateFilter) {
        const stateMatches = countryMatches.filter(
          r =>
            r.admin1?.toLowerCase().includes(stateFilter.toLowerCase()) ||
            r.admin2?.toLowerCase().includes(stateFilter.toLowerCase()) ||
            r.admin3?.toLowerCase().includes(stateFilter.toLowerCase())
        );
        if (stateMatches.length > 0) return stateMatches;
      }
      return countryMatches;
    }
  }

  return results;
}

export async function fetchWeatherData(
  location: GeoLocation,
  units: TemperatureUnit = 'metric',
  signal?: AbortSignal
): Promise<WeatherData> {
  const tempUnitParam = units === 'imperial' ? '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch' : '';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto${tempUnitParam}`;

  const startTime = performance.now();

  try {
    const response = await fetch(url, { signal });
    const durationMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      observabilityService.recordRequest({
        endpoint: url,
        method: 'GET',
        status: response.status,
        durationMs,
        sizeBytes: 0,
        success: false,
      });
      throw new Error(`Open-Meteo Forecast API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const sizeBytes = JSON.stringify(data).length;

    observabilityService.recordRequest({
      endpoint: url,
      method: 'GET',
      status: response.status,
      durationMs,
      sizeBytes,
      success: true,
    });

    const current = {
      time: data.current.time,
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
      relativeHumidity: Math.round(data.current.relative_humidity_2m),
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
      windDirection: Math.round(data.current.wind_direction_10m),
      windGusts: Math.round(data.current.wind_gusts_10m * 10) / 10,
      uvIndex: Math.round(data.current.uv_index * 10) / 10,
      cloudCover: Math.round(data.current.cloud_cover),
      surfacePressure: Math.round(data.current.surface_pressure),
      precipitation: Math.round(data.current.precipitation * 10) / 10,
      isDay: Boolean(data.current.is_day),
    };

    const hourlyTimes: string[] = data.hourly.time;
    const nowIso = new Date().toISOString();
    let startIndex = hourlyTimes.findIndex(t => t >= nowIso.substring(0, 13));
    if (startIndex === -1 || startIndex > hourlyTimes.length - 24) {
      startIndex = Math.max(0, hourlyTimes.length - 24);
    }
    const endIndex = Math.min(startIndex + 24, hourlyTimes.length);

    const hourly: HourlyForecastItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      const dateObj = new Date(hourlyTimes[i]);
      const hourNum = dateObj.getHours();
      const formattedTime = i === startIndex ? 'Now' : `${hourNum.toString().padStart(2, '0')}:00`;

      hourly.push({
        time: hourlyTimes[i],
        formattedTime,
        temperature: Math.round(data.hourly.temperature_2m[i] * 10) / 10,
        relativeHumidity: Math.round(data.hourly.relative_humidity_2m[i]),
        precipitationProbability: Math.round(data.hourly.precipitation_probability[i] ?? 0),
        weatherCode: data.hourly.weather_code[i],
        windSpeed: Math.round(data.hourly.wind_speed_10m[i] * 10) / 10,
        uvIndex: Math.round((data.hourly.uv_index?.[i] ?? 0) * 10) / 10,
      });
    }

    const dailyTimes: string[] = data.daily.time;
    const daily: DailyForecastItem[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < Math.min(7, dailyTimes.length); i++) {
      const dateObj = new Date(dailyTimes[i] + 'T00:00:00');
      const isToday = i === 0;
      const dayName = isToday ? 'Today' : dayNames[dateObj.getDay()];

      daily.push({
        date: dailyTimes[i],
        formattedDate: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        dayName,
        weatherCode: data.daily.weather_code[i],
        temperatureMax: Math.round(data.daily.temperature_2m_max[i] * 10) / 10,
        temperatureMin: Math.round(data.daily.temperature_2m_min[i] * 10) / 10,
        precipitationProbabilityMax: Math.round(data.daily.precipitation_probability_max?.[i] ?? 0),
        precipitationSum: Math.round((data.daily.precipitation_sum?.[i] ?? 0) * 10) / 10,
        windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i] * 10) / 10,
        uvIndexMax: Math.round((data.daily.uv_index_max?.[i] ?? 0) * 10) / 10,
        sunrise: data.daily.sunrise[i] ? new Date(data.daily.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        sunset: data.daily.sunset[i] ? new Date(data.daily.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
      });
    }

    return {
      location,
      current,
      hourly,
      daily,
      elevation: data.elevation ?? 0,
      timezone: data.timezone ?? 'auto',
      fetchedAt: new Date().toLocaleTimeString(),
    };
  } catch (err: unknown) {
    if (signal?.aborted) throw err;
    const durationMs = Math.round(performance.now() - startTime);
    observabilityService.recordRequest({
      endpoint: url,
      method: 'GET',
      status: 0,
      durationMs,
      sizeBytes: 0,
      success: false,
    });
    throw err;
  }
}