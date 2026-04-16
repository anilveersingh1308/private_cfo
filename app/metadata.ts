import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Private CFO | Strategic Financial Leadership for Individuals & Businesses",
    template: "%s | Private CFO",
  },
  description:
    "Empower your financial future with personalized CFO services. Private CFO offers strategic financial planning, wealth management, and expert advisory for individuals and businesses across India.",
  keywords: [
    "Private CFO",
    "CFO services",
    "financial planning",
    "wealth management",
    "personal finance",
    "business finance",
    "financial advisory",
    "virtual CFO",
    "investment planning",
    "tax planning",
    "financial strategy",
    "India",
  ],
  authors: [{ name: "Private CFO", url: BASE_URL }],
  creator: "Private CFO",
  publisher: "Gigafactry Innovations Pvt Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Private CFO | Strategic Financial Leadership for Individuals & Businesses",
    description:
      "Empower your financial future with personalized CFO services. Strategic financial planning, wealth management, and expert advisory for individuals and businesses.",
    url: BASE_URL,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Private CFO — Strategic Financial Leadership",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private CFO | Strategic Financial Leadership",
    description:
      "Personalized CFO services — strategic financial planning, wealth management, and expert advisory for individuals and businesses.",
    images: [`${BASE_URL}/images/logo-512.png`],
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/images/logo-192.png",
  },
  category: "Finance",
};
