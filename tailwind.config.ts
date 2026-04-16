// tailwind.config.ts
import type { Config } from "tailwindcss";

/**
 * Tailwind v4 + HeroUI v3 config.
 * HeroUI v3 is CSS-first - no heroui() plugin needed.
 * Theme tokens come from @import "@heroui/styles" in globals.css.
 * Typography plugin declared via @plugin in globals.css.
 */

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;
