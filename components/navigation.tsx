'use client';

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from "./ui/sheet";
import { useMedia } from "react-use"
import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";

type RouteItem = {
    href: string;
    label: string;
} | {
    label: string;
    links: {
        href: string;
        label: string;
    }[];
};

const routes: RouteItem[] = [
    {
        href: '/about-us', label: 'About',
    },
    {
        href: '/why-us', label: 'Why Us?',
    },
    {
        href: '/calculator-introduction', label: 'Calculator', 
    },
    {
        label: 'Services', links: [
            {
                href: '/individual', label: 'Individual'
            },
            {
                href: '/business', label: 'Business'
            }
        ],
    }
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [servicesOpen, setServicesOpen] = useState(false)
    const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter();

    const pathname = usePathname();
    const isMobile = useMedia('(max-width: 1024px)', false);
    
    // Handle scroll state for dropdown background
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Handle click outside for desktop dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDesktopServicesOpen(false)
            }
        }

        if (desktopServicesOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [desktopServicesOpen])

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setServicesOpen(false);
        setDesktopServicesOpen(false);
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-black/10 hover:bg-black/20 hover:text-current border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-current focus:bg-black/30 transition shadow-none"
                    >
                        <Menu className="h-4 w-4" />

                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-3 pt-10">
                        {routes.map((route) => {
                            if ('links' in route) {
                                // Handle Services dropdown
                                return (
                                    <div key={route.label} className="space-y-2">
                                        <Button 
                                            variant="ghost"
                                            onClick={() => setServicesOpen(!servicesOpen)}
                                            className="w-full justify-between shadow-none"
                                        >
                                            {route.label}
                                            <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                        {servicesOpen && (
                                            <div className="pl-4 space-y-2">
                                                {route.links.map((link) => (
                                                    <Button 
                                                        key={link.href}
                                                        variant={link.href === pathname ? "secondary" : "ghost"}
                                                        onClick={() => onClick(link.href)}
                                                        className="w-full justify-start text-sm shadow-none"
                                                    >
                                                        {link.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            } else {
                                // Handle regular navigation items
                                return (
                                    <Button 
                                        key={route.href}
                                        variant={route.href === pathname ? "secondary" : "ghost"}
                                        onClick={() => onClick(route.href)}
                                        className="w-full justify-start shadow-none"
                                    >
                                        {route.label}
                                    </Button>
                                );
                            }
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    };
    return (
        <nav className="hidden lg:flex items-center gap-x-7">
            {routes.map((route) => {
                if ('links' in route) {
                    // Handle Services dropdown
                    return (
                        <div key={route.label} className="relative group" ref={dropdownRef}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
                                className="font-normal bg-transparent hover:bg-current/20 hover:text-current border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-current focus:bg-current/30 transition shadow-none"
                            >
                                {route.label}
                                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${desktopServicesOpen ? 'rotate-180' : ''}`} />
                            </Button>
                            <div className={`absolute top-full left-0 mt-1 w-48 rounded-md border transition-all duration-200 z-50 ${
                                isScrolled 
                                    ? 'bg-gray-800 border-gray-600' 
                                    : 'bg-white border-gray-200'
                            } ${
                                desktopServicesOpen 
                                    ? 'opacity-100 visible' 
                                    : 'opacity-0 invisible'
                            }`}>
                                <div className="py-2">
                                    {route.links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => onClick(link.href)}
                                            className={`block w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${
                                                pathname === link.href 
                                                    ? isScrolled
                                                        ? 'bg-gray-700 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                    : isScrolled
                                                        ? 'text-gray-200 hover:bg-gray-700'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    // Handle regular navigation items
                    return (
                        <NavButton 
                            key={route.href}
                            href={route.href}
                            label={route.label}
                            isActive={pathname === route.href}
                        />
                    );
                }
            })}
        </nav>
    )
}