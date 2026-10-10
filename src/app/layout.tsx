
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

interface TickerProduct {
  id: number;
  slug: string;
  nameBn: string;
  image?: string;
  categoryIcon?: string;
  today: number;
  unit: string;
  change?: {
    dir: "up" | "down" | "same" | "flat";
    pct: number;
  };
}

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

function extractProducts(data: unknown): TickerProduct[] {
  if (Array.isArray(data)) {
    return data as TickerProduct[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray(data.data)
  ) {
    return data.data as TickerProduct[];
  }

  return [];
}


async function getTickerProducts(): Promise<TickerProduct[]> {
  for (const url of API_URLS) {
    try {
      console.info(`Trying ticker API: ${url}`);

      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(
          `Ticker API failed with status ${response.status}: ${url}`
        );
        continue;
      }

      const data: unknown = await response.json();
      const products = extractProducts(data);

      if (products.length > 0) {
        console.info(
          `Ticker loaded ${products.length} products from ${url}`
        );
        return products;
      }

      console.warn(`Ticker API returned no products: ${url}`);
    } catch (error) {
      console.error(`Ticker API request failed: ${url}`, error);
    }
  }

  console.error("Both ticker APIs failed. Showing fallback.");
  return [];
}


async function NavbarWithProducts() {
  await connection();

  const tickerProducts = await getTickerProducts();

  return <Navbar tickerProducts={tickerProducts} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Suspense fallback={<Navbar tickerProducts={[]} />}>
          <NavbarWithProducts />
        </Suspense>

        {children}

        <Footer />
      </body>
    </html>
  );
}
