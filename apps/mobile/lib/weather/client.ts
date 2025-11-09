import { WeatherSnapshot } from '@/lib/types';

export interface WeatherClient {
  getCurrentWeather(
    location: { lat: number; lon: number } | { city: string }
  ): Promise<WeatherSnapshot>;
}

class OpenMeteoClient implements WeatherClient {
  async getCurrentWeather(
    location: { lat: number; lon: number } | { city: string }
  ): Promise<WeatherSnapshot> {
    let lat: number;
    let lon: number;
    let city: string | undefined;

    if ('city' in location) {
      const geocoded = await this.geocodeCity(location.city);
      lat = geocoded.lat;
      lon = geocoded.lon;
      city = location.city;
    } else {
      lat = location.lat;
      lon = location.lon;
      city = undefined;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    const weatherCode = data.current.weather_code;
    const condition = this.getConditionFromCode(weatherCode);

    return {
      takenAt: Date.now(),
      lat: Math.round(lat * 100) / 100,
      lon: Math.round(lon * 100) / 100,
      city,
      tempC: Math.round(data.current.temperature_2m),
      tempMinC: Math.round(data.daily.temperature_2m_min[0]),
      tempMaxC: Math.round(data.daily.temperature_2m_max[0]),
      feelsLikeC: Math.round(data.current.apparent_temperature),
      windKph: Math.round(data.current.wind_speed_10m * 3.6),
      precipMm: data.current.precipitation || 0,
      condition,
    };
  }

  private async geocodeCity(
    city: string
  ): Promise<{ lat: number; lon: number }> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
    };
  }

  private getConditionFromCode(code: number): string {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }
}

export const weatherClient: WeatherClient = new OpenMeteoClient();
