import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://privatecfo.club";

export const metadata: Metadata = {
  title: 'Financial Calculator — Investment & Returns Planner',
  description:
    'Calculate SIP, lumpsum, FD, mutual fund, simple interest, and compound interest returns. Plan your wealth-building strategy with accurate financial projections.',
  keywords: [
    'SIP calculator',
    'lumpsum calculator',
    'FD calculator',
    'investment calculator',
    'financial planning',
    'returns calculator',
    'compound interest calculator',
    'mutual fund returns',
  ],
  alternates: {
    canonical: `${BASE_URL}/calculator`,
  },
  openGraph: {
    title: 'Financial Calculator — Private CFO',
    description:
      'Calculate SIP, lumpsum, FD, and more. Accurate financial projections to plan your wealth strategies effectively.',
    url: `${BASE_URL}/calculator`,
    siteName: 'Private CFO',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'Financial Calculator — Private CFO',
    description:
      'SIP, lumpsum, FD, mutual fund, and interest calculators — accurate financial projections for smarter planning.',
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
