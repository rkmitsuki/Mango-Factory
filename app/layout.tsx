import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
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

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mango Factory | San Jose Desi Burgers and Mango Drinks",
  description:
    "Mango Factory serves fresh Alphonso mango drinks, desi paneer burgers, homemade mango cheesecake, and bagels from 326 Commercial St in San Jose.",
  openGraph: {
    title: "Mango Factory",
    description: "Fresh Alphonso mango drinks, desi burgers, and homemade mango sweets in San Jose.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} h-full antialiased`}
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
