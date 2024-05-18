import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  darkMode: 'class', // or 'media' or 'class'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1600px',
    },
    extend: {
      backgroundImage: {},
    },
  },
  plugins: [],
};
export default config;

