import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Employee Registration — Private CFO",
  description:
    "Register as a financial advisor on the Private CFO platform. Join our team of expert consultants providing strategic financial leadership.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${BASE_URL}/sign-up`,
  },
  openGraph: {
    title: "Employee Registration — Private CFO",
    description: "Join the Private CFO team as a financial advisor. Register to access the consultant dashboard.",
    url: `${BASE_URL}/sign-up`,
    siteName: "Private CFO",
    type: "website",
  },
};
