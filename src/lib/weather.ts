// Weather utilities — Open-Meteo (no API key)

export type Coords = { lat: number; lon: number; name: string; admin?: string; country?: string };

export async function geocodeCity(query: string): Promise<Coords> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=pt&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar cidade");
  const data = await res.json();
  const r = data?.results?.[0];
  if (!r) throw new Error("Cidade não encontrada");
  return { lat: r.latitude, lon: r.longitude, name: r.name, admin: r.admin1, country: r.country };
}

export type WeatherData = {
  current: {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    code: number;
    isDay: boolean;
    time: string;
  };
  daily: Array<{ date: string; max: number; min: number; code: number; precip: number }>;
  hourly: Array<{ time: string; temp: number; code: number }>;
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Falha ao buscar previsão");
  const d = await res.json();

  const now = new Date();
  const hourly: WeatherData["hourly"] = d.hourly.time
    .map((t: string, i: number) => ({ time: t, temp: d.hourly.temperature_2m[i], code: d.hourly.weather_code[i] }))
    .filter((h: any) => new Date(h.time) >= now)
    .slice(0, 24);

  return {
    current: {
      temp: d.current.temperature_2m,
      feels: d.current.apparent_temperature,
      humidity: d.current.relative_humidity_2m,
      wind: d.current.wind_speed_10m,
      code: d.current.weather_code,
      isDay: d.current.is_day === 1,
      time: d.current.time,
    },
    daily: d.daily.time.map((t: string, i: number) => ({
      date: t,
      max: d.daily.temperature_2m_max[i],
      min: d.daily.temperature_2m_min[i],
      code: d.daily.weather_code[i],
      precip: d.daily.precipitation_probability_max[i] ?? 0,
    })),
    hourly,
  };
}

export function describeWeather(code: number): { label: string; emoji: string } {
  const map: Record<number, { label: string; emoji: string }> = {
    0: { label: "Céu limpo", emoji: "☀️" },
    1: { label: "Predominantemente claro", emoji: "🌤️" },
    2: { label: "Parcialmente nublado", emoji: "⛅" },
    3: { label: "Nublado", emoji: "☁️" },
    45: { label: "Neblina", emoji: "🌫️" },
    48: { label: "Neblina gelada", emoji: "🌫️" },
    51: { label: "Garoa leve", emoji: "🌦️" },
    53: { label: "Garoa", emoji: "🌦️" },
    55: { label: "Garoa intensa", emoji: "🌦️" },
    61: { label: "Chuva leve", emoji: "🌧️" },
    63: { label: "Chuva", emoji: "🌧️" },
    65: { label: "Chuva forte", emoji: "🌧️" },
    71: { label: "Neve leve", emoji: "🌨️" },
    73: { label: "Neve", emoji: "🌨️" },
    75: { label: "Neve forte", emoji: "❄️" },
    80: { label: "Pancadas de chuva", emoji: "🌦️" },
    81: { label: "Pancadas fortes", emoji: "⛈️" },
    82: { label: "Pancadas violentas", emoji: "⛈️" },
    95: { label: "Tempestade", emoji: "⛈️" },
    96: { label: "Tempestade c/ granizo", emoji: "⛈️" },
    99: { label: "Tempestade severa", emoji: "⛈️" },
  };
  return map[code] ?? { label: "—", emoji: "🌡️" };
}

export function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
