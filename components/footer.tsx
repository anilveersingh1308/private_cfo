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

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            alert('Please enter a valid email address');
            return;
        }

        // Prepare categories array
        const selectedCategories = [];
        if (allUpdates) selectedCategories.push('All Updates');
        if (financialTips) selectedCategories.push('Financial Tips');
        if (marketUpdates) selectedCategories.push('Market Updates');
        if (taxPlanning) selectedCategories.push('Tax Planning');
        if (investmentInsights) selectedCategories.push('Investment Insights');
        if (businessFinance) selectedCategories.push('Business Finance');

        // If no specific categories selected but allUpdates is checked, add default categories
        if (selectedCategories.length === 1 && allUpdates) {
            selectedCategories.push('Financial Planning', 'Investment Advice', 'Tax Consulting');
        } else if (selectedCategories.length === 0) {
            selectedCategories.push('Financial Planning'); // Default category
        }

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
            } else {
                if (result.error && result.error.includes('already exists')) {
                    alert('You are already subscribed to our newsletter! 📧');
                } else {
                    alert(result.error || 'Failed to subscribe. Please try again.');
                }
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
                                    <i className="fas fa-paper-plane"></i>
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
                                    <span className="checkmark"></span>
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
                                    <span className="checkmark"></span>
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
                                    <span className="checkmark"></span>
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
                                    <span className="checkmark"></span>
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
                                    <span className="checkmark"></span>
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
                                    <span className="checkmark"></span>
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
                            <div className="parent-company">(Unit of GIGAFACTORY INNOVATIONS PVT. LTD.)</div>
                        </div>
                        <div className="address">
                            <p><i className="fas fa-map-marker-alt"></i> <strong>Our Address</strong></p>
                            <p>B-80, SECTOR-65, NOIDA</p>
                            <p>UP-201301</p>
                            <p><i className="fas fa-phone"></i> +91-7084646376</p>
                            <p><i className="fas fa-envelope"></i> info@privatecfo.com</p>
                        </div>
                        <div className="social-media">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="footer-section map-section">
                        <h3>Find Us</h3>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.4457!2d77.3647!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9d%3A0x61d5e7e6d83b8b8!2sSector%2065%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                width="100%"
                                height="250"
                                style={{ border: 0, borderRadius: '8px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-links">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                        <Link href="/contact-us">Contact Us</Link>
                    </div>
                    <div className="footer-copyright">
                        <p>© 2025 | Private CFO | All rights reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
