import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { MobileActionBar, SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mango Factory | San Jose Desi Burgers and Mango Drinks",
  description:
    "Mango Factory serves Desi Veg Paneer Burgers, Alphonso mango drinks, boba, bagels, momo noodle soup, fried rice, and spring rolls from 326 Commercial St in San Jose.",
  openGraph: {
    title: "Mango Factory",
    description: "Desi burgers, Alphonso mango drinks, boba, and Indo-Nepali comfort food in San Jose.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
