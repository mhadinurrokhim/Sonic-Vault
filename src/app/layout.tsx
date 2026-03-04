import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonic Vault - Your Personal Music Library",
  description: "Upload, organize, and enjoy your music with premium quality controls and equalizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
