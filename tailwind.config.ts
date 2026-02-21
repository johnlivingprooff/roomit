import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#E8DCCB',
          light: '#F0E8D8',
          dark: '#D4C4A8',
        },
        earth: {
          DEFAULT: '#4A3F35',
          light: '#6B5D4F',
          dark: '#2E2820',
        },
        cream: {
          DEFAULT: '#F6F3EE',
          light: '#FFFCF7',
          dark: '#E8E2D6',
        },
        emerald: {
          DEFAULT: '#1F5E50',
          light: '#2A7A6A',
          dark: '#153D38',
        },
        terracotta: {
          DEFAULT: '#B85C38',
          light: '#D4784F',
          dark: '#8A4428',
        },
        charcoal: '#2C2622',
        primary: {
          DEFAULT: '#1F5E50', // emerald
          light: '#2A7A6A',
          dark: '#153D38',
        },
        secondary: {
          DEFAULT: '#4A3F35', // earth
          light: '#6B5D4F',
          dark: '#2E2820',
        },
        accent: {
          DEFAULT: '#B85C38', // terracotta
          light: '#D4784F',
          dark: '#8A4428',
        },
        error: '#EF4444',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(74, 63, 53, 0.08)',
        elevated: '0 8px 24px rgba(74, 63, 53, 0.12)',
        card: '0 1px 3px rgba(74, 63, 53, 0.06), 0 1px 2px rgba(74, 63, 53, 0.04)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        modal: '20px',
      },
    },
  },
  plugins: [],
};
export default config;
