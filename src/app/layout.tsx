import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from '@/components/providers'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "SR Traders | Scrap Buyers & Dealers in Tamil Nadu | Tuticorin",
  description: "SR Traders is a trusted scrap trading company in Tamil Nadu. We buy, process, and supply ferrous & non-ferrous scrap with transparent pricing, fast pickups, and eco-friendly recycling.",
  keywords: ["scrap buyers in Tamil Nadu", "scrap dealers Tuticorin", "metal scrap trading Tamil Nadu", "industrial scrap buyers", "scrap procurement company"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
