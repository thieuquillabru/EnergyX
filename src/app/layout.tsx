import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnergyX - Application de Développement Personnel",
  description: "Une application complète pour votre croissance personnelle, mentale et physique. Gérez vos habitudes, objectifs, santé, passions et plus encore.",
  keywords: ["développement personnel", "habitudes", "productivité", "méditation", "fitness", "objectifs", "journal", "motivation", "PWA"],
  authors: [{ name: "Thieu Quilla Bru" }],
  creator: "Thieu Quilla Bru",
  publisher: "EnergyX",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EnergyX",
  },
  applicationName: "EnergyX",
  referrer: "origin",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "EnergyX",
    title: "EnergyX - Développement Personnel",
    description: "Application complète de développement personnel",
  },
  twitter: {
    card: "summary",
    title: "EnergyX",
    description: "Application complète de développement personnel",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EnergyX" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0ea5e9" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
