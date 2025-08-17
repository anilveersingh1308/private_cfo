"use client";
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import '../styles/legal_pages.css';

const toc = [
  'Acceptance of Terms',
  'Description of Services',
  'User Accounts and Registration',
  'Financial Advisory Disclaimer',
  'User Conduct and Prohibited Uses',
  'Payment Terms and Billing',
  'Intellectual Property Rights',
  'Confidentiality and Data Protection',
  'Third-Party Services and Links',
  'Limitation of Liability',
  'Indemnification',
  'Termination and Suspension',
  'Governing Law and Jurisdiction',
  'Dispute Resolution',
  'Miscellaneous Provisions',
];

const sections = [
  {
    title: 'Acceptance of Terms',
    content: (
      <>
        <div className="highlight-box">
          <p><strong>Legal Agreement:</strong> By accessing our services, you enter into a legally binding agreement. If you do not agree to these terms, please discontinue use immediately.</p>
        </div>
        <div className="section-content">
          <p>
            Welcome to Private CFO Club, operated by GIGAFACTRY INNOVATIONS PVT. LTD. These Terms of Service ("Terms") govern your use of our website located at www.privatecfo.com and our financial advisory services (the "Service").<br /><br />
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.<br /><br />
            We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically to stay informed about our rules and policies.<br /><br />
            If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms, in which case "you" will refer to such entity.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'Description of Services',
    content: (
      <div className="section-content">
        <p>
          Private CFO Club provides comprehensive financial advisory and consultation services, including but not limited to:<br /><br />
          <strong>Individual Financial Services:</strong><br />
          - Personal financial planning and wealth management<br />
          - Investment advisory and portfolio management<br />
          - Tax planning and optimization strategies<br />
          - Retirement planning and pension advice<br />
          - Insurance and risk management consultation<br />
          - Estate planning and wealth transfer strategies<br /><br />
          <strong>Business Financial Services:</strong><br />
          - Chief Financial Officer (CFO) services for businesses<br />
          - Financial analysis and business planning<br />
          - Cash flow management and forecasting<br />
          - Financial reporting and compliance<br />
          - Merger and acquisition advisory<br />
          - Corporate tax planning and structuring<br /><br />
          <strong>Additional Services:</strong><br />
          - Financial education and training programs<br />
          - Newsletter subscriptions with market insights<br />
          - Online financial calculators and tools<br />
          - One-on-one consultation sessions<br /><br />
          We provide these services through various channels including in-person meetings, video consultations, phone calls, email correspondence, and our online platform. The specific scope and nature of services will be detailed in separate service agreements or consultation agreements.
        </p>
      </div>
    ),
  },
  {
    title: 'User Accounts and Registration',
    content: (
      <div className="section-content">
        <p>
          To access certain features of our Service, you may be required to create an account. When you create an account with us, you must provide information that is accurate, complete, and current at all times.<br /><br />
          <strong>Account Security:</strong><br />
          You are responsible for safeguarding the password and all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.<br /><br />
          <strong>Account Information:</strong><br />
          You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. We reserve the right to suspend or terminate your account if any information provided is inaccurate, outdated, or incomplete.<br /><br />
          <strong>Account Termination:</strong><br />
          We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the Service will cease immediately.<br /><br />
          <strong>User Responsibilities:</strong><br />
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must not share your account with others or allow others to access your account.
        </p>
      </div>
    ),
  },
  {
    title: 'Financial Advisory Disclaimer',
    content: (
      <>
        <div className="warning-box">
          <p><strong>Investment Warning:</strong> All investments carry risk including potential loss of principal. Past performance does not guarantee future results. Please consult qualified professionals before making financial decisions.</p>
        </div>
        <div className="section-content">
          <p>
            <strong>Important Financial Disclaimer:</strong><br />
            The financial advice and recommendations provided by Private CFO Club are for informational and educational purposes only. Our services do not constitute investment advice, legal advice, or tax advice, and should not be relied upon as such.<br /><br />
            <strong>Investment Risks:</strong><br />
            All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results. Market conditions, economic factors, and individual circumstances can significantly impact investment outcomes.<br /><br />
            <strong>Professional Consultation:</strong><br />
            While our advisors are experienced financial professionals, you should always consult with qualified legal, tax, and investment professionals before making any financial decisions. We recommend seeking independent advice tailored to your specific situation.<br /><br />
            <strong>No Guarantee of Results:</strong><br />
            We do not guarantee any specific financial outcomes or returns on investments. Financial markets are inherently unpredictable, and results may vary significantly based on market conditions and individual circumstances.<br /><br />
            <strong>Regulatory Compliance:</strong><br />
            Our services are provided in compliance with applicable Indian financial regulations. However, you are responsible for ensuring that any actions you take based on our advice comply with all applicable laws and regulations in your jurisdiction.<br /><br />
            <strong>Limitation of Fiduciary Duty:</strong><br />
            While we strive to act in your best interests, the nature and extent of our fiduciary duties will be specified in separate advisory agreements. General consultations and educational content do not create a fiduciary relationship.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'User Conduct and Prohibited Uses',
    content: (
      <div className="section-content">
        <p>
          You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair our Service. Prohibited activities include, but are not limited to:<br /><br />
          <strong>Prohibited Content:</strong><br />
          - Posting false, misleading, or defamatory information<br />
          - Sharing content that violates intellectual property rights<br />
          - Uploading malicious software or harmful code<br />
          - Distributing spam or unsolicited commercial communications<br /><br />
          <strong>Prohibited Activities:</strong><br />
          - Attempting to gain unauthorized access to our systems<br />
          - Interfering with or disrupting the Service or servers<br />
          - Using automated systems to access or interact with the Service<br />
          - Impersonating others or misrepresenting your identity<br />
          - Collecting or harvesting personal information from other users<br /><br />
          <strong>Professional Conduct:</strong><br />
          - Providing false or misleading financial information<br />
          - Sharing confidential information inappropriately<br />
          - Using our services for illegal financial activities<br />
          - Violating applicable securities laws or regulations<br /><br />
          <strong>Compliance Requirements:</strong><br />
          You agree to comply with all applicable laws, regulations, and industry standards when using our Service. This includes but is not limited to financial regulations, data protection laws, and anti-money laundering requirements.<br /><br />
          Violation of these terms may result in immediate termination of your access to the Service and potential legal action.
        </p>
      </div>
    ),
  },
  {
    title: 'Payment Terms and Billing',
    content: (
      <div className="section-content">
        <p>
          <strong>Service Fees:</strong><br />
          Our services are provided on a fee-for-service basis. Fees vary depending on the type and scope of services requested. All fees will be clearly communicated before service delivery begins.<br /><br />
          <strong>Payment Methods:</strong><br />
          We accept various payment methods including bank transfers, online payments, and other methods as specified on our platform. Payment terms will be outlined in your service agreement.<br /><br />
          <strong>Billing and Invoicing:</strong><br />
          - Invoices will be sent electronically unless otherwise requested<br />
          - Payment is typically due within 30 days of invoice date<br />
          - Late payment may result in suspension of services<br />
          - Outstanding balances may incur interest charges as permitted by law<br /><br />
          <strong>Refund Policy:</strong><br />
          Refunds are handled on a case-by-case basis and depend on the nature of services provided. Generally:<br />
          - Consultation services are non-refundable once provided<br />
          - Subscription services may be refunded on a pro-rata basis<br />
          - Cancellations must be made in writing with appropriate notice<br /><br />
          <strong>Price Changes:</strong><br />
          We reserve the right to modify our pricing structure with reasonable notice. Existing service agreements will honor the original pricing terms unless mutually agreed otherwise.<br /><br />
          <strong>Taxes:</strong><br />
          All fees are exclusive of applicable taxes unless otherwise stated. You are responsible for paying all applicable taxes related to your use of our services.
        </p>
      </div>
    ),
  },
  // The following sections are placeholders for brevity. You can fill them with actual content as needed.
  { title: 'Intellectual Property Rights', content: <div className="section-content"><p>Content for Intellectual Property Rights.</p></div> },
  { title: 'Confidentiality and Data Protection', content: <div className="section-content"><p>Content for Confidentiality and Data Protection.</p></div> },
  { title: 'Third-Party Services and Links', content: <div className="section-content"><p>Content for Third-Party Services and Links.</p></div> },
  { title: 'Limitation of Liability', content: <div className="section-content"><p>Content for Limitation of Liability.</p></div> },
  { title: 'Indemnification', content: <div className="section-content"><p>Content for Indemnification.</p></div> },
  { title: 'Termination and Suspension', content: <div className="section-content"><p>Content for Termination and Suspension.</p></div> },
  { title: 'Governing Law and Jurisdiction', content: <div className="section-content"><p>Content for Governing Law and Jurisdiction.</p></div> },
  { title: 'Dispute Resolution', content: <div className="section-content"><p>Content for Dispute Resolution.</p></div> },
  { title: 'Miscellaneous Provisions', content: <div className="section-content"><p>Content for Miscellaneous Provisions.</p></div> },
];

export default function TermsOfServicePage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <section className="legal-hero">
        <div className="container">
          <h1><i className="fas fa-file-contract"></i> Terms of Service</h1>
          <p className="subtitle">Legal Terms and Service Agreement</p>
          <p>Please read these Terms of Service carefully before using our financial advisory services. These terms govern your relationship with Private CFO Club and outline your rights and responsibilities.</p>
        </div>
      </section>
      <div className="legal-content">
        <div className="legal-wrapper">
          <div className="last-updated">
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
              <div className="date-info">
                <i className="fas fa-calendar-alt"></i>
                <strong>Last Updated:</strong> August 17, 2025
              </div>
              <div className="date-info">
                <i className="fas fa-globe"></i>
                <strong>Jurisdiction:</strong> India
              </div>
            </div>
          </div>
          <div className="table-of-contents">
            <h3><i className="fas fa-list-ul"></i> Table of Contents</h3>
            <div className="toc-grid">
              {toc.map((item, idx) => (
                <div className="toc-item" key={item}>
                  <a href={`#section-${idx + 1}`}>
                    <span className="section-number">{idx + 1}</span> {item}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {sections.map((section, idx) => (
            <div className="section" id={`section-${idx + 1}`} key={section.title}>
              <h2>
                <span className="section-icon">
                  <i className="fas fa-file-alt"></i>
                </span>
                {idx + 1}. {section.title}
              </h2>
              {section.content}
            </div>
          ))}
          <div className="contact-highlight">
            <h3><i className="fas fa-balance-scale"></i> Legal Questions or Concerns?</h3>
            <p>If you have any questions about these Terms of Service, need clarification on any provisions, or have legal concerns, please contact our legal department:</p>
            <div className="contact-info-grid">
              <div className="legal-contact-item">
                <i className="fas fa-envelope"></i>
                <div>info@privatecfo.com</div>
              </div>
              <div className="legal-contact-item">
                <i className="fas fa-phone"></i>
                <div>+91-7084646376</div>
              </div>
              <div className="legal-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>B-80, SECTOR-65, NOIDA, UP-201301</div>
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Agreement Summary</h2>
            <p><strong>Key Points:</strong> These Terms of Service establish a legal framework for the provision of financial advisory services by Private CFO CLUB. By using our services, you acknowledge understanding and acceptance of all terms outlined above.</p>
            <p><strong>Regular Updates:</strong> We may update these terms periodically to reflect changes in law, regulation, or business practices. Continued use of our services indicates acceptance of updated terms.</p>
            <p><strong>Professional Standards:</strong> Our services are provided in accordance with applicable Indian financial regulations and industry best practices. We maintain professional indemnity insurance and adhere to strict confidentiality standards.</p>
            <p><strong>Dispute Resolution:</strong> We are committed to resolving any disputes amicably through direct communication. Should formal dispute resolution be necessary, we follow established legal procedures as outlined in these terms.</p>
            <div className="highlight-box"><strong>Thank You:</strong> We appreciate your trust in Private CFO CLUB for your financial advisory needs. These terms ensure a clear understanding of our mutual rights and responsibilities.</div>
          </div>
        </div>
      </div>
      {/* Book Consultation Section */}
      <section className="book-consultation-section" style={{background: 'var(--bg-dark)', padding: '4rem 0', borderTop: '1px solid var(--border-color)'}}>
        <div className="container">
          <div style={{maxWidth: '700px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{color: 'var(--color-text-light)', fontWeight: 700, marginBottom: '1.5rem'}}>
              <i className="fas fa-calendar-check" style={{color: 'var(--primary-blue)', marginRight: '0.5rem'}}></i>
              Book a Consultation
            </h2>
            <p style={{color: 'var(--color-text)', fontSize: '1.15rem', marginBottom: '2rem'}}>Ready to take control of your financial future? Schedule a personalized consultation with our expert advisors today.</p>
            <a href="/consultation" className="btn-legal" style={{fontSize: '1.1rem'}}>
              <i className="fas fa-arrow-right"></i> Book Now
            </a>
          </div>
        </div>
      </section>
      <section className="quick-links-section">
        <div className="container">
          <div className="quick-links-grid">
            <div className="quick-link-card">
              <h4><i className="fas fa-shield-alt"></i> Privacy Policy</h4>
              <p>Read our Privacy Policy for details on how we protect your data.</p>
              <a className="btn-legal" href="/privacy-policy">View Privacy Policy</a>
            </div>
            <div className="quick-link-card">
              <h4><i className="fas fa-file-contract"></i> Terms of Service</h4>
              <p>Review the full Terms of Service for our financial advisory platform.</p>
              <a className="btn-legal" href="/terms-of-service">View Terms of Service</a>
            </div>
            <div className="quick-link-card">
              <h4><i className="fas fa-user-shield"></i> Contact Legal</h4>
              <p>Contact our legal team for any questions or concerns regarding our policies.</p>
              <a className="btn-legal" href="mailto:info@privatecfo.com">Contact Legal</a>
            </div>
          </div>
        </div>
      </section>
      <button
        className={`scroll-to-top${showScroll ? ' visible' : ''}`}
        id="scrollToTop"
        title="Back to top"
        onClick={scrollToTop}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      <Footer />
    </>
  );
}
