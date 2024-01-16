import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        sm: "3px",
      },
      borderWidth: {
        "1.5": "1.5px",
      },
      animation: {
        fadeIn: "in 2s forwards",
        goUp: "up 2s forwards",
      },
      keyframes: {
        in: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1", translate: "0px -10px" },
        },
      },
    },
  },
  plugins: [],
}
export default config
