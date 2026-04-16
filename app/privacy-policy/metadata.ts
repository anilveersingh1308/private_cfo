import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Privacy Policy — Data Protection & Your Rights",
  description:
    "Read Private CFO's comprehensive privacy policy. Learn how we collect, use, and protect your personal information, your data rights, cookie policies, and security measures.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "data security",
    "cookie policy",
    "GDPR",
    "user rights",
    "Private CFO privacy",
  ],
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy — Private CFO",
    description:
      "Our commitment to protecting your personal information. Comprehensive details on data collection, usage, security measures, and your privacy rights.",
    url: `${BASE_URL}/privacy-policy`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — Private CFO",
    description:
      "How we protect your data — comprehensive privacy policy covering collection, usage, security, and your rights.",
  },
};
