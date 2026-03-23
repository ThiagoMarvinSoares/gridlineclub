import { Inter, Rajdhani } from "next/font/google";

export const headingFont = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading-var",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
