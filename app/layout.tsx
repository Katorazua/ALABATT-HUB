import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALABATT-HUB | Centre for Open and Distance Learning",
  description:
    "Discover the Centre for Open and Distance Learning at Rev. Fr. Moses Orshio Adasu University, Makurdi, and explore a simpler digital learning experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
