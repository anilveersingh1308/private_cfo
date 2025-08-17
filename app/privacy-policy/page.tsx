"use client";

"use client";
import React, { useEffect } from "react";
import "../styles/legal_pages.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const toc = [
  { num: "01", title: "1. Introduction and Overview", icon: "fas fa-info-circle" },
  { num: "02", title: "2. Information We Collect", icon: "fas fa-database" },
  { num: "03", title: "3. How We Use Your Information", icon: "fas fa-cogs" },
  { num: "04", title: "4. Legal Basis for Processing", icon: "fas fa-balance-scale" },
  { num: "05", title: "5. Information Sharing and Disclosure", icon: "fas fa-share-alt" },
  { num: "06", title: "6. Data Security Measures", icon: "fas fa-shield-alt" },
  { num: "07", title: "7. Data Retention Policies", icon: "fas fa-archive" },
  { num: "08", title: "8. Your Privacy Rights", icon: "fas fa-user-shield" },
  { num: "09", title: "9. Cookies and Tracking Technologies", icon: "fas fa-cookie-bite" },
  { num: "10", title: "10. Third-Party Services and Links", icon: "fas fa-external-link-alt" },
  { num: "11", title: "11. International Data Transfers", icon: "fas fa-globe" },
  { num: "12", title: "12. Children's Privacy Protection", icon: "fas fa-child" },
  { num: "13", title: "13. Changes to Privacy Policy", icon: "fas fa-edit" },
  { num: "14", title: "14. Contact Information and Data Protection", icon: "fas fa-envelope" },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn?.classList.add("visible");
      } else {
        scrollToTopBtn?.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
        <Header />

      <section className="legal-hero">
        <div className="container">
          <h1><i className="fas fa-shield-alt"></i> Privacy Policy</h1>
          <p className="subtitle">Your Privacy and Data Protection Rights</p>
          <p>We are committed to protecting your personal information and being transparent about how we use it. This comprehensive policy outlines our practices and your rights.</p>
        </div>
      </section>
      <div className="legal-content">
        <div className="legal-wrapper">
          <div className="last-updated">
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2rem" }}>
              <div className="date-info">
                <i className="fas fa-calendar-alt"></i>
                <span><strong>Last Updated:</strong> January 30, 2025</span>
              </div>
              <div className="date-info">
                <i className="fas fa-clock"></i>
                <span><strong>Effective Date:</strong> January 30, 2025</span>
              </div>
            </div>
          </div>
          <div className="table-of-contents">
            <h3><i className="fas fa-list-ul"></i> Table of Contents</h3>
            <div className="toc-grid">
              {toc.map((item, idx) => (
                <div className="toc-item" key={item.title}>
                  <a href={`#section-${idx + 1}`}>
                    <span className="section-number">{item.num}</span>
                    <span>{item.title}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Policy Sections - All 14 sections, perfectly displayed */}
          <div className="section" id="section-1">
            <h2><span className="section-icon"><i className="fas fa-info-circle"></i></span> 1. Introduction and Overview</h2>
            <div className="highlight-box"><p><strong>Important:</strong> This Privacy Policy is legally binding. By using our services, you agree to the collection and use of information in accordance with this policy.</p></div>
            <div className="section-content">
              <p>Welcome to Private CFO Club, operated by GIGAFACTRY INNOVATIONS ("we", "us", or "our"). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.privatecfo.com and use our services.</p>
              <p>Private CFO Club provides comprehensive financial advisory services, including personal financial planning, business CFO services, tax planning, investment advisory, and related financial consultation services. We understand that financial information is highly sensitive and personal, and we take our responsibility to protect your privacy seriously.</p>
              <p>This Privacy Policy applies to all users of our website and services, including visitors, consultation clients, newsletter subscribers, and business clients. By accessing our website or using our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</p>
              <p>We are committed to transparency about our data practices and will provide clear information about how your personal information is handled. This policy describes our practices regarding the collection, use, and disclosure of information through our website and services, and it applies regardless of how you access or use our services.</p>
            </div>
          </div>
          <div className="section" id="section-2">
            <h2><span className="section-icon"><i className="fas fa-database"></i></span> 2. Information We Collect</h2>
            <div className="section-content">
              <p>We collect various types of information to provide and improve our services:</p>
              <strong>Personal Information You Provide:</strong>
              <ul>
                <li>Contact Information: Name, email address, phone number, mailing address</li>
                <li>Demographics: Age, gender, occupation, industry, income range</li>
                <li>Financial Information: Investment goals, risk tolerance, financial objectives, current financial situation</li>
                <li>Professional Information: Business details, company size, industry type, revenue information</li>
                <li>Consultation Details: Specific financial needs, questions, and requirements during consultations</li>
                <li>Payment Information: Billing details for paid services (processed securely through third-party payment processors)</li>
              </ul>
              <strong>Information Collected Automatically:</strong>
              <ul>
                <li>Device Information: IP address, browser type, operating system, device identifiers</li>
                <li>Usage Data: Pages visited, time spent on pages, click-through rates, search queries</li>
                <li>Location Information: General geographic location based on IP address</li>
                <li>Cookies and Tracking Technologies: Session data, preferences, and website functionality</li>
              </ul>
              <strong>Information from Third Parties:</strong>
              <ul>
                <li>Social Media: If you connect through social media platforms, we may receive profile information</li>
                <li>Referral Sources: Information from partners or referral sources about how you found our services</li>
                <li>Public Records: Publicly available business information for business clients</li>
                <li>Service Providers: Data from payment processors, analytics providers, and other service providers</li>
              </ul>
            </div>
          </div>
          <div className="section" id="section-3">
            <h2><span className="section-icon"><i className="fas fa-cogs"></i></span> 3. How We Use Your Information</h2>
            <div className="section-content">
              <p>We use your information for legitimate business purposes including:</p>
              <strong>Service Delivery:</strong>
              <ul>
                <li>Providing personalized financial advice and consultation services</li>
                <li>Conducting financial analysis and preparing recommendations</li>
                <li>Creating customized financial plans and strategies</li>
                <li>Delivering ongoing support and follow-up services</li>
                <li>Processing payments and managing billing</li>
              </ul>
              <strong>Communication:</strong>
              <ul>
                <li>Responding to your inquiries and consultation requests</li>
                <li>Sending appointment confirmations and reminders</li>
                <li>Providing updates about your financial plans or recommendations</li>
                <li>Sending newsletters and educational content (with your consent)</li>
                <li>Notifying you about service changes or policy updates</li>
              </ul>
              <strong>Business Operations:</strong>
              <ul>
                <li>Improving our services and developing new offerings</li>
                <li>Conducting market research and analysis</li>
                <li>Training our staff and quality assurance</li>
                <li>Compliance with legal and regulatory requirements</li>
                <li>Fraud prevention and security measures</li>
              </ul>
              <strong>Marketing and Analytics:</strong>
              <ul>
                <li>Personalizing your experience on our website</li>
                <li>Analyzing website usage and user behavior</li>
                <li>Sending promotional materials about our services (with your consent)</li>
                <li>Measuring the effectiveness of our marketing campaigns</li>
                <li>Understanding market trends and customer preferences</li>
              </ul>
            </div>
          </div>
          <div className="section" id="section-4">
            <h2><span className="section-icon"><i className="fas fa-balance-scale"></i></span> 4. Legal Basis for Processing</h2>
            <div className="section-content">
              <p>We process your personal information based on the following legal grounds:</p>
              <ul>
                <li><strong>Consent:</strong> Where you have given clear consent for us to process your personal information for specific purposes, such as marketing communications or newsletter subscriptions.</li>
                <li><strong>Contract Performance:</strong> Where processing is necessary for the performance of a contract with you, such as providing financial advisory services or consultation.</li>
                <li><strong>Legitimate Interests:</strong> Where we have legitimate business interests that are not overridden by your privacy rights, such as improving our services, fraud prevention, and business analytics.</li>
                <li><strong>Legal Compliance:</strong> Where we need to process your information to comply with legal obligations, such as tax reporting, regulatory requirements, or court orders.</li>
                <li><strong>Vital Interests:</strong> In rare circumstances, where processing is necessary to protect your vital interests or those of another person.</li>
              </ul>
              <p>We will always ensure that our processing is fair, lawful, and transparent, and we will not process your information in ways that are incompatible with the purposes for which it was collected.</p>
            </div>
          </div>
          <div className="section" id="section-5">
            <h2><span className="section-icon"><i className="fas fa-share-alt"></i></span> 5. Information Sharing and Disclosure</h2>
            <div className="section-content">
              <p>We may share your information in the following circumstances:</p>
              <strong>Service Providers:</strong>
              <ul>
                <li>Payment processors for handling transactions</li>
                <li>Cloud hosting providers for data storage and website functionality</li>
                <li>Email service providers for communications</li>
                <li>Analytics providers for website and service improvement</li>
                <li>Customer support platforms</li>
              </ul>
              <strong>Legal Requirements:</strong>
              <ul>
                <li>Compliance with court orders, subpoenas, or legal processes</li>
                <li>Regulatory reporting requirements</li>
                <li>Tax reporting obligations</li>
                <li>Law enforcement requests where legally required</li>
              </ul>
              <strong>Business Transfers:</strong>
              <ul>
                <li>In the event of a merger, acquisition, sale of assets, or bankruptcy, your information may be transferred to the acquiring entity, subject to the same privacy protections.</li>
              </ul>
              <strong>Protection of Rights:</strong>
              <ul>
                <li>Protect our legal rights and interests</li>
                <li>Enforce our terms of service or other agreements</li>
                <li>Prevent fraud or other illegal activities</li>
                <li>Protect the safety and security of our users and the public</li>
              </ul>
              <strong>With Your Consent:</strong>
              <ul>
                <li>We may share your information with other parties when you have given explicit consent for such sharing.</li>
              </ul>
              <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes without your explicit consent.</p>
            </div>
          </div>
          <div className="section" id="section-6">
            <h2><span className="section-icon"><i className="fas fa-shield-alt"></i></span> 6. Data Security Measures</h2>
            <div className="section-content">
              <p>We implement comprehensive security measures to protect your personal information:</p>
              <strong>Technical Safeguards:</strong>
              <ul>
                <li>Encryption of sensitive data both in transit and at rest using industry-standard protocols</li>
                <li>Secure Socket Layer (SSL) technology for all data transmissions</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Firewalls and intrusion detection systems</li>
                <li>Secure backup systems with regular testing</li>
              </ul>
              <strong>Administrative Safeguards:</strong>
              <ul>
                <li>Employee training on data protection and privacy principles</li>
                <li>Access controls limiting employee access to personal information on a need-to-know basis</li>
                <li>Background checks for employees with access to sensitive information</li>
                <li>Regular review and updating of security policies and procedures</li>
                <li>Incident response plans for potential data breaches</li>
              </ul>
              <strong>Physical Safeguards:</strong>
              <ul>
                <li>Secure facilities with controlled access</li>
                <li>Locked storage for physical documents containing personal information</li>
                <li>Secure disposal procedures for documents and electronic media</li>
              </ul>
              <strong>Third-Party Security:</strong>
              <ul>
                <li>Careful vetting of service providers and their security practices</li>
                <li>Contractual requirements for service providers to maintain appropriate security measures</li>
                <li>Regular assessment of third-party security practices</li>
              </ul>
              <p>While we implement strong security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but will notify you promptly if we become aware of any security breach affecting your personal information.</p>
            </div>
          </div>
          <div className="section" id="section-7">
            <h2><span className="section-icon"><i className="fas fa-archive"></i></span> 7. Data Retention Policies</h2>
            <div className="section-content">
              <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy:</p>
              <strong>General Retention Periods:</strong>
              <ul>
                <li>Consultation records: 7 years after the end of our service relationship</li>
                <li>Financial planning documents: 7 years as required by financial regulations</li>
                <li>Tax-related information: 7 years as required by tax authorities</li>
                <li>Marketing communications: Until you unsubscribe or object to processing</li>
                <li>Website analytics data: 26 months from collection</li>
              </ul>
              <strong>Factors Affecting Retention:</strong>
              <ul>
                <li>Legal and regulatory requirements in the financial services industry</li>
                <li>The nature and sensitivity of the information</li>
                <li>Potential risks from unauthorized use or disclosure</li>
                <li>Whether we can achieve our purposes through other means</li>
                <li>Your requests for deletion or modification</li>
              </ul>
              <strong>Secure Deletion:</strong>
              <ul>
                <li>Overwriting electronic data multiple times</li>
                <li>Physical destruction of paper documents</li>
                <li>Removing all identifying information from any retained records</li>
              </ul>
              <strong>Legal Holds:</strong>
              <ul>
                <li>We may retain information longer than normal retention periods when required by legal holds, litigation, investigations, or regulatory inquiries.</li>
              </ul>
              <p>You may request information about our retention practices for your specific data by contacting us using the information provided in this policy.</p>
            </div>
          </div>
          <div className="section" id="section-8">
            <h2><span className="section-icon"><i className="fas fa-user-shield"></i></span> 8. Your Privacy Rights</h2>
            <div className="section-content">
              <p>You have several rights regarding your personal information:</p>
              <ul>
                <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you, including details about how it's being processed.</li>
                <li><strong>Right to Rectification:</strong> You can ask us to correct any inaccurate or incomplete personal information.</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal information in certain circumstances, such as when it's no longer necessary for the original purpose.</li>
                <li><strong>Right to Restrict Processing:</strong> You can ask us to limit how we use your information in certain situations.</li>
                <li><strong>Right to Data Portability:</strong> You can request a copy of your information in a commonly used format to transfer to another service provider.</li>
                <li><strong>Right to Object:</strong> You can object to processing based on legitimate interests or for direct marketing purposes.</li>
                <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw that consent at any time.</li>
                <li><strong>Right to Lodge a Complaint:</strong> You can file a complaint with relevant data protection authorities if you believe your rights have been violated.</li>
              </ul>
              <strong>How to Exercise Your Rights:</strong>
              <p>To exercise any of these rights, contact us at info@privatecfo.com or using the contact information provided below. We will respond to your request within 30 days and may require verification of your identity.</p>
              <p>Please note that some rights may be limited by legal requirements or the need to provide ongoing services to you.</p>
            </div>
            <div className="highlight-box">
              <p><strong>Remember:</strong> You have the right to control your personal information. Don't hesitate to contact us to exercise any of these rights.</p>
            </div>
          </div>
          <div className="section" id="section-9">
            <h2><span className="section-icon"><i className="fas fa-cookie-bite"></i></span> 9. Cookies and Tracking Technologies</h2>
            <div className="section-content">
              <p>We use cookies and similar tracking technologies to enhance your experience:</p>
              <strong>Types of Cookies We Use:</strong>
              <ul>
                <li>Essential Cookies: Necessary for website functionality and security</li>
                <li>Performance Cookies: Help us understand how visitors use our website</li>
                <li>Functionality Cookies: Remember your preferences and settings</li>
                <li>Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness</li>
              </ul>
              <strong>Specific Technologies:</strong>
              <ul>
                <li>HTTP Cookies: Small text files stored on your device</li>
                <li>Local Storage: Browser-based storage for website functionality</li>
                <li>Web Beacons: Small graphic images used to track email opens and website usage</li>
                <li>Google Analytics: For website analytics and performance measurement</li>
                <li>Social Media Pixels: For tracking social media campaign effectiveness</li>
              </ul>
              <strong>Managing Cookies:</strong>
              <ul>
                <li>Block all cookies (may affect website functionality)</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
                <li>Receive notifications when cookies are set</li>
              </ul>
              <strong>Third-Party Cookies:</strong>
              <ul>
                <li>Some of our business partners may set cookies through our website. We don't control these cookies and recommend reviewing their privacy policies.</li>
              </ul>
              <strong>Do Not Track:</strong>
              <p>Currently, our website doesn't respond to Do Not Track signals, but you can use browser settings and other tools to limit tracking.</p>
              <p>For more information about cookies and how to manage them, visit www.allaboutcookies.org.</p>
            </div>
          </div>
          <div className="section" id="section-10">
            <h2><span className="section-icon"><i className="fas fa-external-link-alt"></i></span> 10. Third-Party Services and Links</h2>
            <div className="section-content">
              <p>Our website and services may include links to third-party websites and integrate with external services:</p>
              <strong>Third-Party Websites:</strong>
              <ul>
                <li>Financial news and research websites</li>
                <li>Regulatory and government websites</li>
                <li>Partner service providers</li>
                <li>Social media platforms</li>
                <li>Payment processing services</li>
              </ul>
              <strong>Integrated Services:</strong>
              <ul>
                <li>Payment processors (Stripe, PayPal, etc.)</li>
                <li>Email marketing platforms</li>
                <li>Customer support systems</li>
                <li>Analytics and tracking services</li>
                <li>Cloud storage and hosting providers</li>
              </ul>
              <strong>Important Notes:</strong>
              <ul>
                <li>We are not responsible for the privacy practices of third-party websites</li>
                <li>Third-party sites have their own privacy policies and terms of service</li>
                <li>We encourage you to review privacy policies before providing information to third parties</li>
                <li>Our privacy policy doesn't apply to information collected by third parties</li>
              </ul>
              <strong>Data Sharing with Third Parties:</strong>
              <ul>
                <li>When we share data with service providers, we:</li>
                <li>Enter into data processing agreements</li>
                <li>Require appropriate security measures</li>
                <li>Limit data use to specified purposes</li>
                <li>Regularly review their practices</li>
              </ul>
              <strong>Your Choices:</strong>
              <p>You can choose not to use third-party services or click on external links. Some third-party integrations may be necessary for service functionality, which we'll clearly communicate.</p>
            </div>
          </div>
          <div className="section" id="section-11">
            <h2><span className="section-icon"><i className="fas fa-globe"></i></span> 11. International Data Transfers</h2>
            <div className="section-content">
              <p>As we operate primarily in India, most of your personal information is processed within India. However, some data may be transferred internationally:</p>
              <strong>Circumstances for International Transfers:</strong>
              <ul>
                <li>Use of cloud services with global infrastructure</li>
                <li>Service providers located in other countries</li>
                <li>Backup and disaster recovery systems</li>
                <li>Business operations requiring international access</li>
              </ul>
              <strong>Countries Involved:</strong>
              <ul>
                <li>United States (for cloud services and analytics)</li>
                <li>European Union (for certain service providers)</li>
                <li>Other countries where our service providers operate</li>
              </ul>
              <strong>Safeguards for International Transfers:</strong>
              <ul>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Standard contractual clauses approved by data protection authorities</li>
                <li>Binding corporate rules for multinational service providers</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Specific safeguards for sensitive financial data</li>
              </ul>
              <strong>Your Rights:</strong>
              <ul>
                <li>Know when your data is transferred internationally</li>
                <li>Understand the safeguards in place</li>
                <li>Request information about specific transfers</li>
                <li>Object to transfers in certain circumstances</li>
              </ul>
              <p>We ensure that all international transfers comply with applicable data protection laws and provide adequate protection for your personal information.</p>
            </div>
          </div>
          <div className="section" id="section-12">
            <h2><span className="section-icon"><i className="fas fa-child"></i></span> 12. Children's Privacy Protection</h2>
            <div className="section-content">
              <p>Our services are designed for adults and we do not knowingly collect personal information from children:</p>
              <strong>Age Restrictions:</strong>
              <ul>
                <li>Our services are intended for individuals 18 years and older</li>
                <li>We do not knowingly collect information from children under 18</li>
                <li>Users must confirm they are of legal age to enter into agreements</li>
              </ul>
              <strong>Parental Rights:</strong>
              <ul>
                <li>If we become aware that we have collected information from a child:</li>
                <li>We will delete the information promptly</li>
                <li>We will not use the information for any purpose</li>
                <li>Parents can request removal of their child's information</li>
              </ul>
              <strong>Educational Content:</strong>
              <ul>
                <li>While we may provide general financial education content that could be viewed by minors:</li>
                <li>No personal information collection is required to view educational content</li>
                <li>We don't track or profile users under 18</li>
                <li>Educational content is designed to be appropriate for all ages</li>
              </ul>
              <strong>Family Financial Planning:</strong>
              <ul>
                <li>When providing family financial planning services:</li>
                <li>We collect information about family members only when necessary for financial planning</li>
                <li>Information about minor children is collected with parental consent</li>
                <li>We limit collection to what's necessary for financial planning purposes</li>
              </ul>
              <p>If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.</p>
            </div>
          </div>
          <div className="section" id="section-13">
            <h2><span className="section-icon"><i className="fas fa-edit"></i></span> 13. Changes to Privacy Policy</h2>
            <div className="section-content">
              <p>We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws:</p>
              <strong>Notification of Changes:</strong>
              <ul>
                <li>Significant changes will be announced prominently on our website</li>
                <li>Email notifications to registered users for material changes</li>
                <li>Updated "Last Modified" date at the top of this policy</li>
                <li>Option to review previous versions upon request</li>
              </ul>
              <strong>Types of Changes:</strong>
              <ul>
                <li>Updates to reflect new services or features</li>
                <li>Changes in legal requirements or regulations</li>
                <li>Improvements to data security measures</li>
                <li>Clarifications based on user feedback</li>
                <li>Changes in third-party service providers</li>
              </ul>
              <strong>Your Consent:</strong>
              <ul>
                <li>Continued use of our services after changes constitutes acceptance</li>
                <li>For material changes, we may seek explicit consent</li>
                <li>You can withdraw consent and discontinue services if you disagree with changes</li>
              </ul>
              <strong>Reviewing Changes:</strong>
              <ul>
                <li>We encourage you to:</li>
                <li>Review this policy periodically</li>
                <li>Check the "Last Updated" date</li>
                <li>Contact us with questions about changes</li>
                <li>Understand how changes may affect your information</li>
              </ul>
              <strong>Historical Versions:</strong>
              <ul>
                <li>We maintain records of previous policy versions and can provide them upon request for your review.</li>
              </ul>
            </div>
          </div>
          <div className="section" id="section-14">
            <h2><span className="section-icon"><i className="fas fa-envelope"></i></span> 14. Contact Information and Data Protection</h2>
            <div className="section-content">
              <p>For any privacy-related questions, concerns, or requests, you can contact us:</p>
              <strong>Primary Contact:</strong>
              <ul>
                <li>Email: info@privatecfo.com</li>
                <li>Phone: +91-7084646376</li>
                <li>Address: B-80, SECTOR-65, NOIDA, UP-201301</li>
              </ul>
              <strong>Data Protection Officer:</strong>
              <ul>
                <li>Email: privacy@privatecfo.com</li>
              </ul>
              <strong>Response Times:</strong>
              <ul>
                <li>General inquiries: Within 48 hours</li>
                <li>Privacy rights requests: Within 30 days</li>
                <li>Urgent security matters: Within 24 hours</li>
                <li>Complex requests may require additional time with notification</li>
              </ul>
              <strong>What to Include in Your Request:</strong>
              <ul>
                <li>Clear description of your privacy concern or request</li>
                <li>Proof of identity for security purposes</li>
                <li>Specific information you're requesting or changes you want made</li>
                <li>Preferred method of response</li>
              </ul>
              <strong>Complaint Process:</strong>
              <ul>
                <li>If you're not satisfied with our response:</li>
                <li>Contact our Data Protection Officer</li>
                <li>Escalate to senior management</li>
                <li>File a complaint with relevant regulatory authorities</li>
                <li>Seek legal advice if necessary</li>
              </ul>
              <p>We are committed to resolving privacy concerns promptly and transparently.</p>
            </div>
          </div>
          <div className="contact-highlight">
            <h3><i className="fas fa-headset"></i> Questions About This Privacy Policy?</h3>
            <p>We're here to help! If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please don't hesitate to contact us:</p>
            <div className="contact-info-grid">
              <div className="legal-contact-item">
                <i className="fas fa-envelope"></i>
                <p><strong>General Inquiries</strong></p>
                <a href="mailto:info@privatecfo.com">info@privatecfo.com</a>
              </div>
              <div className="legal-contact-item">
                <i className="fas fa-user-shield"></i>
                <p><strong>Privacy Officer</strong></p>
                <a href="mailto:privacy@privatecfo.com">privacy@privatecfo.com</a>
              </div>
              <div className="legal-contact-item">
                <i className="fas fa-phone"></i>
                <p><strong>Phone Support</strong></p>
                <a href="tel:+91-7084646376">+91-7084646376</a>
              </div>
              <div className="legal-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <p><strong>Office Address</strong></p>
                <p style={{ marginBottom: 0 }}>B-80, SECTOR-65, NOIDA, UP-201301</p>
              </div>
            </div>
          </div>
          <div className="section">
            <h2>
              <span className="section-icon"><i className="fas fa-plus-circle"></i></span>
              Additional Information
            </h2>
            <p><strong>Compliance Standards:</strong> This Privacy Policy is designed to comply with applicable data protection laws including the Information Technology Act, 2000, and the Personal Data Protection Bill (when enacted) in India, as well as international standards where applicable.</p>
            <p><strong>Regular Reviews:</strong> We regularly review and update our privacy practices to ensure they remain current with evolving laws, technologies, and business practices.</p>
            <p><strong>Training and Awareness:</strong> Our team receives regular training on privacy and data protection principles to ensure your information is handled with the highest level of care and professionalism.</p>
            <p><strong>Transparency Report:</strong> We are committed to transparency and may publish periodic reports about our data practices, security measures, and any privacy-related incidents (anonymized and aggregated).</p>
            <div className="highlight-box">
              <p><strong>Your Trust Matters:</strong> At Private CFO CLUB, we understand that your financial information is among the most sensitive personal data you share. We take this responsibility seriously and are committed to maintaining the highest standards of privacy and security protection.</p>
            </div>
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
              <h4><i className="fas fa-user-shield"></i> Privacy Rights</h4>
              <p>Learn about your rights regarding your personal information and how to exercise them effectively.</p>
              <a href="#section-8" className="btn-legal">
                <i className="fas fa-arrow-right"></i> View Rights
              </a>
            </div>
            <div className="quick-link-card">
              <h4><i className="fas fa-lock"></i> Data Security</h4>
              <p>Understand the comprehensive measures we implement to protect your personal and financial information.</p>
              <a href="#section-6" className="btn-legal">
                <i className="fas fa-shield-alt"></i> Security Measures
              </a>
            </div>
            <div className="quick-link-card">
              <h4><i className="fas fa-comments"></i> Contact Us</h4>
              <p>Have questions about our privacy practices? Our dedicated team is here to help and address your concerns.</p>
              <a href="#section-14" className="btn-legal">
                <i className="fas fa-envelope"></i> Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
      <button
        className="scroll-to-top"
        id="scrollToTop"
        title="Back to top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>

        <Footer />

    </>
  );
}
