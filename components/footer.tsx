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

    const handleSubscribe = () => {
        // Handle newsletter subscription
        console.log('Subscribe with:', { email, allUpdates, financialTips, marketUpdates, taxPlanning, investmentInsights, businessFinance });
    };

    return (
        <footer className="bg-slate-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Newsletter Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Stay Updated with Financial Insights</h3>
                        <p className="text-gray-300 mb-6">
                            Get expert tips, market updates, and exclusive financial guidance delivered to your inbox.
                        </p>
                        
                        {/* Email Input */}
                        <div className="flex mb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-l-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-r-lg font-semibold transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                SUBSCRIBE NOW
                            </button>
                        </div>

                        {/* Checkboxes */}
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allUpdates}
                                    onChange={(e) => setAllUpdates(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">All Updates</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={financialTips}
                                    onChange={(e) => setFinancialTips(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Financial Tips</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={marketUpdates}
                                    onChange={(e) => setMarketUpdates(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Market Updates</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={taxPlanning}
                                    onChange={(e) => setTaxPlanning(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Tax Planning</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={investmentInsights}
                                    onChange={(e) => setInvestmentInsights(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Investment Insights</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={businessFinance}
                                    onChange={(e) => setBusinessFinance(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">Business Finance</span>
                            </label>
                        </div>
                    </div>

                    {/* Company Info Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Private CFO CLUB</h3>
                        <div className="mb-6">
                            <p className="text-blue-400 font-semibold mb-2">SMART MONEY MANAGEMENT</p>
                            <p className="text-gray-400 italic">(Unit of GIGAFACTORY INNOVATIONS)</p>
                        </div>

                        {/* Address */}
                        <div className="mb-6">
                            <div className="flex items-start space-x-3 mb-4">
                                <svg className="w-5 h-5 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Our Address</h4>
                                    <p className="text-gray-300">B-80, SECTOR-65, NOIDA</p>
                                    <p className="text-gray-300">UP-201301</p>
                                </div>
                            </div>

            <div className="flex items-center space-x-3 mb-4">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-gray-300">+91-XXXXXXXXXX</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-6">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.31a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-300">info@privatecfo.com</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="font-semibold text-white mb-3">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.099.118.112.22.085.339-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.593 2.25-.738 2.805-.267 1.040-1.03 2.35-1.546 3.161 1.158.359 2.385.551 3.65.551 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.56.75C17.72.75 20.25 3.28 20.25 8.44v7.12c0 5.16-2.53 7.69-7.69 7.69H4.44C3.28 23.25.75 20.72.75 15.56V8.44C.75 3.28 3.28.75 8.44.75h4.12zm0 1.5H8.44C4.11 2.25 2.25 4.11 2.25 8.44v7.12c0 4.33 1.86 6.19 6.19 6.19h4.12c4.33 0 6.19-1.86 6.19-6.19V8.44c0-4.33-1.86-6.19-6.19-6.19zM12 6.75a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm6.187-2.25a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Find Us</h3>
                        <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for map - you can replace this with actual Google Maps embed */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 text-sm font-medium">SECTOR 65</p>
                                        <p className="text-gray-600 text-xs">Noida, UP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-600 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-200">
                                Terms of Service
                            </Link>
                            <Link href="/contact-us" className="text-gray-300 hover:text-white transition-colors duration-200">
                                Contact Us
                            </Link>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2025 | Private CFO | All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
