import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clifford: "#da373d",
        blackNissan: "#1A1A1A",
        redNissan: "#C3002F",
      },
    },
  },
  plugins: [],
};
export default config;
