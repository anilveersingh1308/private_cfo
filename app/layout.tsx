import type { Metadata } from "next";
import { Montserrat, Mooli } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mooli = Mooli({
  variable: "--font-mooli",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Private CFO",
  description: "Your Personal Financial Dashboard - Strategic Financial Leadership for Individuals and Businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className={`${montserrat.variable} ${mooli.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          backgroundColor: 'var(--color-dark-bg)',
          color: 'var(--color-text)',
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
