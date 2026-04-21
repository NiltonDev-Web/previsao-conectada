import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSearch: (value: string) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading }: Props) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      <form onSubmit={handleSubmit} className="relative neon-border rounded-full glass shadow-card">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          type="search"
          inputMode="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Digite uma cidade (ex: São Paulo)"
          className="w-full bg-transparent outline-none pl-14 pr-36 py-5 text-base placeholder:text-muted-foreground"
          aria-label="Buscar por cidade"
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
