'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CalculatorIntroPage() {
  const calculators = [
    {
      type: 'sip',
      title: 'SIP Calculator',
      description: 'Plan smarter with our SIP calculator—designed to help you estimate long-term returns, align your investments with your financial strategy, and stay on track toward wealth-building goals.',
      gradientClass: 'gradient-text-sip'
    },
    {
      type: 'lumpsum',
      title: 'Lumpsum Calculator',
      description: 'Evaluate your one-time investments with our Lumpsum Calculator. Get accurate projections of future value to make strategic, high-impact financial decisions.',
      gradientClass: 'gradient-text-lumpsum'
    },
    {
      type: 'fd',
      title: 'FD Calculator',
      description: 'Secure your savings with clarity. Use our Fixed Deposit Calculator to estimate interest earnings and maturity value based on your deposit term and rate.',
      gradientClass: 'gradient-text-fd'
    },
    {
      type: 'mutual-fund',
      title: 'Mutual Fund Returns Calculator',
      description: 'Track and forecast your mutual fund performance. Use our Mutual Fund Returns Calculator to analyze past growth and estimate future wealth creation.',
      gradientClass: 'gradient-text-mutual'
    },
    {
      type: 'simple-interest',
      title: 'Simple Interest Calculator',
      description: 'Easily calculate straightforward interest returns. Our Simple Interest Calculator helps you understand earnings on a fixed principal over time—ideal for basic financial planning.',
      gradientClass: 'gradient-text-simple'
    },
    {
      type: 'compound-interest',
      title: 'Compound Interest Calculator',
      description: 'See how your money grows faster with compounding. Our Compound Interest Calculator reveals the power of reinvested returns across time.',
      gradientClass: 'gradient-text-compound'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Header />

      {/* Dynamic Hero Background Styling */}
      <style jsx>{`
        .hero {
          background-image: url('/images/hero/cal_intro_hero_image.jpeg');
          background-size: cover;
          background-position: center;
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="hero hero-calculators">
        <div className="hero-content container text-center">
          <h1>Finance Calculators Hub</h1>
          <p className="subtitle">Investment &amp; Returns</p>
          <p className="description">
            All your key financial tools in one place—plan smarter, invest better, and make informed decisions with calculators designed to power your financial clarity.
          </p>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="calculators-section">
        <div className="container">
          <div className="calculators-grid">
            {calculators.map((calculator) => (
              <Link 
                key={calculator.type}
                href={`/calculator?type=${calculator.type}`} 
                className="calculator-card"
              >
                <h3 className={calculator.gradientClass}>{calculator.title}</h3>
                <p>{calculator.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="gradient-text-cta-heading">Ready to Take Control of Your Financial Future?</h2>
          <p>Whether you're growing a business, building personal wealth, or simply ready to stop flying blind, Private CFO is here to help you see the whole picture—and move forward with purpose.</p>
          <div className="cta-bottom" style={{ display: 'flex' }}>
            <div>
              <h3 className="cta-subtitle">Book your free discovery session today.</h3>
            </div>
            <div>
              <Link href="/consultation" className="btn-cta">
                Let's Talk
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>        
      </section>

      <Footer />
    </div>
  );
}
