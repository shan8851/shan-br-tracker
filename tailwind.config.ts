import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "winter", "cyberpunk", "synthwave", "halloween", "forest", "dracula", "retro", "valentine", "bumblebee", "emerald", "corporate", "christmas", "business", "cmyk"],
  },
} satisfies Config;
