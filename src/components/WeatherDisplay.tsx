import { Droplets, Wind, Thermometer, MapPin, CloudRain } from "lucide-react";
import { WeatherData, describeWeather, formatDay, formatHour, Coords } from "@/lib/weather";

interface Props {
  location: Coords;
  data: WeatherData;
}

export const WeatherDisplay = ({ location, data }: Props) => {
  const cur = describeWeather(data.current.code);

  return (
    <section className="w-full max-w-5xl mx-auto mt-12 space-y-6 animate-fade-up">
      {/* Current */}
      <div className="glass neon-border rounded-3xl p-8 md:p-10 shadow-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-secondary/20 blur-3xl animate-pulse-glow" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{location.name}{location.admin ? `, ${location.admin}` : ""}{location.country ? ` · ${location.country}` : ""}</span>
            </div>
            <h2 className="font-display text-7xl md:text-8xl font-bold neon-text leading-none">
              {Math.round(data.current.temp)}°
            </h2>
            <p className="mt-3 text-xl text-foreground/90 flex items-center gap-2">
              <span className="text-3xl animate-float-slow inline-block">{cur.emoji}</span>
              {cur.label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sensação térmica {Math.round(data.current.feels)}°
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<Droplets className="w-5 h-5" />} label="Umidade" value={`${data.current.humidity}%`} />
            <Stat icon={<Wind className="w-5 h-5" />} label="Vento" value={`${Math.round(data.current.wind)} km/h`} />
            <Stat icon={<Thermometer className="w-5 h-5" />} label="Sensação" value={`${Math.round(data.current.feels)}°`} />
          </div>
        </div>
      </div>

      {/* Hourly */}
      <div className="glass rounded-3xl p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold mb-4 text-foreground/90">Próximas 24 horas</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
          {data.hourly.map((h) => {
            const w = describeWeather(h.code);
            return (
              <div
                key={h.time}
                className="snap-start shrink-0 w-20 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border/40 transition-colors py-4 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">{formatHour(h.time)}</span>
                <span className="text-2xl">{w.emoji}</span>
                <span className="text-sm font-semibold">{Math.round(h.temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily */}
      <div className="glass rounded-3xl p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold mb-4 text-foreground/90">Próximos 7 dias</h3>
        <ul className="divide-y divide-border/40">
          {data.daily.map((d) => {
            const w = describeWeather(d.code);
            return (
              <li key={d.date} className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.2fr_2fr_auto_auto] items-center gap-4 py-3">
                <span className="capitalize text-sm md:text-base">{formatDay(d.date)}</span>
                <span className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-xl">{w.emoji}</span>
                  {w.label}
                </span>
                <span className="md:hidden text-2xl">{w.emoji}</span>
                <span className="flex items-center gap-1 text-xs text-secondary">
                  <CloudRain className="w-3.5 h-3.5" /> {d.precip}%
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  <span className="text-muted-foreground">{Math.round(d.min)}°</span>
                  <span className="mx-1.5 text-border">/</span>
                  <span>{Math.round(d.max)}°</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 flex flex-col items-center text-center gap-1">
    <span className="text-primary">{icon}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-semibold text-sm">{value}</span>
  </div>
);
