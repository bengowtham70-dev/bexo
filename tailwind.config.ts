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
        ink: "#111318",
        warm: "#F7F7F2",
        lime: {
          DEFAULT: "#C8FF3D",
          hover: "#B8F02A",
          dark: "#8DBF15",
          ink: "#111318",
        },
        violet: {
          DEFAULT: "#7C5CFC",
          hover: "#6B4FE0",
        },
        muted: {
          DEFAULT: "#667085",
          strong: "#475467",
        },
      },
    },
  },
  plugins: [],
};

export default config;
