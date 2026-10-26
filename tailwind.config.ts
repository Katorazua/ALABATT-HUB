import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        university: "#123B6D",
        teal: "#0F9D92",
      },
    },
  },
  plugins: [],
};

export default config;
