import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "CFO Services — Individual & Business Financial Solutions",
  description:
    "Explore Private CFO's comprehensive financial services for individuals and businesses. From personal wealth management and tax optimization to MSME growth strategy and cash flow management.",
  keywords: [
    "CFO services",
    "individual financial services",
    "business CFO services",
    "wealth management",
    "tax optimization",
    "MSME financial services",
    "personal financial planning",
    "business financial strategy",
    "retirement planning",
    "cash flow management",
    "Private CFO services India",
  ],
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  openGraph: {
    title: "Individual & Business CFO Services — Private CFO",
    description:
      "Comprehensive financial services tailored to your needs — personal wealth management, tax planning, business strategy, compliance, and more.",
    url: `${BASE_URL}/services`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/services/individual-service-solution.webp`,
        width: 1200,
        height: 630,
        alt: "Private CFO — Financial Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CFO Services — Individual & Business Solutions",
    description:
      "Personalized financial services for individuals and businesses. Wealth management, tax planning, growth strategy, and more.",
    images: [`${BASE_URL}/images/services/individual-service-solution.webp`],
  },
};
