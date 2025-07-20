'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle case where auth context might not be ready
  if (!auth) {
    return (
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <span>CFO Admin</span>
          </div>
        </div>
        <div style={{ padding: '1rem', color: '#94a3b8' }}>Loading...</div>
        <style jsx>{`
          .admin-sidebar {
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
      router.push('/admin/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/admin', icon: 'fas fa-chart-bar', label: 'Dashboard' },
    { href: '/admin/users', icon: 'fas fa-users', label: 'Users' },
    { href: '/admin/consultations', icon: 'fas fa-calendar-alt', label: 'Consultations' },
    { href: '/admin/invoices', icon: 'fas fa-file-invoice', label: 'Invoices' },
    { href: '/admin/reports', icon: 'fas fa-chart-pie', label: 'Reports' },
  ];

  return (
    <>
      <style jsx>{`
        .admin-sidebar {
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
          overflow-y: auto;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(30, 41, 59, 0.3);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
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

        .nav-section {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-list {
          list-style: none;
          margin: 0;
        }

        .nav-item {
          margin: 0.35rem 1.5rem;
          padding: 10px 15px;
          background: rgba(30, 41, 59, 0.2);
          border-radius: 8px;
          cursor: pointer;
        }


        .nav-item:hover {
          background: rgba(14, 165, 233, 0.1);
          color: #0ea5e9;
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #0ea5e9;
          border-right: 3px solid #0ea5e9;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
        }

        .nav-icon {
          width: 20px;
          text-align: center;
          font-size: 1.125rem;
        }

        .nav-text {
          font-size: 0.875rem;
          font-weight: 500;
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

        .logout-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 260px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href="/admin" className="logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <span>CFO Admin</span>
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
                  <i className={`nav-icon ${item.icon}`}></i>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user?.first_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username || 'Admin User'}
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
    </>
  );
}
