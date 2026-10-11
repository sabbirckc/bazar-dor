import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import AuthToastHandler from "@/component/AuthToastHandler";

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
        return products;
      }
    } catch (error) {
      console.error("Ticker API request failed:", url, error);
    }
  }

  console.warn("Both ticker APIs failed.");
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
      <body className="flex min-h-screen flex-col bg-[#F0F5F0]">
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            zIndex: 99999,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FAFCFA",
              color: "#26332A",
              border: "1px solid #E1EAE2",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#07883F",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#FFFFFF",
              },
            },
          }}
        />

        <Suspense fallback={null}>
          <AuthToastHandler />
        </Suspense>

        <Suspense fallback={<Navbar tickerProducts={[]} />}>
          <NavbarWithProducts />
        </Suspense>

        {/* This wrapper absorbs remaining vertical space so the footer
            sits at the bottom of the viewport on short pages. */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}