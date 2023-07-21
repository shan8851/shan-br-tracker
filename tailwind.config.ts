import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "winter", "cyberpunk", "synthwave", "corporate", "retro", "coffee", "dracula", "night", "business"],
  },
} satisfies Config;
