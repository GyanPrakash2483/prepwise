import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrepwiseNavbar from "./components/PrepwiseNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepwise",
  description: "AI Powered study partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrepwiseNavbar />
        {children}
      </body>
    </html>
  );
}
