'use client';

import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function HomePage() {
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

    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (menuToggle && mainNav) {
      const handleMenuToggle = () => {
        mainNav.classList.toggle('active');
        
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
          icon?.classList.remove('fa-bars');
          icon?.classList.add('fa-times');
        } else {
          icon?.classList.remove('fa-times');
          icon?.classList.add('fa-bars');
          
          const activeItems = mainNav.querySelectorAll('.has-submenu.active');
          activeItems.forEach(item => {
            item.classList.remove('active');
          });
        }
      };

      menuToggle.addEventListener('click', handleMenuToggle);

      // Handle dropdown toggles on mobile
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const parentItem = this.closest('.has-submenu');
            
            const otherActiveItems = mainNav.querySelectorAll('.has-submenu.active');
            otherActiveItems.forEach(item => {
              if (item !== parentItem) {
                item.classList.remove('active');
              }
            });
            
            parentItem?.classList.toggle('active');
          }
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target as Node) && !menuToggle.contains(e.target as Node)) {
          mainNav.classList.remove('active');
          const icon = menuToggle.querySelector('i');
          icon?.classList.remove('fa-times');
          icon?.classList.add('fa-bars');
          
          const activeItems = mainNav.querySelectorAll('.has-submenu.active');
          activeItems.forEach(item => {
            item.classList.remove('active');
          });
        }
      });

      // Close menu when window is resized to desktop size
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          mainNav.classList.remove('active');
          const icon = menuToggle.querySelector('i');
          icon?.classList.remove('fa-times');
          icon?.classList.add('fa-bars');
          
          const activeItems = mainNav.querySelectorAll('.has-submenu.active');
          activeItems.forEach(item => {
            item.classList.remove('active');
          });
        }
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <h1 className="base-hero-h1">Your Personal CFO</h1>
          <p className="subtitle">Tailored Financial Leadership for Individuals & Businesses</p>
          <p className="description">
            Empower your financial future with strategic, reliable, and personalized CFO services. Whether you're managing personal wealth or running a business, we've got the right solution for you.
          </p>
          <Link href="/consultation" className="btn btn-primary">
            Book a free consultation
          </Link>
        </div>
      </section>

      {/* Finance Transformation Partners Section */}
      <section className="solutions-section virtual-cfo-services">
        <div className="container">
          <div className="solutions-extra-cover">
            <div className="solutions-intro-wrapper">
              <div className="solutions-text">
                <p>Your Finance Transformation Partners</p>
                <h2>Omichannel CFO service</h2>
                <p className="virtual-cfo-desc">
                  At the core of our CFO services lies a deep commitment to financial clarity, growth, and long-term security—whether you're managing personal wealth or driving business success. Our private CFO expertise spans both individual and enterprise finance, combining decades of experience with modern, data-driven tools to help you make confident financial decisions.
                </p>
                <div className="mission-vision">
                  <div className="item">
                    <div className="icon">
                      <img src="/images/icons/mission.png" alt="Mission Image" />
                    </div>
                    <h3>Mission</h3>
                    <p>Deliver expert CFO solutions that empower smart, strategic financial decision-making.</p>
                  </div>
                  <div className="item">
                    <div className="icon">
                      <img src="/images/icons/vision.png" alt="Vision Image" />
                    </div>
                    <h3>Vision</h3>
                    <p>Become the leading force in trusted, personalized private CFO services globally.</p>
                  </div>
                </div>
              </div>
              
              <div className="solutions-photo-placeholder">
                <img src="/images/icons/omichannel.png" alt="omichannel CFO service" className="virtual-cfo-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Leadership Section */}
      <section className="strategic-leadership">
        <div className="container">
          <div className="strategic-statement">
            <div className="strategic-contanier">
              <h2 className="section-title-large">Strategic Financial Leadership, Personalized to Your Needs.</h2>
              <p>
                At the core of our CFO services lies a deep commitment to financial clarity, growth, and long-term security—whether you're managing personal wealth or driving business success. Our private CFO expertise spans both individual and enterprise finance, combining decades of experience with modern, data-driven tools to help you make confident financial decisions.
              </p>
            </div>
            <div className="cards-container">
              <div className="card">
                <h3>Are you an Individual ?</h3>
                <p>Navigate complex finances</p>
                <Link href="/services?type=individual" className="btn btn-secondary">
                  Explore services
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
              <div className="card">
                <h3>Are you a MSME/ Business ?</h3>
                <p>Drive growth with expert insights.</p>
                <Link href="/services?type=business" className="btn btn-secondary">
                  Explore services
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Health Section */}
      <section className="solutions-section financial-health">
        <div className="container financial-health-section">
          <div className="solutions-extra-cover">
            <div className="solutions-text content-wrapper">
              <div className="text-content d-flex">
                <div>
                  <p className="section-title-small">Know exactly where you stand financially</p>
                  <h2 className="section-title-large">Why Financial Health Score Matters ?</h2>
                </div>
                <div className="image-placeholder-wrapper">
                  <div className="image-placeholder">
                    <img src="/images/services/financial-health.png" alt="" className="financial-health-image" />
                  </div>
                </div>
              </div>
              <p className="text-subheading">Success isn't just about earning more—it's about knowing where you stand.</p>
              <p>
                Our Financial Health Score is more than a number—it's a CFO-calibrated assessment designed to reveal the true condition of your finances. Whether you're growing personal wealth or managing a business, this score tells you what's strong, what's at risk, and what to do next.
              </p>
              <p className="sub-group">Your finances are talking. It's time to understand what they're saying.</p>
              <Link href="/consultation" className="btn btn-secondary">
                Check My <br />Financial Health
                <svg style={{ float: 'right', marginTop: '5px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Consult CFO Section */}
      <section className="why-consult-cfo">
        <div className="container why-consult-cfo-section">
          <div className="solutions-extra-cover cfo-consultant-container">
            <h2 className="section-title-large">Why Consult a CFO — Even If You Think You Don't Need One</h2>
            <span className="quote">"Are your financial decisions based on insight—or just instinct?"</span>
            <p>
              In today's fast-moving world, financial decisions can't rely on trial and error. Whether you're a high-net-worth individual or a founder navigating growth, hiring a CFO isn't a cost—it's a competitive advantage. A CFO provides strategic clarity, future-focused planning, and operational control that tools, advisors, and accountants alone simply cannot deliver.
            </p>
            <Link href="/consultation" className="btn btn-primary">
              Book a free consultation 
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
