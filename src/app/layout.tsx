import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/component/Navbar";

export const metadata: Metadata = {
  title: "বাজার দর | Bazar Dor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Navbar />

        {children}

        <Toaster
          position="top-right"
          richColors
        />
      </body>
    </html>
  );
}