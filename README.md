# Den Blå Angora 🐰

En moderne webapplikation til avl og administration af angorakaniner, bygget med Next.js og tilknyttet Dansk Angora Klub.

## 📋 Om Projektet

Den Blå Angora er en omfattende platform der gør det nemt for kaninavlere at:
- **Registrere og administrere** deres kaniner med detaljerede stamtavler
- **Købe og sælge** kaniner, uld, garn, skind og andre kanin-relaterede produkter
- **Finde parringsparate kaniner** fra andre avlere
- **Holde styr på** klipninger, vægtmålinger og andre vigtige data
- **Dele nyheder og opdateringer** gennem blogfunktionen

Platformen er udviklet specifikt til det danske marked og Dansk Angora Klubs medlemmer.

## ✨ Funktioner

### Kaninregister
- **Stamtavle-visning**: Interaktiv stamtavle med ReactFlow til overblik over slægtskab
- **Detaljeret registrering**: Registrér farve, vægt, klipdata og meget mere
- **Søgning og filtrering**: Find præcis de kaniner du leder efter

### Markedsplads (Annoncer)
- **Kaniner til salg**: Køb og sælg kaniner med detaljerede beskrivelser
- **Produkter**: Handl med uld, garn, skind og andre kanin-relaterede varer
- **Parringssøgning**: Find egnede parringspartnere til dine kaniner

### Brugerprofil
- **Min profil**: Administrér dine personlige oplysninger
- **Mine kaniner**: Overblik over hele din kaninstald
- **Mine annoncer**: Administrér dine salgsopslag
- **Mine blogs**: Del viden og erfaringer med andre avlere

### Blog-system
- **Nyheder**: Hold dig opdateret med de seneste nyheder fra klubben
- **Patch Notes**: Se hvad der er nyt på platformen
- **Brugerblogs**: Del dine egne historier og erfaringer

## 🛠️ Teknologier

Dette projekt er bygget med moderne web-teknologier:

- **Framework**: [Next.js 16](https://nextjs.org/) med App Router
- **Sprog**: TypeScript
- **UI-bibliotek**: React 19
- **Styling**: 
  - Tailwind CSS
  - Hero UI (komponenter)
  - Framer Motion (animationer)
- **Formularhåndtering**: React Hook Form + Zod validering
- **State Management**: Zustand
- **Rich Text Editor**: Lexical
- **Billede-upload**: Cloudinary
- **Ikoner**: React Icons
- **SEO**: Next Sitemap

## 🚀 Kom i Gang

### Forudsætninger

- Node.js 22.x eller nyere
- npm, yarn, pnpm eller bun

### Installation

1. **Klon repository'et**
```bash
git clone https://github.com/Mikfri/DB-Angora-NextJS.git
cd DB-Angora-NextJS
```

2. **Installér dependencies**
```bash
npm install
# eller
yarn install
# eller
pnpm install
```

3. **Kør udviklingsserveren**
```bash
npm run dev
# eller med Turbopack (hurtigere)
npm run dev --turbo
```

4. **Åbn i browseren**

Naviger til [http://localhost:3000](http://localhost:3000) for at se applikationen.

## 📜 Tilgængelige Scripts

```bash
# Start udviklingsserver med Turbopack (anbefalet)
npm run dev

# Start udviklingsserver med Webpack
npm run dev:webpack

# Byg til produktion
npm run build

# Start produktionsserver
npm start

# Kør linting
npm run lint

# Ryd op i projekt (slet .next, node_modules, package-lock.json)
npm run clean
```

## 📁 Projektstruktur

```
DB-Angora-NextJS/
├── public/              # Statiske filer (billeder, favicon, etc.)
├── src/
│   ├── app/            # Next.js App Router sider
│   │   ├── about/      # Om-siden
│   │   ├── account/    # Brugerkonti og profiler
│   │   ├── actions/    # Server Actions
│   │   ├── annoncer/   # Markedsplads for salg
│   │   └── blogs/      # Blog-system
│   ├── components/     # Genanvendelige React-komponenter
│   │   ├── auth/       # Autentificering
│   │   ├── cards/      # Kortkomponenter
│   │   ├── header/     # Header og navigation
│   │   ├── footer/     # Footer
│   │   ├── pedigree/   # Stamtavle-visning
│   │   └── ...
│   ├── api/            # API-typer og kald
│   ├── constants/      # Konstanter og konfiguration
│   ├── contexts/       # React Contexts
│   ├── hooks/          # Custom React Hooks
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type-definitioner
│   └── utils/          # Hjælpefunktioner
├── next.config.ts      # Next.js konfiguration
├── tailwind.config.ts  # Tailwind CSS konfiguration
└── tsconfig.json       # TypeScript konfiguration
```

## 🌐 Backend Integration

Applikationen kommunikerer med en backend REST API på `api.db-angora.dk` og benytter:
- Cloudinary til billede-upload og -håndtering
- Metadata og struktureret data (Schema.org) til SEO

## 🔧 Udvikling

### Kodestil

Projektet benytter:
- ESLint til code linting
- TypeScript til type-sikkerhed
- Tailwind CSS til konsistent styling

## 🤝 Bidrag

Dette projekt er udviklet til Dansk Angora Klub, som målgruppe. Kontakt projektejeren for information om bidrag.

## 📄 Licens

Dette projekt er privat og ejes af Mikkel Friborg.

## 👤 Udvikler

**Mikkel Friborg**
- Fynsvej 14, 4060 Kirke Såby

## 🔗 Links

- **Live site**: [https://db-angora.dk](https://db-angora.dk)
- **Dansk Angora Klub**: Information findes på platformen

---

**Version**: 0.1.0 | **Sidste opdatering**: Februar 2026
