import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { CalSans, inter } from "@/styles/fonts";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "KeyFlow - Open-Source API Key Generator",
  description: "Open-source API key Generator system",
  openGraph: {
    title: "Keyflow - Open-Source API Key Generator",
    description: "Open-source API key Generator system",
    images: [
      {
        url: "https://utfs.io/f/qGGrTNysMsOSwjiK6TUbfRzUZraT9OHeoNpCiPV0IcWxJL8k",
        width: 1200,
        height: 630,
        alt: "Keyflow Open-Source API Key Generator",

      },
    ],
  },
  twitter: {
    title: "KeyFlow - Open-Source API Key Generator",
    description: "Open-source API key Generator system",
    card: "summary_large_image",
    images: [
      {
        url: "https://utfs.io/f/qGGrTNysMsOSwjiK6TUbfRzUZraT9OHeoNpCiPV0IcWxJL8k",
        width: 1200,
        height: 630,
        alt: "Keyflow API Key Generator",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.variable} ${CalSans.variable} font-inter antialiased w-full min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <MainNav />
            <Toaster richColors />
            {children}
            <Footer />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
