'use client';

import { useState } from "react";
import Link from "next/link";

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [allUpdates, setAllUpdates] = useState(true);
    const [financialTips, setFinancialTips] = useState(false);
    const [marketUpdates, setMarketUpdates] = useState(false);
    const [taxPlanning, setTaxPlanning] = useState(false);
    const [investmentInsights, setInvestmentInsights] = useState(false);
    const [businessFinance, setBusinessFinance] = useState(false);

    const buildCategories = () => {
        const selected = [
            allUpdates && 'All Updates',
            financialTips && 'Financial Tips',
            marketUpdates && 'Market Updates',
            taxPlanning && 'Tax Planning',
            investmentInsights && 'Investment Insights',
            businessFinance && 'Business Finance',
        ].filter(Boolean) as string[];
        if (selected.length === 1 && allUpdates) {
            return [...selected, 'Financial Planning', 'Investment Advice', 'Tax Consulting'];
        }
        return selected.length > 0 ? selected : ['Financial Planning'];
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert('Please enter a valid email address');
            return;
        }
        const selectedCategories = buildCategories();

        try {
            const response = await fetch('/api/dashboard/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    categories: selectedCategories,
                    source: 'Website Footer'
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Thank you for subscribing to our newsletter! 🎉');
                setEmail('');
                setAllUpdates(true);
                setFinancialTips(false);
                setMarketUpdates(false);
                setTaxPlanning(false);
                setInvestmentInsights(false);
                setBusinessFinance(false);
            } else if (result.error?.includes('already exists')) {
                alert('You are already subscribed to our newsletter! 📧');
            } else {
                alert(result.error || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            alert('Failed to subscribe. Please check your internet connection and try again.');
        }
    };

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    {/* Newsletter Subscription */}
                    <div className="footer-section newsletter-section">
                        <h3>Stay Updated with Financial Insights</h3>
                        <p>Get expert tips, market updates, and exclusive financial guidance delivered to your inbox.</p>
                        <form className="newsletter-form" id="newsletter-form" onSubmit={handleSubscribe}>
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                                <button type="submit" className="subscribe-btn">
                                    <i className="fas fa-paper-plane"></i>{' '}
                                    SUBSCRIBE NOW
                                </button>
                            </div>
                            <div className="newsletter-categories">
                                {/* Custom styled checkboxes */}
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="all" 
                                        checked={allUpdates}
                                        onChange={(e) => setAllUpdates(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    All Updates
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="financial-tips" 
                                        checked={financialTips}
                                        onChange={(e) => setFinancialTips(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    Financial Tips
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="market-updates" 
                                        checked={marketUpdates}
                                        onChange={(e) => setMarketUpdates(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    Market Updates
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="tax-planning" 
                                        checked={taxPlanning}
                                        onChange={(e) => setTaxPlanning(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    Tax Planning
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="investment-insights" 
                                        checked={investmentInsights}
                                        onChange={(e) => setInvestmentInsights(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    Investment Insights
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="categories" 
                                        value="business-finance" 
                                        checked={businessFinance}
                                        onChange={(e) => setBusinessFinance(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>{' '}
                                    Business Finance
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Company Information */}
                    <div className="footer-section company-section">
                        <h3>Private CFO CLUB</h3>
                        <div className="company-info">
                            <div className="tagline">SMART MONEY MANAGEMENT</div>
                            <div className="parent-company">(Unit of GIGAFACTRY INNOVATIONS PVT. LTD.)</div>
                        </div>
                        <div className="address">
                            <p><i className="fas fa-map-marker-alt"></i> <strong>Our Address</strong></p>
                            <p>B-80, SECTOR-65, NOIDA</p>
                            <p>UP-201301</p>
                            <p><i className="fas fa-phone"></i> +91-7905095515</p>
                            <p><i className="fas fa-envelope"></i> info@privatecfo.club</p>
                        </div>
                        <div className="social-media" style={{ display: 'none' }}>
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="footer-section map-section">
                        <h3>Find Us</h3>
                        <div className="map-container" style={{ position: 'relative' }}>
                            <iframe
                                title="Office Location Map - Gigafactry, Noida"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.573819152459!2d77.38456277422206!3d28.61255948498965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef2c8ab83231%3A0x5703cfb8b6d8d20a!2sGigafactry!5e0!3m2!1sen!2sin!4v1776379152057!5m2!1sen!2sin"
                                width="100%"
                                height="250"
                                style={{ border: 0, display: 'block' }}
                                className="map-iframe"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allow="fullscreen"
                            ></iframe>
                            <a
                                href="https://www.google.com/maps/place/Gigafactry/@28.6125595,77.3845628,17z"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Gigafactry location in Google Maps"
                                style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    background: 'rgba(0,0,0,0.7)',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    textDecoration: 'none',
                                    zIndex: 2,
                                }}
                            >
                                Open in Google Maps ↗
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-links">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                        <Link href="/consultation">Contact Us</Link>
                    </div>
                    <div className="footer-copyright">
                        <p>© 2025 | Private CFO | All rights reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
