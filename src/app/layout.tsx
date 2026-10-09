import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/component/Navbar";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Suspense
          fallback={
            <header className="min-h-20 border-b border-gray-300 bg-[#f1f7f2]" />
          }
        >
          <Navbar />
        </Suspense>

        {children}
      </body>
    </html>
  );
}