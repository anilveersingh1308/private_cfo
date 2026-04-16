import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "About Us — Our Story, Philosophy & Financial Expertise",
  description:
    "Discover Private CFO's story — decades of high-level financial expertise combined with a deeply personal, data-driven approach. Meet the team bridging the gap between basic bookkeeping and enterprise consulting.",
  keywords: [
    "about Private CFO",
    "financial experts",
    "CFO team",
    "financial advisory firm",
    "financial leadership story",
    "personal CFO India",
    "wealth management team",
  ],
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Private CFO — Beyond the Balance Sheet",
    description:
      "We combine decades of high-level financial experience with a deeply personal, data-driven approach. Learn about our philosophy: Clarity is Power, Strategy Over Spreadsheets.",
    url: `${BASE_URL}/about`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/hero/about_hero_image.webp`,
        width: 1200,
        height: 630,
        alt: "About Private CFO — Your Financial Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Private CFO — Beyond the Balance Sheet",
    description:
      "Decades of financial expertise, a deeply personal approach. Discover the story behind your trusted financial partner.",
    images: [`${BASE_URL}/images/hero/about_hero_image.webp`],
  },
};
