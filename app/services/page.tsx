'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { 
  individualServices, 
  businessServices, 
  individualTestimonials,
  businessTestimonials,
  individualFaqs,
  businessFaqs,
  pageContent 
} from '@/lib/services-data';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceType = searchParams.get('type') || 'individual';
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const services = serviceType === 'business' ? businessServices : individualServices;
  const content = pageContent[serviceType as keyof typeof pageContent];
  const pageTitle = serviceType === 'business' ? 'Business CFO Services' : 'Individual CFO Services';
  // Use correct testimonials and faqs arrays
  const testimonialsArr = serviceType === 'business' ? businessTestimonials : individualTestimonials;
  const faqsArr = serviceType === 'business' ? businessFaqs : individualFaqs;

  // Handle service type change
  const switchServiceType = (type: string) => {
    // Update URL using Next.js router for proper navigation
    const params = new URLSearchParams(window.location.search);
    params.set('type', type);
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <Header />
      
      {/* Dynamic Hero Background Styling */}
      <style jsx>{`
        .hero {
          background-image: url('/images/hero/${serviceType === 'business' ? 'business_hero_image.jpg' : 'individual_hero_image.jpg'}');
          background-size: cover;
          background-position: center;
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div style={{minWidth: 0}}>
            <h1 style={{marginBottom: '18px'}}>{content.heroTitle}</h1>
            <p className="subtitle" style={{marginBottom: '18px'}}>{content.heroSubtitle}</p>
          </div>
          <div style={{alignItems: 'center'}}>
            <Link href="/consultation" className="btn btn-primary" style={{whiteSpace: 'nowrap', minWidth: '220px'}}>
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Financial Solutions Section */}
      <section className="solutions-section">
        <div className="container">
          <div className="solutions-extra-cover">
            <div className="solutions-intro-wrapper">
              <div className="solutions-text">
                <h2>
                  <p>{content.sectionTitle}</p>
                </h2>
                <p className="subtitle">{content.sectionSubtitle}</p>
                <p>{content.sectionDescription}</p>
              </div>
              
              <div className="solutions-photo-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '220px', minHeight: '220px', background: 'none' }}>
                <img
                  src={serviceType === 'business' ? '/images/services/business-service-solution.jpg' : '/images/services/individual-service-solution.jpg'}
                  alt={serviceType === 'business' ? 'Business Service Solution' : 'Individual Service Solution'}
                  style={{objectFit: 'cover', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                />
              </div>
            </div>
            
            <h3 className="services-offered-title">Services Offered:</h3>
            
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-icon" style={{paddingBottom: '10px'}}>
                    <img 
                      src={service.icon} 
                      alt={service.alt || `${service.title} icon`}
                      style={{
                        width: '68px',
                        height: '68px', 
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                        background: 'none'
                      }}
                    />
                  </div>
                  <h4 style={{textAlign: 'left', fontSize: '1.025em'}}>{service.title}</h4>
                  <ul>
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="solutions-cta">
              <Link href="/consultation" className="btn btn-primary">
                Book a One-on-One free consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title impact-title">The Impact of our work</h2>
          <div className="testimonials-grid" style={{maxHeight: '340px', overflowY: 'auto', display: 'block', paddingRight: '8px', scrollbarWidth: 'none'}}>
            {testimonialsArr.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{background: 'none', border: 'none', borderRadius: 0, boxShadow: 'none', padding: '18px 0 18px 0', marginBottom: 0, borderBottom: '1px solid #232946'}}>
                <div className="testimonial-header" style={{display: 'flex', alignItems: 'center', marginBottom: '8px', background: 'none', boxShadow: 'none', padding: 0}}>
                  <img 
                    src={testimonial.avatar} 
                    alt="" 
                    width="auto" 
                    className="avatar-placeholder" 
                    style={{width: '40px', height: '40px', backgroundColor: '#374151', borderRadius: '50%', marginRight: '15px'}}
                  />
                  <div className="testimonial-info">
                    <h3 style={{margin: '0 0 2px 0', fontSize: '1.1em'}}>{testimonial.name}</h3>
                    <p style={{margin: 0, fontSize: '0.9em', color: '#9ca3af'}}>{testimonial.title}</p>
                  </div>
                  <div className="testimonial-rating" style={{marginLeft: 'auto', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '2px'}}>
                    {[...Array(5)].map((_, starIndex) => (
                      <i key={starIndex} className="fas fa-star" style={{color: '#25a2eb', marginRight: '1px'}}></i>
                    ))}
                    <span style={{marginLeft: '8px', color: '#fff', fontWeight: 'bold'}}>{testimonial.rating}</span>
                  </div>
                </div>
                <p className="testimonial-text" style={{fontSize: '1em', lineHeight: 1.7, color: '#d1d5db', marginLeft: '55px', marginBottom: 0}}>
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title faq-title">FAQs</h2>
          <div className="faq-list">
            {faqsArr.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div className="question-text">{faq.question}</div>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>}>
      <ServicesContent />
    </Suspense>
  );
}
