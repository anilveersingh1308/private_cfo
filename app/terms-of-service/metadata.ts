import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Terms of Service — User Agreement & Policies",
  description:
    "Review Private CFO's terms of service. Understand your rights and obligations, payment terms, intellectual property, dispute resolution, and service disclaimers.",
  keywords: [
    "terms of service",
    "user agreement",
    "terms and conditions",
    "legal terms",
    "financial advisory disclaimer",
    "payment terms",
    "Private CFO terms",
  ],
  alternates: {
    canonical: `${BASE_URL}/terms-of-service`,
  },
  openGraph: {
    title: "Terms of Service — Private CFO",
    description:
      "Our service terms and conditions — covering user accounts, payment, intellectual property, liability, and dispute resolution.",
    url: `${BASE_URL}/terms-of-service`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service — Private CFO",
    description:
      "Review our service terms covering user agreements, payment policies, IP rights, and dispute resolution.",
  },
};
