import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

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
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#ffffff",
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
            // Tilføj semantic colors for navigation
            content1: "#ffffff",
            content2: "#f4f4f5",
            divider: "#e4e4e7",
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
            background: "#09090b",
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
            // Semantic colors for navigation
            content1: "#18181b",
            content2: "#27272a",
            divider: "#3f3f46",
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