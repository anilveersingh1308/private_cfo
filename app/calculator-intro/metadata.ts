import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: "Finance Calculators Hub — SIP, FD, Lumpsum & More",
  description:
    "All your key financial tools in one place. Plan smarter with SIP, lumpsum, FD, mutual fund, simple interest, and compound interest calculators designed to power your financial clarity.",
  keywords: [
    "SIP calculator",
    "lumpsum calculator",
    "FD calculator",
    "mutual fund calculator",
    "simple interest calculator",
    "compound interest calculator",
    "financial calculators",
    "investment tools",
    "returns calculator India",
    "wealth planning tools",
  ],
  alternates: {
    canonical: `${BASE_URL}/calculator-intro`,
  },
  openGraph: {
    title: "Finance Calculators Hub — Private CFO",
    description:
      "Plan smarter, invest better. SIP, lumpsum, FD, mutual fund, simple & compound interest calculators — all in one place.",
    url: `${BASE_URL}/calculator-intro`,
    siteName: "Private CFO",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/images/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Private CFO — Finance Calculators Hub",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Finance Calculators Hub — Private CFO",
    description:
      "SIP, lumpsum, FD, mutual fund, and interest calculators — plan smarter and invest better with free financial tools.",
    images: [`${BASE_URL}/images/logo-512.png`],
  },
};

export default function CalculatorIntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
