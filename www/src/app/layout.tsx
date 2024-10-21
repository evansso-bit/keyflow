import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Keyflow - API Key Management",
  description: "Open-source API key management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased w-full min-h-screen bg-background text-foreground`}
      >
        <MainNav />
        {children}
      </body>
    </html>
  );
}
