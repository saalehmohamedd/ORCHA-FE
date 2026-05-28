import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#111318",
        panel: "#181b22",
        panelSoft: "#20242d",
        line: "#2d3340",
        indigoMuted: "#7c8cf8",
        cyanSoft: "#7dd3fc"
      },
      boxShadow: {
        focus: "0 0 0 1px rgba(125, 211, 252, 0.25), 0 12px 40px rgba(0, 0, 0, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
