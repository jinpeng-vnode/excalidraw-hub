// tailwind.config.mjs — Tailwind CSS 配置
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6965db', light: '#a5a3f5', dark: '#4a47a3' },
      },
    },
  },
  plugins: [],
}
