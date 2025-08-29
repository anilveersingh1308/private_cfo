'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ResponsiveDashboardSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle case where auth context might not be ready
  if (!auth) {
    return (
      <aside className={`dashboard-sidebar ${isMobile ? 'mobile-sidebar' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <span>CFO Dashboard</span>
          </div>
        </div>
        <div style={{ padding: '1rem', color: '#94a3b8' }}>Loading...</div>
        <style jsx>{`
          .dashboard-sidebar {
            width: 280px;
            height: 100vh;
            background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
            border-right: 1px solid rgba(30, 41, 59, 0.3);
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
          }
          .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(30, 41, 59, 0.3);
          }
          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
        `}</style>
      </aside>
    );
  }

  const { user, logout } = auth;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/dashboard/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: '/dashboard', icon: 'fas fa-chart-bar', label: 'Dashboard' },
    { href: '/dashboard/users', icon: 'fas fa-users', label: 'Users' },
    { href: '/dashboard/consultations', icon: 'fas fa-calendar-alt', label: 'Consultations' },
    { href: '/dashboard/invoices', icon: 'fas fa-file-invoice', label: 'Invoices' },
    { href: '/dashboard/payments', icon: 'fas fa-credit-card', label: 'Payments' },
    { href: '/dashboard/newsletter', icon: 'fas fa-envelope', label: 'Newsletter' },
    { href: '/dashboard/reports', icon: 'fas fa-chart-pie', label: 'Reports' },
    { href: '/dashboard/settings', icon: 'fas fa-cog', label: 'Settings' },
    { href: '/dashboard/profile', icon: 'fas fa-user-circle', label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay show" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        {isMobile && (
          <button 
            className="mobile-close-btn" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        )}

        <div className="sidebar-header">
          <Link href="/dashboard" className="logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <span>Private CFO Dashboard</span>
          </Link>
        </div>

        <nav className="nav-section">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link 
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <i className={`nav-icon ${item.icon}`} style={{marginRight: '0.5rem'}}></i>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">
                {user?.name || 'Dashboard User'}
              </p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .dashboard-sidebar {
          width: 280px;
          height: 100vh;
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
          border-right: 1px solid rgba(30, 41, 59, 0.3);
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-section {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .nav-section::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .nav-section::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.12);
          border-radius: 8px;
        }
        .nav-section::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          border-radius: 8px;
          min-height: 32px;
          box-shadow: 0 2px 8px rgba(14,165,233,0.10);
          border: 2px solid rgba(30,41,59,0.18);
        }
        .nav-section::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
          border: 2px solid #0ea5e9;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(30, 41, 59, 0.3);
          background: rgba(15, 23, 42, 0.8);
        }
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }
        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin: 10px;
          padding: 1rem;
          position: relative;
          border-radius: 12px;
          box-shadow: 0 1px 6px rgba(14,165,233,0.07);
          border: 1.5px solid transparent;
          background: rgba(30,41,59,0.18);
          transition: box-shadow 0.22s, background 0.22s, border 0.22s, transform 0.18s;
          will-change: transform, box-shadow;
        }
        .nav-item:hover, .nav-item:focus-within {
          box-shadow: 0 4px 18px rgba(14,165,233,0.13);
          border: 1.5px solid #0ea5e9;
          background: linear-gradient(90deg, rgba(14,165,233,0.09) 0%, rgba(59,130,246,0.08) 100%);
        }
        .nav-link {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          padding: 12px 18px;
          border-radius: 10px;
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
          position: relative;
        }
        .nav-link:hover {
          background: rgba(14, 165, 233, 0.1);
          color: #0ea5e9;
          transform: translateX(4px);
        }
        .nav-link.active {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #0ea5e9;
          border-left: 3px solid #0ea5e9;
        }
        .nav-icon {
          width: 20px;
          text-align: center;
          font-size: 1.125rem;
          flex-shrink: 0;
        }
        .user-section {
          padding: 1.5rem;
          border-top: 1px solid rgba(30, 41, 59, 0.3);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.125rem;
          border: 2px solid rgba(14, 165, 233, 0.3);
          flex-shrink: 0;
        }
        .user-details {
          flex: 1;
          min-width: 0;
        }
        .user-name {
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
          margin: 0 0 0.25rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role {
          color: #94a3b8;
          font-size: 0.75rem;
          margin: 0;
        }
        .logout-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        .logout-btn:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
        }
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(14, 165, 233, 0.15);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #0ea5e9;
          font-size: 1.25rem;
          cursor: pointer;
          z-index: 110;
          transition: all 0.2s ease;
        }
        .mobile-menu-btn:hover {
          background: rgba(14, 165, 233, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
        }
        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        }
        .mobile-overlay.show {
          display: block;
        }
        .mobile-close-btn {
          display: none;
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
          color: #ef4444;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 110;
        }
        .mobile-close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 100vw;
            transform: translateX(-100%);
          }
          .dashboard-sidebar.mobile-open {
            transform: translateX(0);
          }
          .sidebar-header {
            position: relative;
            padding: 2rem 1.5rem 1.5rem;
          }
          .nav-item {
            margin: 0.25rem 1rem;
          }
          .nav-icon {
            font-size: 1.25rem;
          }
          .user-section {
            padding: 1rem;
          }
          .user-info {
            padding: 1rem;
          }
          .user-avatar {
            width: 48px;
            height: 48px;
            font-size: 1.25rem;
          }
          .user-name {
            font-size: 1rem;
          }
          .user-role {
            font-size: 0.875rem;
          }
          .logout-btn {
            padding: 1rem;
            font-size: 1rem;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-close-btn {
            display: block;
          }
        }
        @media (max-width: 480px) {
          .mobile-menu-btn {
            top: 0.75rem;
            left: 0.75rem;
            padding: 0.625rem;
            font-size: 1rem;
          }
          .sidebar-header {
            padding: 1.5rem 1rem 1rem;
          }
          .logo {
            font-size: 1.25rem;
          }
          .logo-icon {
            width: 28px;
            height: 28px;
            font-size: 0.875rem;
          }
          .nav-item {
            margin: 0.25rem 0.75rem;
          }
          .user-section {
            padding: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
