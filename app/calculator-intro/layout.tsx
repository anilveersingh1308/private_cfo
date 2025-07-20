import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Calculators Hub | Private CFO',
  description: 'All your key financial tools in one place—plan smarter, invest better, and make informed decisions with calculators designed to power your financial clarity.',
  keywords: 'SIP calculator, lumpsum calculator, FD calculator, mutual fund calculator, simple interest, compound interest, financial calculators, investment tools',
};

export default function CalculatorIntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
