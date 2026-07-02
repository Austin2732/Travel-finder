import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fareboard — Build your trip, one best-value pick at a time",
  description:
    "Search a destination and assemble flights, hotels, cars, food, and activities into one trip — with the best-value option called out in every category.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!rounded-xl !bg-surface-900 !text-white !text-sm",
          }}
        />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-surface-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Fareboard. Prices shown are illustrative, not live bookings.</p>
        <p className="font-mono">MCO · LAS · JFK · MIA · CUN · CDG</p>
      </div>
    </footer>
  );
}
