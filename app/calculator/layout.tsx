import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Calculator | Private CFO',
  description: 'Calculate SIP, Lumpsum, FD, and other investment returns with our comprehensive financial calculators. Plan your wealth and investment strategies effectively.',
  keywords: 'SIP calculator, lumpsum calculator, FD calculator, investment calculator, financial planning',
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
