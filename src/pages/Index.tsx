import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { Coords, WeatherData, fetchWeather, geocodeCity } from "@/lib/weather";
import { toast } from "sonner";
import { Cloud, Sparkles, Zap } from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Coords | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);

  const runSearch = async (value: string) => {
    setLoading(true);
    try {
      const loc = await geocodeCity(value);
      const weather = await fetchWeather(loc.lat, loc.lon);
      setLocation(loc);
      setData(weather);
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível buscar a previsão.");
    } finally {
      setLoading(false);
    }
  };

  // Default city on first visit
  useEffect(() => {
    runSearch("São Paulo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />

      <header className="relative z-10 container pt-8 pb-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="relative">
            <Cloud className="w-7 h-7 text-primary" />
            <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            NS Soluções em TI<span className="text-primary">.</span>
          </span>
        </a>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
          <Zap className="w-3 h-3 text-accent" /> Dados em tempo real · Open-Meteo
        </span>
      </header>

      <section className="relative z-10 container pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          Previsão precisa para qualquer lugar do mundo
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight animate-fade-up">
          Previsão do tempo
          <br />
          <span className="neon-text">no seu pulso.</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-up">
          Consulte o clima de qualquer cidade ao redor do mundo.
          Dados atualizados, visual neon, zero fricção.
        </p>

        <div className="mt-10">
          <SearchBar onSearch={runSearch} loading={loading} />
        </div>
      </section>

      {location && data && (
        <div className="relative z-10 container pb-20">
          <WeatherDisplay location={location} data={data} />
        </div>
      )}

      <footer className="relative z-10 container py-8 text-center text-xs text-muted-foreground">
        Construído com Open-Meteo · Lovable
      </footer>
    </main>
  );
};

export default Index;
