import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
          950: "#0b122e",
        },
        cyanpop: {
          50: "#ecfeff",
          100: "#cffafe",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        purplepop: {
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        surface: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.08)",
        "card-hover": "0 12px 25px rgba(15,23,42,0.10), 0 25px 70px rgba(37,99,235,0.14)",
        glow: "0 0 0 4px rgba(37,99,235,0.18)",
        brand: "0 18px 55px rgba(37,99,235,0.35)",
      },
      backgroundImage: {
        "brand-radial": "radial-gradient(circle at top left, rgba(34,211,238,0.35), transparent 32%), radial-gradient(circle at top right, rgba(168,85,247,0.35), transparent 30%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0891b2 100%)",
        "soft-grid": "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-down": "slideDown 0.35s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.5s infinite linear",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
