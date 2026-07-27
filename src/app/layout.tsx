import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnergyX - Application de Développement Personnel",
  description: "Une application complète pour votre croissance personnelle, mentale et physique. Gérez vos habitudes, objectifs, santé, passions et plus encore.",
  keywords: ["développement personnel", "habitudes", "productivité", "méditation", "fitness", "objectifs", "journal", "motivation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
