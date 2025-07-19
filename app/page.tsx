"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Global Dotted Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="relative text-white overflow-hidden min-h-screen bg-slate-900/95">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/90 to-slate-900/85"></div>
            <img 
              src="/images/hero/hero_image.png" 
              alt="Business professionals working with financial data"
              className="w-full h-full object-cover opacity-25"
            />
          </div>

          <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your Personal <span className="text-blue-400">CFO</span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-blue-300 mb-6">
                Tailored Financial Leadership<br />
                for Individuals & Businesses
              </p>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Empower your financial future with strategic, reliable, and personalized CFO services. Whether you're managing personal wealth or running a business, we've got the right solution for you.
              </p>
              <Link 
                href="/consultation" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Book a free consultation
              </Link>
            </div>
          </div>
        </section>

        {/* CFO Service Section */}
        <section className="py-20 bg-slate-800/95 text-white backdrop-blur-sm relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-blue-400 font-semibold mb-4 text-lg">Your Finance Transformation Partners</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                    Omnichannel CFO service
                  </h2>
                  <p className="text-gray-300 text-lg mb-12 leading-relaxed">
                    At the core of our CFO services lies a deep commitment to financial clarity, growth, and 
                    long-term security—whether you're managing personal wealth or driving business success. Our private CFO expertise spans both individual and enterprise finance, 
                    combining decades of experience with modern, data-driven tools to help you make 
                    confident financial decisions.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/40 shadow-lg overflow-hidden">
                        <img 
                          src="/images/icons/mission.png" 
                          alt="Mission"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">Mission</h3>
                      <p className="text-gray-300">Deliver expert CFO solutions that empower smart, strategic financial decision-making.</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40 shadow-lg overflow-hidden">
                        <img 
                          src="/images/icons/vision.png" 
                          alt="Vision"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">Vision</h3>
                      <p className="text-gray-300">Become the leading force in trusted, personalized private CFO services globally.</p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:pl-12">
                  <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <img 
                      src="/images/services/financial-health.png" 
                      alt="Financial Dashboard"
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Leadership Section */}
        <section className="py-20 bg-slate-700/95 backdrop-blur-sm relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Strategic Financial Leadership,<br />
                Personalized to Your Needs.
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed">
                At the core of our CFO services lies a deep commitment to financial clarity, growth, and 
                long-term security—whether you're managing personal wealth or driving business success. Our private CFO expertise spans both individual and enterprise finance, 
                combining decades of experience with modern, data-driven tools to help you make 
                confident financial decisions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-slate-600/60 backdrop-blur-sm border border-slate-500/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-600/70 transition-all duration-300 hover-lift">
                  <h3 className="text-2xl font-semibold text-white mb-4">Are you an Individual?</h3>
                  <p className="text-gray-300 mb-8 text-lg">Navigate complex finances</p>
                  <Link 
                    href="/services?type=individual" 
                    className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Explore services ↗
                  </Link>
                </div>
                
                <div className="bg-slate-600/60 backdrop-blur-sm border border-slate-500/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-600/70 transition-all duration-300 hover-lift">
                  <h3 className="text-2xl font-semibold text-white mb-4">Are you a MSME/ Business?</h3>
                  <p className="text-gray-300 mb-8 text-lg">Drive growth with expert insights.</p>
                  <Link 
                    href="/services?type=business" 
                    className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Explore services ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Health Score Section */}
        <section className="py-20 bg-slate-800/95 backdrop-blur-sm relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-blue-400 font-semibold mb-4 text-lg">Know exactly where you stand financially</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    Why Financial Health Score Matters?
                  </h2>
                  <p className="text-2xl font-semibold text-white mb-6">
                    Success isn't just about earning more—it's about knowing where you stand.
                  </p>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    Our Financial Health Score is more than a number—it's a CFO-calibrated assessment designed to reveal the true condition of 
                    your finances. Whether you're growing personal wealth or managing a business, this score tells you what's strong, 
                    what's at risk, and what to do next.
                  </p>
                  <p className="text-gray-400 italic mb-10">
                    Your finances are talking. It's time to understand what they're saying.
                  </p>
                  <Link 
                    href="/consultation" 
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Check My Financial Health ↗
                  </Link>
                </div>
                
                <div className="lg:pl-12">
                  <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <img 
                      src="/images/services/financial-team.png" 
                      alt="Financial Health Dashboard"
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Consult CFO Section */}
        <section className="py-20 bg-slate-900/95 backdrop-blur-sm relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Why Consult a CFO — Even If You Think You Don't Need One
              </h2>
              <blockquote className="text-3xl font-semibold text-blue-300 mb-12 italic">
                "Are your financial decisions based on insight—or just instinct?"
              </blockquote>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                In today's fast-moving world, financial decisions can't rely on trial and error. Whether you're a high-net-worth individual or a founder 
                navigating growth, hiring a CFO isn't a cost—it's a competitive advantage. A CFO provides strategic clarity, future-focused planning, and 
                operational control that tools, advisors, and accountants alone simply cannot deliver.
              </p>
              <Link 
                href="/consultation" 
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Book a free consultation ↗
              </Link>
            </div>
          </div>
        </section>


        <Footer />
      </div>
    </div>
  );
}
