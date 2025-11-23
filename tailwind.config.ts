import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

/**
 * Arkitektur: Hvordan next-themes + HeroUI samarbejder
Package	----- Ansvar ------	Eksempel
next-themes ---	Håndterer theme state (light/dark toggle)	--- Sætter .dark class på <html>
HeroUI ---	Leverer design tokens (farver, spacing) ---	content1, divider, primary
tailwind.config.ts ---	Definerer farver per theme ---	light: { content1: "#fff" }, dark: { content1: "#1a1d24" }
globals.css ---	Bruger tokens fra HeroUI ---	@apply bg-content1 border-divider
 */

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Disse peger på HeroUI's auto-genererede CSS-variabler
        background: "hsl(var(--heroui-background))",
        foreground: "hsl(var(--heroui-foreground))",
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(to bottom, #d4dce8 0%, #b8c4d6 50%, #9fb0c8 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #0d0e11 0%, #16181d 50%, #1f2229 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#e8eef7", // Base farve for light mode gradient
            foreground: "#1e293b",
            primary: {
              DEFAULT: "#3b82f6",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#06b6d4",
              foreground: "#ffffff",
            },
            default: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              DEFAULT: "#f4f4f5",
              foreground: "#18181b",
            },
            // 🎨 NAVIGATION THEME TOKENS
            content1: "#ffffff",      // Nav backgrounds (ren hvid for kontrast)
            content2: "#f4f4f5",      // Hover states (lysegrå)
            divider: "#e4e4e7",       // Borders/dividers
          },
          layout: {
            dividerWeight: "1px",
            radius: {
              small: "8px",
              medium: "12px",
              large: "16px",
            },
          },
        },
        dark: {
          colors: {
            background: "#181a20", // Base farve for dark mode gradient
            foreground: "#fafafa",
            primary: {
              DEFAULT: "#3b82f6",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#06b6d4",
              foreground: "#ffffff",
            },
            default: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              DEFAULT: "#27272a",
              foreground: "#fafafa",
            },
            // 🎨 NAVIGATION THEME TOKENS
            content1: "#23262e",      // Nav backgrounds (lysere end baggrund)
            content2: "#27272a",      // Hover states (lysere mørk)
            divider: "#3f3f46",       // Borders/dividers
          },
          layout: {
            dividerWeight: "1px",
            radius: {
              small: "8px",
              medium: "12px",
              large: "16px",
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;