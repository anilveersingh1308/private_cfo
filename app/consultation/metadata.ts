import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Book a Free Consultation — Private CFO",
  description:
    "Schedule your free discovery session with Private CFO. Share your financial goals and get personalized guidance from expert advisors — no obligations, no hidden fees.",
  keywords: [
    "free consultation",
    "financial consultation",
    "book CFO consultation",
    "free financial advice",
    "financial discovery session",
    "Private CFO consultation",
    "personal finance consultation India",
  ],
  alternates: {
    canonical: `${BASE_URL}/consultation`,
  },
  openGraph: {
    title: "Book a Free Financial Consultation — Private CFO",
    description:
      "Take the first step towards financial clarity. Schedule a free discovery session with our expert CFO advisors — personalized guidance with zero obligations.",
    url: `${BASE_URL}/consultation`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Private CFO — Free Consultation",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Book a Free Financial Consultation — Private CFO",
    description:
      "Take the first step towards financial clarity. Free discovery session with expert CFO advisors — no obligations.",
    images: [`${BASE_URL}/images/logo-512.png`],
  },
};
