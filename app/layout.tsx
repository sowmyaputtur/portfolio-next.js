import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aarohan — Thoughtful tech, everyday.",
  description:
    "Discover handpicked electronics for every day at Aarohan. Great tech, honest prices, delivered across India.",
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
