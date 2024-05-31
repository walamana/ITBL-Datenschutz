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
        "blue-background": "#013A63",
        "blue-contrast": "#014F86",
        "blue-master": "#5543A5",
        "module-blue": "#A9D6E5",
      },
      height: {
        "reduced-40": "calc(100% - 43px)",
        "reduced-safari": "calc(100vh - 50px)",
      },
    },
    keyframes: {
      slideIn: {
        "0%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(0)" },
      },
      slideOut: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(100%)" },
      },
    },
    animation: {
      slideIn: "slideIn 0.5s ease-out forwards",
      slideOut: "slideOut 0.5s ease-out forwards",
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
export default config;
