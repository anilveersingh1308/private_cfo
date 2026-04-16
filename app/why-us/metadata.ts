import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Why Choose Private CFO — Your Trusted Financial Partner",
  description:
    "More than a CFO — we're your financial partner. Discover our holistic perspective, data-driven strategies, and client-first philosophy that set Private CFO apart from traditional advisors.",
  keywords: [
    "why Private CFO",
    "financial partner",
    "holistic finance",
    "data-driven CFO",
    "trusted financial advisor",
    "CFO difference",
    "personal CFO benefits",
    "strategic financial guidance",
  ],
  alternates: {
    canonical: `${BASE_URL}/why-us`,
  },
  openGraph: {
    title: "Why Choose Private CFO — More Than a CFO, We're Your Financial Partner",
    description:
      "True financial control isn't found in a spreadsheet — it's found in a partnership. Discover the three core pillars that set Private CFO apart.",
    url: `${BASE_URL}/why-us`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/hero/why_us_hero_image.webp`,
        width: 1200,
        height: 630,
        alt: "Why Choose Private CFO — Financial Partnership",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Choose Private CFO",
    description:
      "A uniquely holistic perspective, data-driven strategies, and client-first philosophy — discover why we're the right financial partner for you.",
    images: [`${BASE_URL}/images/hero/why_us_hero_image.webp`],
  },
};
