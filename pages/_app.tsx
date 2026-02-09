// pages/_app.tsx
import { Geist, Geist_Mono } from "next/font/google";
import type { AppProps } from 'next/app';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Aplicamos las fuentes y el antialiased aquí
    <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Component {...pageProps} />
    </main>
  );
}