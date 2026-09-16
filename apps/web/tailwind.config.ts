import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#14b8a6",
          light: "#ccfbf1",
          dark: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
