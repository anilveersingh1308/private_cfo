'use client';

import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
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
        <section className="about-hero hero relative min-h-[80vh] flex items-center justify-center bg-cover bg-center pt-40 pb-16">
          <div 
            className="absolute inset-0 bg-gradient-to-t from-[rgba(13,14,27,1)] via-[rgba(13,14,27,0.7)] to-[rgba(13,14,27,0.3)]"
            style={{
              backgroundImage: `url('/images/hero/about_hero_image.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="container relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Beyond the Balance Sheet
            </h1>
            <p className="text-xl md:text-2xl font-semibold mb-6 text-[#e0e0e0]">
              The Story of Your Financial Partner
            </p>
            <p className="text-base md:text-lg max-w-4xl mx-auto mb-8 text-[#b0b0b0] leading-relaxed">
              We believe that strategic financial leadership shouldn't be reserved for large corporations. 
              At Private CFO, we're dedicated to bringing the clarity, foresight, and strategic power of a 
              Chief Financial Officer directly to you—whether you're an individual navigating the complexities 
              of personal wealth or a business owner driving for sustainable growth. We're not just accountants; 
              we are your dedicated financial partners.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="about-section py-16">
          <div className="container">
            <h2 className="text-purple text-4xl font-bold mb-4">Our Story</h2>
            <h3 className="text-2xl font-semibold mb-6 text-white">Bridging the Gap</h3>
            <p className="mb-6 text-[rgb(184,184,184)] text-justify">
              Private CFO was founded on a simple but powerful observation: The world of finance was leaving too many people behind. 
              Ambitious individuals and growing businesses were often caught between basic book keeping services and impersonal, 
              enterprise-level consulting, with no one to provide truly tailored, forward-looking strategic guidance.
            </p>
            <p className="mb-6 text-[rgb(184,184,184)] text-justify">
              We saw a need for a new kind of financial partner—one that combines decades of high-level financial experience with 
              a deeply personal, data-driven approach. We set out to build a service that empowers clients not just to manage their 
              finances, but to understand them, command them, and use them as a tool to achieve their most important goals.
            </p>
            <p className="mb-6 text-[rgb(184,184,184)] text-justify">
              Our journey is one of passion for numbers and a deeper passion for the people and businesses they represent.
            </p>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section className="about-section py-16">
          <div className="container">
            <h2 className="text-yellow text-4xl font-bold mb-4">Our Philosophy</h2>
            <h3 className="text-2xl font-semibold mb-6 text-white">The Principles That Guide Us</h3>
            <p className="mb-6 text-[rgb(184,184,184)] text-justify">
              Our work is built on a foundation of core beliefs that define every recommendation we make and every partnership we build.
            </p>
            <ul className="principles-list space-y-4 pl-5">
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Clarity is Power:</strong> We demystify financial complexity. Our goal is to provide you with a crystal-clear 
                understanding of your financial position, enabling you to make confident, informed decisions.
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Strategy Over Spreadsheets:</strong> While data is crucial, it's the strategic insight derived from it that creates 
                real value. We focus on the "why" and "what's next," not just the "what is."
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Partnership, Not Prescription:</strong> We don't deliver one-size-fits-all solutions. We work alongside you, 
                listening to your goals and challenges to build a financial path that is uniquely yours.
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Long-Term Vision:</strong> True financial health is about building a secure and prosperous future. Our guidance 
                is always aimed at long-term stability, growth, and legacy.
              </li>
            </ul>
          </div>
        </section>

        {/* Meet Our Experts Section */}
        <section className="about-section py-16">
          <div className="container">
            <h2 className="text-blue text-4xl font-bold mb-8">Meet Our Experts</h2>
            <div className="flex justify-center mb-8">
              <Image 
                src="/images/about/bf_fill.png" 
                alt="A financial expert giving a presentation" 
                width={420}
                height={280}
                className="rounded-xl shadow-lg"
              />
            </div>
            <blockquote className="bg-[rgba(255,255,255,0.04)] border-l-4 border-[#5ecbff] p-6 rounded-lg">
              <p className="text-lg text-[#b0c0d0] mb-4 leading-relaxed">
                "From the beginning, my vision was to create the financial advisory service I wished I had access to earlier in my career. 
                A service that is intelligent, proactive, and genuinely invested in its clients' success. At Private CFO, we've assembled a 
                team of experts who share this vision. We are here to be the strategic sounding board you can always count on. Welcome to a 
                new way of thinking about your financial future."
              </p>
              <cite className="block text-[#ffd86b] font-normal text-base">
                [Founder's Name], Founder & Principal CFO
              </cite>
            </blockquote>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="about-section py-16">
          <div className="container">
            <h2 className="text-yellow text-4xl font-bold mb-8">Our Team of Financial Strategists</h2>
            <div className="flex justify-center mb-8">
              <Image 
                src="/images/services/financial-team.png" 
                alt="A diverse team of financial strategists" 
                width={420}
                height={280}
                className="rounded-xl shadow-lg"
              />
            </div>
            <p className="text-[rgb(184,184,184)] text-justify">
              The Private CFO team is our greatest asset. We are a collective of seasoned financial professionals, chartered accountants, 
              and data analysts with decades of combined experience across wealth management, corporate finance, and business strategy. 
              Our diverse expertise allows us to seamlessly serve both high-net-worth individuals and MSMEs, bringing a holistic perspective 
              to every financial challenge.
            </p>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="about-section py-16">
          <div className="container">
            <h2 className="text-green text-4xl font-bold mb-4">What Makes Us Different</h2>
            <h3 className="text-2xl font-semibold mb-6 text-white">The Private CFO Advantage</h3>
            <ul className="principles-list space-y-4 pl-5">
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Dual Expertise:</strong> We are uniquely positioned to understand the intertwined finances of business owners 
                and the distinct needs of individuals. We provide cohesive strategies that align your personal and financial worlds.
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">The Financial Health Score:</strong> We go beyond standard reports. Our proprietary CFO-calibrated assessment 
                gives you an actionable score that reveals what's strong, what's at risk, and precisely what to do next. It's your financial GPS.
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">Data-Driven, Human-Led:</strong> We leverage modern, data-driven tools for precision and efficiency, but our 
                insights are always delivered with human empathy and expert judgment. You get the best of both worlds.
              </li>
              <li className="text-[#e0e0e0] text-lg">
                <strong className="tracking-[2px]">A Proactive Partnership:</strong> We don't wait for problems to arise. We are constantly looking ahead, 
                identifying opportunities and mitigating risks to keep you on a path to success.
              </li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-16 mx-4 md:mx-8 max-w-4xl lg:mx-auto rounded-2xl bg-gradient-to-r from-[#1a2340] to-[#003A8C] text-center">
          <div className="px-8 md:px-12">
            <h2 className="text-green text-4xl font-bold mb-6">Ready to Build Your Financial Future?</h2>
            <p className="text-lg mb-8 text-[rgb(184,184,184)] max-w-2xl mx-auto">
              Your journey toward financial empowerment, clarity, and strategic growth begins with a conversation. 
              Let's discuss your goals and explore how a dedicated CFO partner can help you achieve them.
            </p>
            <Link 
              href="/consultation" 
              className="btn-primary inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#3b4d66] to-[#003A8C] text-white font-semibold rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              Book a free consultation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
