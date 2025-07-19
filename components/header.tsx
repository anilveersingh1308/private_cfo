'use client';

import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "./welcome-msg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export const Header = ()=> {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 lg:px-14 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-lg' 
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between">
                    <div className={`flex items-center transition-colors duration-300 ${
                        isScrolled ? 'text-white' : 'text-gray-900'
                    }`}>
                        <HeaderLogo />
                    </div>
                    <div className={`flex items-center transition-colors duration-300 ${
                        isScrolled ? 'text-white' : 'text-gray-900'
                    }`}>
                        <Navigation />
                    </div>
                </div>
            </div>
        </header>
    );
};