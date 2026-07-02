import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fareboard — AI travel planning that finds the best value",
  description:
    "Search one destination and compare flights, hotels, cars, food, activities, and extras in one premium trip planner.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!rounded-2xl !bg-surface-950 !text-white !text-sm !shadow-brand",
          }}
        />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-surface-500 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-lg font-extrabold text-surface-950">Fareboard</div>
          <p className="mt-2 max-w-xs leading-relaxed">Plan smarter. Compare flights, stays, food, and experiences in one place.</p>
        </div>
        <div>
          <p className="font-semibold text-surface-900">Company</p>
          <p className="mt-2">About · Careers · Press</p>
        </div>
        <div>
          <p className="font-semibold text-surface-900">Support</p>
          <p className="mt-2">Help Center · Contact · Privacy</p>
        </div>
        <div>
          <p className="font-semibold text-surface-900">Status</p>
          <p className="mt-2 font-mono text-xs text-emerald-600">PLACES · MAPS · TRIP BUILDER ONLINE</p>
        </div>
      </div>
    </footer>
  );
}
