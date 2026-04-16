import { Montserrat, Mooli } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
export { metadata } from "./metadata";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "FinancialService",
                name: "Private CFO",
                url: process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club",
                logo: {
                  "@type": "ImageObject",
                  url: `${process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club"}/images/logo-512.png`,
                  width: 512,
                  height: 512,
                },
                image: `${process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club"}/images/logo-512.png`,
                description:
                  "Strategic financial leadership for individuals and businesses — personalized CFO services including wealth management, tax planning, and investment advisory.",
                serviceType: "Financial Advisory",
                areaServed: {
                  "@type": "Country",
                  name: "India",
                },
                provider: {
                  "@type": "Organization",
                  name: "Gigafactry Innovations Pvt Ltd",
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "CFO Services",
                  itemListElement: [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Individual CFO Services",
                        description:
                          "Personal financial planning, wealth management, tax optimization, and retirement planning.",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Business CFO Services",
                        description:
                          "MSME financial strategy, cash flow management, compliance, and growth planning.",
                      },
                    },
                  ],
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Private CFO",
                url: process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club",
              },
            ]),
          }}
        />
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
