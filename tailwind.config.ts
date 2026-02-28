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
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            keyframes: {
                "cell-ripple": {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                }
            },
            animation: {
                "cell-ripple": "cell-ripple var(--duration) ease-out var(--delay)",
            }
        },
    },
    plugins: [],
};
export default config;
