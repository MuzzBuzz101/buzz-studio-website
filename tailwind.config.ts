import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: {
          DEFAULT: "#0A0A0A",
          50: "#F5F5F5",
          100: "#E0E0E0",
          200: "#B8B8B8",
          300: "#8F8F8F",
          400: "#5C5C5C",
          500: "#2E2E2E",
          600: "#1C1C1C",
          700: "#161616",
          800: "#121212",
          900: "#0A0A0A",
          950: "#050505",
        },
        silver: {
          DEFAULT: "#C8C8C8",
          muted: "#9A9A9A",
        },
        accent: {
          DEFAULT: "#D4AF37",
          soft: "#E8D9A8",
        },
        border: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "fluid-hero": "clamp(2.75rem, 8vw, 8rem)",
        "fluid-xl": "clamp(2rem, 5vw, 4.5rem)",
        "fluid-lg": "clamp(1.5rem, 3vw, 2.75rem)",
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest2: "0.35em",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 24px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        bob: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, 8px, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Transform-based so the sweep composites on the GPU instead of
        // repainting the full viewport every frame.
        sheen: {
          "0%": { transform: "translate3d(-55%, 0, 0)" },
          "100%": { transform: "translate3d(55%, 0, 0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        // `both` fill so staggered delays hold the start frame instead of
        // flashing content before the animation begins.
        "fade-up": "fade-up 0.75s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 1s ease both",
        bob: "bob 1.8s ease-in-out infinite",
        sheen: "sheen 14s ease-in-out infinite alternate",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
        editorial: "cubic-bezier(0.83, 0, 0.17, 1)",
      },
      transitionDuration: {
        1200: "1200ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
