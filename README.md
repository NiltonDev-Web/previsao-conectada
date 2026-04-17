# 🌩️ Nimbus — Previsão do Tempo Neon

Uma landing page **moderna, dark mode com estética neon**, para consultar a previsão do tempo de qualquer lugar do Brasil (e do mundo) por **cidade** ou **CEP da rua**.

> Construído com React + Vite + TypeScript + Tailwind, usando APIs públicas e gratuitas (sem necessidade de chave de API).

---

## 📑 Sumário

- [Demonstração](#-demonstração)
- [Funcionalidades](#-funcionalidades)
- [Stack & Bibliotecas](#-stack--bibliotecas)
- [APIs Utilizadas](#-apis-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Design System](#-design-system)
- [Passo a passo do desenvolvimento](#-passo-a-passo-do-desenvolvimento)
- [Como rodar localmente](#-como-rodar-localmente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Créditos](#-créditos)

---

## 🚀 Demonstração

- **Hero** com headline grande, texto com gradiente neon e busca centralizada.
- **Toggle Cidade / CEP** para alternar o modo de busca.
- **Card principal** com temperatura atual, sensação térmica, umidade e vento.
- **Lista horária** (próximas 24h) com scroll horizontal.
- **Previsão de 7 dias** com ícone, descrição, probabilidade de chuva e mín/máx.
- Carrega automaticamente a previsão de **São Paulo** ao abrir.

---

## ✨ Funcionalidades

- 🔍 **Busca por cidade** (qualquer lugar do mundo, em português).
- 📮 **Busca por CEP brasileiro** (8 dígitos, com ou sem hífen) — converte CEP em endereço usando ViaCEP e geocoda para latitude/longitude.
- 🌡️ **Clima atual**: temperatura, sensação térmica, umidade, vento e descrição amigável (com emoji).
- ⏰ **Previsão horária** das próximas 24 horas.
- 📅 **Previsão diária** dos próximos 7 dias com probabilidade de chuva.
- 🎨 **Design neon dark mode**: glassmorphism, bordas neon, gradientes radiais, animações suaves.
- 📱 **Responsivo** — funciona bem em mobile, tablet e desktop.
- ♿ **Acessível**: labels em inputs, contraste adequado, navegação por teclado.
- 🔎 **SEO**: `<title>`, meta description, Open Graph, idioma `pt-BR`, canonical.
- ⚡ **Sem chaves de API** — funciona imediatamente, sem cadastro.

---

## 🧱 Stack & Bibliotecas

| Categoria | Tecnologia |
|---|---|
| Framework | **React 18** + **Vite 5** |
| Linguagem | **TypeScript 5** |
| Estilo | **Tailwind CSS v3** + design tokens semânticos |
| UI Kit | **shadcn/ui** (Radix UI primitives) |
| Ícones | **lucide-react** |
| Toasts | **sonner** |
| Roteamento | **react-router-dom** |
| Data fetching | `fetch` nativo |

---

## 🌐 APIs Utilizadas

Todas **gratuitas e sem necessidade de cadastro / API key**:

1. **[Open-Meteo Forecast API](https://open-meteo.com/)**
   `https://api.open-meteo.com/v1/forecast`
   Retorna previsão atual, horária e diária a partir de latitude/longitude.

2. **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)**
   `https://geocoding-api.open-meteo.com/v1/search`
   Converte nome de cidade em coordenadas geográficas.

3. **[ViaCEP](https://viacep.com.br/)**
   `https://viacep.com.br/ws/{CEP}/json/`
   Converte CEP brasileiro em endereço (logradouro, bairro, cidade, UF). O endereço é então geocodificado pela Open-Meteo para obter coordenadas.

---

## 🗂️ Arquitetura do Projeto

```
src/
├── components/
│   ├── SearchBar.tsx       # Barra de busca com toggle Cidade/CEP
│   ├── WeatherDisplay.tsx  # Card atual + horária + 7 dias
│   └── ui/                 # Componentes shadcn (button, toast, etc.)
├── lib/
│   ├── utils.ts            # cn() helper
│   └── weather.ts          # Lógica de API: ViaCEP, geocoding, Open-Meteo
├── pages/
│   ├── Index.tsx           # Landing page principal
│   └── NotFound.tsx
├── index.css               # Design system (HSL tokens, gradientes, animações)
├── App.tsx                 # Router + providers
└── main.tsx                # Entry point

index.html                  # Meta tags SEO + fontes (Space Grotesk + Inter)
tailwind.config.ts          # Tokens estendidos (cores, fontes, sombras, gradientes)
```

### Fluxo de uma consulta

```
Usuário digita
   │
   ├─ Modo "Cidade" ──► geocodeCity()  ──► { lat, lon }
   │
   └─ Modo "CEP"    ──► lookupCep()
                          ├─ ViaCEP  → { logradouro, cidade, UF }
                          └─ geocodeCity("cidade, UF, Brasil") → { lat, lon }
                                  │
                                  ▼
                         fetchWeather(lat, lon)   (Open-Meteo)
                                  │
                                  ▼
                          WeatherDisplay renderiza
```

---

## 🎨 Design System

Toda a estética está centralizada em `src/index.css` e `tailwind.config.ts`.
**Nenhum componente usa cores hardcoded** — apenas tokens semânticos.

### Paleta neon (HSL)

| Token | Cor | Uso |
|---|---|---|
| `--background` | `230 35% 5%` | Fundo principal (deep navy) |
| `--primary` | `190 100% 55%` | Ciano neon (CTA, ícones) |
| `--secondary` | `280 90% 65%` | Roxo neon (acentos) |
| `--accent` | `320 100% 65%` | Magenta neon (destaques) |
| `--muted` | `230 25% 14%` | Cards e superfícies elevadas |

### Gradientes & sombras

- `--gradient-hero` — radiais roxo + ciano sobre navy escuro (fundo do body).
- `--gradient-neon` — ciano → roxo (CTAs, ícones).
- `--gradient-text` — ciano → magenta (headline neon).
- `--shadow-neon` — glow ciano + roxo (botões e cards de destaque).

### Tipografia

- **Display**: `Space Grotesk` (700) — títulos, temperatura grande.
- **Body**: `Inter` (400/500/600) — textos e UI.
- Carregadas via Google Fonts (`<link>` em `index.html`).

### Utilities customizadas (`@layer utilities`)

- `.glass` — glassmorphism com `backdrop-filter`.
- `.neon-text` — gradiente aplicado em texto (`background-clip: text`).
- `.neon-border` — borda gradiente via `mask-composite`.
- `.grid-bg` — grade sutil de fundo com fade radial.

### Animações (`@layer components`)

- `float-slow` — flutuação suave (emoji do clima).
- `pulse-glow` — pulso luminoso (orbes do hero, indicador "ao vivo").
- `fade-up` — entrada dos blocos.

---

## 🛠️ Passo a passo do desenvolvimento

Documentação cronológica de como o projeto foi construído.

### 1. Levantamento de requisitos
O usuário pediu uma **landing page moderna de previsão do tempo** com a opção de buscar por **CEP da rua** ou **cidade**. Foram feitas três perguntas de clarificação:
- **API**: Open-Meteo (grátis, sem chave). ✅
- **Visual**: Dark mode com neon. ✅
- **CEP**: Cidade + CEP brasileiro. ✅

### 2. Design System primeiro
Antes de escrever qualquer componente, o `src/index.css` e o `tailwind.config.ts` foram reescritos:
- Definidos tokens HSL para paleta neon.
- Adicionados gradientes, sombras, fontes (`Space Grotesk` + `Inter`).
- Criadas utilities (`.glass`, `.neon-text`, `.neon-border`, `.grid-bg`).
- Definidos keyframes para animações sutis.

### 3. SEO e fontes (`index.html`)
- `lang="pt-BR"`.
- `<title>` e `meta description` otimizados (~60 e ~160 caracteres).
- Open Graph + Twitter Card.
- Preconnect e import das fontes Google.
- `<link rel="canonical">`.

### 4. Camada de dados (`src/lib/weather.ts`)
Funções puras, isoladas da UI:
- `isCep(v)` / `sanitizeCep(v)` — validação.
- `lookupCep(cep)` — chama ViaCEP, depois geocoda a cidade resultante.
- `geocodeCity(query)` — chama a Open-Meteo Geocoding API.
- `fetchWeather(lat, lon)` — chama a Open-Meteo Forecast com `current`, `hourly`, `daily`.
- `describeWeather(code)` — mapeia o `weather_code` da WMO em label PT-BR + emoji.
- `formatDay()` / `formatHour()` — formatação localizada.

### 5. Componentes de UI

**`SearchBar.tsx`**
- Toggle pill com dois modos (Cidade / CEP), gradiente neon no item ativo.
- Input arredondado em glass + borda neon, ícone de lupa, botão "Consultar" embutido.
- Estado de `loading` com spinner (lucide `Loader2`).
- `inputMode="numeric"` quando o modo é CEP.

**`WeatherDisplay.tsx`**
- **Card atual**: orbes desfocadas animadas no fundo, temperatura gigante com gradiente, emoji do clima flutuando, 3 stats (umidade, vento, sensação).
- **Horária**: scroll horizontal com snap, mostra próximas 24h filtradas a partir do horário atual.
- **7 dias**: lista com divisores, ícone, descrição, % de chuva e mín/máx.

### 6. Página `Index.tsx`
- Header com logotipo "Nimbus" + badge "Dados em tempo real".
- Hero com badge "ao vivo", headline em duas linhas (segunda linha em `neon-text`), subtítulo.
- `<SearchBar>` integrada com `runSearch()`.
- Carrega **São Paulo** automaticamente no mount via `useEffect`.
- Erros tratados com `toast.error` (sonner).
- Footer minimalista com créditos.

### 7. Validação e tratamento de erros
- CEP é validado antes do fetch (mensagem clara se inválido).
- ViaCEP retorna `erro: true` quando não encontra → mensagem "CEP não encontrado".
- Open-Meteo Geocoding sem resultados → "Cidade não encontrada".
- Qualquer falha de rede mostra um toast amigável.

### 8. Acessibilidade & responsividade
- `aria-label` no input de busca.
- Contraste verificado em modo escuro.
- Grid `md:grid-cols-2` no card atual; `md:grid-cols-[1.2fr_2fr_auto_auto]` na lista de 7 dias.
- Lista horária com `overflow-x-auto` e `snap-x` no mobile.

---

## 💻 Como rodar localmente

> Pré-requisitos: **Node.js 18+** e **npm** (ou `bun`/`pnpm`).

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:8080
```

Não é necessário criar arquivo `.env` — todas as APIs usadas são públicas.

---

## 📜 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite). |
| `npm run build` | Gera o build de produção em `dist/`. |
| `npm run preview` | Visualiza o build de produção localmente. |
| `npm run lint` | Roda o ESLint. |
| `npm run test` | Roda os testes (Vitest). |

---

## 🌍 Deploy

O projeto é uma SPA estática — pode ser publicada em qualquer host estático:

- **Lovable** → botão *Publish* dentro do editor.
- **Vercel / Netlify / Cloudflare Pages** → conectar o repositório, build command `npm run build`, output `dist`.

---

## 🗺️ Roadmap

Ideias para próximas iterações:

- [ ] 📍 Botão "usar minha localização" (Geolocation API).
- [ ] ⭐ Cidades favoritas salvas em `localStorage`.
- [ ] 🌡️ Toggle °C / °F.
- [ ] 🌅 Nascer/pôr do sol, índice UV, qualidade do ar.
- [ ] 🗺️ Mapa interativo com camadas de chuva/temperatura.
- [ ] 🌐 Internacionalização (i18n) PT/EN/ES.
- [ ] 🔔 PWA com notificações de alerta meteorológico.

---

## 🙏 Créditos

- Dados meteorológicos: **[Open-Meteo](https://open-meteo.com/)**
- CEPs brasileiros: **[ViaCEP](https://viacep.com.br/)**
- Componentes UI: **[shadcn/ui](https://ui.shadcn.com/)**
- Ícones: **[Lucide](https://lucide.dev/)**
- Fontes: **[Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)** + **[Inter](https://fonts.google.com/specimen/Inter)**
- Construído com **[Lovable](https://lovable.dev/)** ⚡

---

<sub>Feito com ☕ e muito neon.</sub>
