'use client';

import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';

export default function WhyUsPage() {
  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero relative min-h-[80vh] flex items-center justify-center bg-cover bg-center pt-40 pb-16">
          <div
            className="absolute inset-0 bg-gradient-to-t from-[rgba(13,14,27,1)] via-[rgba(13,14,27,0.7)] to-[rgba(13,14,27,0.3)]"
            style={{
              backgroundImage: `url('/images/hero/why_us_hero_image.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="hero-content container relative z-10 text-center text-white flex flex-col items-center">
            <h1 className="base-hero-h1 text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Why Choose Private CFO?
            </h1>
            <p className="subtitle text-xl md:text-2xl font-semibold mb-6 text-[#e0e0e0]">
              More Than a CFO. We're Your Financial Partner.
            </p>
            <p className="description text-base md:text-lg max-w-4xl mx-auto mb-8 text-[#b0b0b0] leading-relaxed text-justify">
              At Private CFO, we believe that true financial control isn't found in a spreadsheet—it's found in a partnership. 
              We combine decades of high-level financial expertise with a deeply personal, data-driven approach. We don't just 
              manage your finances; we clarify them, strategize for them, and empower you to build a more secure and prosperous future.
            </p>
            <Link href="/consultation" className="btn btn-primary inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#3b4d66] to-[#003A8C] text-white font-semibold rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg gap-2">
              <span className="font-extrabold tracking-wide flex items-center gap-4 text-lg md:text-xl">
                Book a free consultation
              </span>
            </Link>
          {/* Add enhanced button styles */}
          <style jsx>{`
            @keyframes bounceBtn {
              0% { transform: scale(1) translateY(0); }
              50% { transform: scale(1.08) translateY(-6px); }
              100% { transform: scale(1.06) translateY(-2px); }
            }
          `}</style>
          </div>
        </section>

        {/* The Private CFO Difference Section */}
        <section className="content-section py-16">
          <div className="container">
            <h2 className="gradient-text-purple text-4xl font-bold text-center mb-6">The Private CFO Difference</h2>
            <p className="text-[rgb(184,184,184)] text-justify mx-auto max-w-none leading-relaxed">
              The world of finance is often unnecessarily complex, jargon-filled, and impersonal. Traditional advisors might focus on a single piece of the puzzle, 
              while accountants report on the past. This leaves a critical gap where you need it most: forward-looking, strategic guidance that connects all the dots. 
              <strong className="tracking-[2px]"> We were founded to bridge that gap.</strong> We are a new kind of financial partner—a team of strategists dedicated to 
              translating financial data into a clear roadmap for your success, whether for your business, your family, or both.
            </p>
          </div>
        </section>

        {/* Core Pillars of Value Section */}
        <section className="content-section py-16">
          <div className="container">
            <h2 className="gradient-text-pink text-4xl font-bold text-center mb-6">Our Core Pillars of Value</h2>
            <p className="text-[rgb(184,184,184)] text-center mb-12">
              What truly sets us apart is our integrated approach, built on three foundational pillars.
            </p>
            <div className="pillars-list space-y-10">
              <div className="pillar-item-v1 flex flex-col md:flex-row items-start gap-6 py-6">
                <div className="pillar-icon-v1 text-center mb-4 md:mb-0">
                  <Image 
                    src="/images/icons/pilar-icon-1.png" 
                    alt="Unique Perspective Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[var(--color-active-link)] text-2xl font-semibold mb-2">
                    1. A Uniquely Holistic Perspective <span className="text-dim text-[var(--color-text-dim)]">(Our Dual Expertise)</span>
                  </h3>
                  <p className="text-[rgb(184,184,184)] text-justify leading-relaxed">
                    We are uniquely positioned to understand the intertwined finances of business owners and high-net-worth individuals. 
                    We recognize that your business's balance sheet impacts your personal wealth, and your personal financial goals influence 
                    your business strategy. This dual expertise allows us to provide advice that is not just financially sound for your company, 
                    but holistically right for your life.
                  </p>
                </div>
              </div>

              <div className="pillar-item-v1 flex flex-col md:flex-row items-start gap-6 py-6">
                <div className="pillar-icon-v1 text-center mb-4 md:mb-0">
                  <Image 
                    src="/images/icons/pilar-icon-2.png" 
                    alt="Financial Score Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[var(--color-active-link)] text-2xl font-semibold mb-2">
                    2. Clarity Through Our Financial Health Score
                  </h3>
                  <p className="text-[rgb(184,184,184)] text-justify leading-relaxed">
                    Go beyond standard reports and ambiguous advice. Our proprietary Financial Health Score is a CFO-calibrated diagnostic tool 
                    that gives you an immediate and clear understanding of your financial standing. It's more than a number; it's a GPS for your 
                    finances that reveals what's strong, what's at risk, and precisely what to do next.
                  </p>
                </div>
              </div>

              <div className="pillar-item-v1 flex flex-col md:flex-row items-start gap-6 py-6">
                <div className="pillar-icon-v1 text-center mb-4 md:mb-0">
                  <Image 
                    src="/images/icons/pilar-icon-3.png" 
                    alt="Partnership Expertise Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[var(--color-active-link)] text-2xl font-semibold mb-2">
                    3. A Partnership Built on Trust and Expertise
                  </h3>
                  <p className="text-[rgb(184,184,184)] text-justify leading-relaxed">
                    Our team is our greatest asset. We are a collective of seasoned financial professionals, chartered accountants, and data strategists. 
                    But we measure our success by the relationships we build. We combine powerful analytics with human empathy and expert judgment, 
                    ensuring our insights are always delivered with context, care, and a deep understanding of your specific goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Core Pillars Grid Section */}
        <section className="content-section py-16">
          <div className="container">
            <h2 className="gradient-text-gold text-4xl font-bold text-center mb-12">Our Core Pillars of Value</h2>
            <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
              <div className="pillar-item-v2 text-center px-6">
                <div className="pillar-icon-v2 mb-4">
                  <Image 
                    src="/images/icons/pilar-icon-4.png" 
                    alt="Clarity Over Complexity Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-[var(--color-heading)] text-xl font-semibold mb-4">Clarity Over Complexity</h3>
                <p className="text-[var(--color-text-dim)] text-sm">
                  We demystify financial complexity. Our goal is to provide you with a crystal-clear understanding of your financial landscape, 
                  empowering you to make confident, informed decisions.
                </p>
              </div>

              <div className="pillar-item-v2 text-center px-6">
                <div className="pillar-icon-v2 mb-4">
                  <Image 
                    src="/images/icons/pilar-icon-5.png" 
                    alt="Strategic Foresight Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-[var(--color-heading)] text-xl font-semibold mb-4">Strategic Foresight</h3>
                <p className="text-[var(--color-text-dim)] text-sm">
                  We believe the best financial strategy is proactive, not reactive. We analyze trends and anticipate challenges, 
                  constantly looking ahead to protect and grow your assets.
                </p>
              </div>

              <div className="pillar-item-v2 text-center px-6">
                <div className="pillar-icon-v2 mb-4">
                  <Image 
                    src="/images/icons/pilar-icon-6.png" 
                    alt="Partnership Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-[var(--color-heading)] text-xl font-semibold mb-4">Partnership, Not Prescription</h3>
                <p className="text-[var(--color-text-dim)] text-sm">
                  We don't believe in one-size-fits-all solutions. We work alongside you to co-create a tailored financial strategy 
                  that aligns perfectly with your vision and values.
                </p>
              </div>

              <div className="pillar-item-v2 text-center px-6">
                <div className="pillar-icon-v2 mb-4">
                  <Image 
                    src="/images/icons/pilar-icon-7.png" 
                    alt="Long-Term Vision Icon" 
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-[var(--color-heading)] text-xl font-semibold mb-4">Long-Term Vision</h3>
                <p className="text-[var(--color-text-dim)] text-sm">
                  Financial stability is about building a future that prospers and endures. Our guidance is always aimed at long-term, 
                  sustainable growth, ensuring a legacy of financial security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Private CFO Difference - Narrative Section */}
        <section className="content-section py-16">
          <div className="container">
            <h2 className="gradient-text-green text-4xl font-bold mb-4">The Private CFO Difference</h2>
            <h3 className="narrative-subtitle text-xl font-normal -mt-4 mb-6 tracking-wide">Transforming Numbers Into a Narrative</h3>
            <p className="text-[rgb(184,184,184)] text-justify mb-6 leading-relaxed">
              Traditional finance often feels fragmented, jargon-filled, and impersonal. Many advisors focus on just one side of the equation—while 
              accountants look backward and financial advisors look only at investments. But real success comes from integration. That's where we come in.
            </p>
            <p className="text-[rgb(184,184,184)] text-justify mb-6 leading-relaxed">
              At Private CFO, we bridge the gap. We are your strategic financial partner, helping you:
            </p>
            <ul className="custom-list list-none pl-6 my-8 mt-0">
              <li className="relative pb-3 ml-8 text-[rgb(184,184,184)] text-justify">
                <span className="absolute -left-6 text-green-400 text-2xl leading-none">•</span>
                Understand what your numbers actually mean
              </li>
              <li className="relative pb-3 ml-8 text-[rgb(184,184,184)] text-justify">
                <span className="absolute -left-6 text-green-400 text-2xl leading-none">•</span>
                Align business and personal goals
              </li>
              <li className="relative pb-3 ml-8 text-[rgb(184,184,184)] text-justify">
                <span className="absolute -left-6 text-green-400 text-2xl leading-none">•</span>
                Identify risks before they become problems
              </li>
              <li className="relative pb-3 ml-8 text-[rgb(184,184,184)] text-justify">
                <span className="absolute -left-6 text-green-400 text-2xl leading-none">•</span>
                Make confident, data-driven decisions
              </li>
              <li className="relative pb-3 ml-8 text-[rgb(184,184,184)] text-justify">
                <span className="absolute -left-6 text-green-400 text-2xl leading-none">•</span>
                Build a roadmap that adapts as life evolves
              </li>
            </ul>
            <p className="text-[rgb(184,184,184)] text-justify leading-relaxed">
              We don't just organize your numbers — we organize your future.
            </p>
          </div>
        </section>

        {/* We Work Best With Section */}
        <section className="content-section py-16">
          <div className="container">
            <h2 className="gradient-text-teal text-4xl font-bold mb-8">We Work Best With...</h2>
            <ul className="work-with-list flex flex-col gap-6 mt-4">
              <li className="ml-4">
                <h3 className="text-2xl font-semibold text-white mb-2">Entrepreneurs & Business Owners</h3>
                <p className="text-[var(--color-text-dim)] -mt-1">
                  Who want to scale sustainably and align financial goals with long-term vision.
                </p>
              </li>
              <li className="ml-4">
                <h3 className="text-2xl font-semibold text-white mb-2">High-Net-Worth Individuals & Families</h3>
                <p className="text-[var(--color-text-dim)] -mt-1">
                  Who seek clarity across investments, taxes, estate planning, and legacy.
                </p>
              </li>
              <li className="ml-4">
                <h3 className="text-2xl font-semibold text-white mb-2">Professionals in Transition</h3>
                <p className="text-[var(--color-text-dim)] -mt-1">
                  Preparing for career changes, exits, or major life shifts and seeking a trusted guide.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container text-center">
            <h2 className="gradient-text-cta-heading">Ready to Take Control of Your Financial Future?</h2>
            <p>Whether you're growing a business, building personal wealth, or simply ready to stop flying blind, <span className="font-semibold text-white">Private CFO</span> is here to help you see the whole picture and move forward with purpose.</p>
            <div className="cta-bottom" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem'}}>
              <div>
                <h3 className="cta-subtitle">Book your free discovery session today.</h3>
              </div>
              <div>
                <a href="/consultation" className="btn-cta">
                  Let's Talk
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
