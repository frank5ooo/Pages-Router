// pages/_app.tsx
import { Inter } from "next/font/google";
import type { AppProps } from 'next/app';
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Inter({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Aplicamos las fuentes y el antialiased aquí
    <main className={`${geistSans.variable}  antialiased`}>
      <Component {...pageProps} />
    </main>
  );
}

