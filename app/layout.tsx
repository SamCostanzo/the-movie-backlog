import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Righteous, Space_Grotesk } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";

// const fredoka = Fredoka({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-display",
// });

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"], // regular, bold, black
  variable: "--font-body",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Movie Backlog",
  description: "An app for Sam's friends",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${righteous.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-text font-body">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
