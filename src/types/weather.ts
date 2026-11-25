export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  country?: string;
  admin1?: string; // State or region
  admin2?: string; // District or division
  admin3?: string; // Sub-district or area
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  cloudCover: number;
  surfacePressure: number;
  precipitation: number;
  isDay: boolean;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  formattedDate: string;
  dayName: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  elevation: number;
  timezone: string;
  fetchedAt: string;
}

export type TemperatureUnit = 'metric' | 'imperial';