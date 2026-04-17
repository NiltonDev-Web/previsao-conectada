import { useState } from "react";
import { Search, MapPin, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SearchMode = "city" | "cep";

interface Props {
  onSearch: (mode: SearchMode, value: string) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading }: Props) => {
  const [mode, setMode] = useState<SearchMode>("city");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(mode, value.trim());
  };

  const placeholder = mode === "city" ? "Digite uma cidade (ex: São Paulo)" : "Digite o CEP (ex: 01310-100)";

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      <div className="inline-flex p-1 rounded-full glass mb-4">
        {(["city", "cep"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
              mode === m
                ? "bg-gradient-neon text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "city" ? <MapPin className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
            {m === "city" ? "Cidade" : "CEP"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative neon-border rounded-full glass shadow-card">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          type={mode === "cep" ? "text" : "search"}
          inputMode={mode === "cep" ? "numeric" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none pl-14 pr-36 py-5 text-base placeholder:text-muted-foreground"
          aria-label={mode === "city" ? "Buscar por cidade" : "Buscar por CEP"}
        />
        <Button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-neon text-primary-foreground hover:opacity-90 shadow-glow font-semibold px-6"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Consultar"}
        </Button>
      </form>
    </div>
  );
};
