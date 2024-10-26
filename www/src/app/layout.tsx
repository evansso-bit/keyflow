import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { CalSans, inter } from "@/styles/fonts";
import Footer from "@/components/footer";
import { OpenPanelComponent } from '@openpanel/nextjs';
import FlickeringGrid from "@/components/ui/flickering-grid";

export const metadata: Metadata = {
  title: {
    default: "KeyFlow - Open-Source API Key Generator",
    template: "%s | KeyFlow - Open-Source API Key Generator",
  },
  description: "Open-source API key Generator system",
  openGraph: {
    siteName: "KeyFlow - Open-Source API Key Generator",
    type: "website",
    url: "https://keyflow.mpesaflow.com",
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
  robots: {
    index: true,
    follow: true,
  },
  manifest: "https://keyflow.mpesaflow.com/manifest.webmanifest",
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
        className={`${inter.variable} ${CalSans.variable} font-inter antialiased w-full min-h-screen bg-background text-foreground relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div className="fixed inset-0 z-0">
              <FlickeringGrid
                className="w-full h-full"
                squareSize={4}
                gridGap={6}
                color="#6B7280"
                maxOpacity={0.5}
                flickerChance={0.1}
              />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
              <MainNav />
              <Toaster richColors />
              <OpenPanelComponent
                clientId="8522923c-650a-4835-a20f-43ca1821e61e"
                trackScreenViews={true}
                trackOutgoingLinks={true}
                key="sec_1ebc5c449fb78bc26917"
              />
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
