import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Sign In — Private CFO Dashboard",
  description:
    "Sign in to your Private CFO dashboard to access financial reports, consultations, and personalized advisory tools.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${BASE_URL}/sign-in`,
  },
  openGraph: {
    title: "Sign In — Private CFO",
    description: "Access your Private CFO dashboard for financial reports, consultations, and advisory tools.",
    url: `${BASE_URL}/sign-in`,
    siteName: "Private CFO",
    type: "website",
  },
};
