import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      colors: {
        'diagonal-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(153, 153, 153, 0.10))',
        blueberry: "#B4B5DF",
        litepurp: "#6e7189",
        graydarkk: "#585A70",
        purpgray: "#B4B5DF",
        lightpurp: "#00ED89",
        purp: "#8C8EE0",
        bgblack: "#18181B",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '15': '15px',
      },
      fontFamily: {
        "Sohne": "Sohne",
        "gotham": "Gotham",
        "sf-pro-display": "'SFProDisplay'",
        bookishtrial: "BookishTrial",
        "gentium-book-basic": "'Gentium Book Basic'",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    backdropFilter: ['responsive'],
  },
  plugins: [
    require('tailwindcss-filters'),
    require("tailwindcss-animate")
  ],
};

export default withUt(config);
