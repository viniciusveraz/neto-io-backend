import axios from 'axios';
import { env } from '../config/env';
import {
  kmhToKnots,
  degreesToCardinal,
  analyzeKiteConditions,
  KiteConditionAnalysis,
} from '../utils/wind-calculator';
import { AppError } from '../utils/app-error';

// Coordenadas geográficas oficiais de Barra Grande (Cajueiro da Praia, PI)
const BARRA_GRANDE_COORDS = {
  name: 'Barra Grande',
  municipality: 'Cajueiro da Praia',
  state: 'Piauí',
  latitude: -2.9189,
  longitude: -41.4058,
  timezone: 'America/Fortaleza',
};

export interface CurrentWeatherResponse {
  location: {
    spot: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  updatedAt: string;
  temperatureC: number;
  humidityPercent: number;
  wind: {
    speedKmh: number;
    speedKnots: number;
    gustsKmh: number;
    gustsKnots: number;
    directionDegrees: number;
    cardinal: {
      code: string;
      label: string;
    };
  };
  kitesurf: KiteConditionAnalysis;
}

export interface HourlyForecastItem {
  time: string;
  temperatureC: number;
  windSpeedKmh: number;
  windSpeedKnots: number;
  windGustsKnots: number;
  directionDegrees: number;
  cardinal: string;
  isKitable: boolean;
}

export interface WindHistoryForecastResponse {
  location: {
    spot: string;
    city: string;
    state: string;
  };
  updatedAt: string;
  summary: {
    maxWindKnots: number;
    avgWindKnots: number;
    bestHourTime?: string;
  };
  hourly: HourlyForecastItem[];
}

export class WeatherService {
  /**
   * Obtém as condições climáticas e de vento em tempo real para Barra Grande (BG)
   */
  async getCurrentWeatherBarraGrande(): Promise<CurrentWeatherResponse> {
    try {
      const url = `${env.openMeteoBaseUrl}/forecast`;
      const response = await axios.get(url, {
        params: {
          latitude: BARRA_GRANDE_COORDS.latitude,
          longitude: BARRA_GRANDE_COORDS.longitude,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
          wind_speed_unit: 'kmh',
          timezone: BARRA_GRANDE_COORDS.timezone,
        },
        timeout: 7000,
      });

      const current = response.data.current;
      if (!current) {
        throw new AppError('Dados meteorológicos indisponíveis no momento.', 502);
      }

      const windSpeedKmh = Number(current.wind_speed_10m);
      const windGustsKmh = Number(current.wind_gusts_10m ?? windSpeedKmh * 1.25);
      const windSpeedKnots = kmhToKnots(windSpeedKmh);
      const windGustsKnots = kmhToKnots(windGustsKmh);
      const windDirectionDegrees = Number(current.wind_direction_10m);
      const cardinal = degreesToCardinal(windDirectionDegrees);
      const kiteAnalysis = analyzeKiteConditions(windSpeedKnots, windDirectionDegrees);

      return {
        location: {
          spot: BARRA_GRANDE_COORDS.name,
          city: BARRA_GRANDE_COORDS.municipality,
          state: BARRA_GRANDE_COORDS.state,
          latitude: BARRA_GRANDE_COORDS.latitude,
          longitude: BARRA_GRANDE_COORDS.longitude,
        },
        updatedAt: current.time,
        temperatureC: Number(current.temperature_2m),
        humidityPercent: Number(current.relative_humidity_2m),
        wind: {
          speedKmh: windSpeedKmh,
          speedKnots: windSpeedKnots,
          gustsKmh: windGustsKmh,
          gustsKnots: windGustsKnots,
          directionDegrees: windDirectionDegrees,
          cardinal,
        },
        kitesurf: kiteAnalysis,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(`Falha ao consultar a API Open-Meteo: ${error.message}`, 502);
      }
      throw error;
    }
  }

  /**
   * Obtém histórico recente e previsão horária de vento para Barra Grande (para gráficos de kitesurf na UI)
   */
  async getWindHistoryAndForecast(): Promise<WindHistoryForecastResponse> {
    try {
      const url = `${env.openMeteoBaseUrl}/forecast`;
      const response = await axios.get(url, {
        params: {
          latitude: BARRA_GRANDE_COORDS.latitude,
          longitude: BARRA_GRANDE_COORDS.longitude,
          hourly: 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
          wind_speed_unit: 'kmh',
          forecast_days: 2,
          past_days: 1,
          timezone: BARRA_GRANDE_COORDS.timezone,
        },
        timeout: 7000,
      });

      const hourly = response.data.hourly;
      if (!hourly || !hourly.time) {
        throw new AppError('Dados históricos e previsão de vento indisponíveis.', 502);
      }

      const times: string[] = hourly.time;
      const speeds: number[] = hourly.wind_speed_10m;
      const gusts: number[] = hourly.wind_gusts_10m;
      const directions: number[] = hourly.wind_direction_10m;
      const temps: number[] = hourly.temperature_2m;

      const now = new Date();
      // Filtra últimas 12 horas e próximas 24 horas para o gráfico da UI
      const windowStart = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const items: HourlyForecastItem[] = [];
      let totalKnots = 0;
      let maxKnots = 0;
      let bestHourTime: string | undefined = undefined;

      for (let i = 0; i < times.length; i++) {
        const itemDate = new Date(times[i]);
        if (itemDate >= windowStart && itemDate <= windowEnd) {
          const speedKmh = speeds[i] ?? 0;
          const gustKmh = gusts[i] ?? speedKmh;
          const knots = kmhToKnots(speedKmh);
          const gustKnots = kmhToKnots(gustKmh);
          const dirDeg = directions[i] ?? 0;

          if (knots > maxKnots) {
            maxKnots = knots;
            bestHourTime = times[i];
          }
          totalKnots += knots;

          items.push({
            time: times[i],
            temperatureC: Number(temps[i]),
            windSpeedKmh: speedKmh,
            windSpeedKnots: knots,
            windGustsKnots: gustKnots,
            directionDegrees: dirDeg,
            cardinal: degreesToCardinal(dirDeg).code,
            isKitable: knots >= 12,
          });
        }
      }

      const avgKnots = items.length > 0 ? Number((totalKnots / items.length).toFixed(1)) : 0;

      return {
        location: {
          spot: BARRA_GRANDE_COORDS.name,
          city: BARRA_GRANDE_COORDS.municipality,
          state: BARRA_GRANDE_COORDS.state,
        },
        updatedAt: new Date().toISOString(),
        summary: {
          maxWindKnots: maxKnots,
          avgWindKnots: avgKnots,
          bestHourTime,
        },
        hourly: items,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(`Falha ao consultar histórico da API Open-Meteo: ${error.message}`, 502);
      }
      throw error;
    }
  }
}
