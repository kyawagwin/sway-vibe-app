import type { Metadata } from "next";
import { Inter, Montserrat, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "600", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-merriweather", weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  title: "Sway",
  description: "A minimalist, atmospheric PWA for weekend travelers.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2C3E50",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${merriweather.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
