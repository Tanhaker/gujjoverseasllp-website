import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GujjOverseas LLP | Premium Agro Products Export",
  description: "GujjOverseas LLP is a leading exporter of premium agro products including grains, spices, pulses, and dry fruits. Ensuring quality and trust worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-500 selection:text-white">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
