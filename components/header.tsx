'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const Header = () => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const servicesRef = useRef<HTMLLIElement>(null);
    const pathname = usePathname();

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setIsServicesOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsServicesOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const toggleServices = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsServicesOpen(!isServicesOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenus = () => {
        setIsServicesOpen(false);
        setIsMobileMenuOpen(false);
    };

    const isActiveLink = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link href="/" className="logo" onClick={closeMenus}>
                    Private <span className="logo-gradient">CFO</span>
                </Link>
                <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li>
                            <Link 
                                href="/about" 
                                onClick={closeMenus}
                                className={isActiveLink('/about') ? 'active' : ''}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/why-us" 
                                onClick={closeMenus}
                                className={isActiveLink('/why-us') ? 'active' : ''}
                            >
                                Why us?
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/calculator-intro" 
                                onClick={closeMenus}
                                className={isActiveLink('/calculator-intro') ? 'active' : ''}
                            >
                                Calculator
                            </Link>
                        </li>
                        <li 
                            className={`has-submenu ${isServicesOpen ? 'active' : ''} ${isActiveLink('/services') ? 'current-page' : ''} ${isScrolled ? 'scrolled' : ''}`}
                            ref={servicesRef}
                        >
                            <a 
                                href="#" 
                                className={`dropdown-toggle ${isActiveLink('/services') ? 'active' : ''}`}
                                onClick={toggleServices}
                                aria-expanded={isServicesOpen}
                                aria-haspopup="true"
                            >
                                Services
                                <i className={`fas fa-chevron-down ${isServicesOpen ? 'rotated' : ''}`}></i>
                            </a>
                            <ul className="submenu" role="menu">
                                <li role="none">
                                    <Link 
                                        href="/services?type=individual" 
                                        onClick={closeMenus}
                                        role="menuitem"
                                    >
                                        Individual Services
                                    </Link>
                                </li>
                                <li role="none">
                                    <Link 
                                        href="/services?type=business" 
                                        onClick={closeMenus}
                                        role="menuitem"
                                    >
                                        Business Services
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <button 
                    className="menu-toggle" 
                    aria-label="Toggle menu"
                    onClick={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </header>
    );
};