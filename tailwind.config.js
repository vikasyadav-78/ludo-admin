/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#0B1120",
        secondaryBg: "#111827",
        cardBg: "#1A2235",
        accent: "#00D4FF",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#FFFFFF",
        secondaryText: "#94A3B8",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
