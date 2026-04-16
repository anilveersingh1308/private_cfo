'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import ResponsiveDashboardSidebar from '@/components/dashboard/ResponsiveDashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/dashboard/sign-in');
      return;
    }
    
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/sign-in');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <>
        <style jsx global>{`
          body {
            background-color: #0d0e1b !important;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMGQwZTFiIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxNDE1MjQiPjwvcmVjdD4KPC9zdmc+') !important;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#0d0e1b'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #0076c6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      {/* FontAwesome CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />
      
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
          color: #f8fafc !important;
          margin: 0;
          padding: 0;
          font-family: var(--font-poppins), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
        }

        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      <style jsx>{`
        .main-content {
          margin-left: ${isMobile ? '0' : '280px'};
          min-height: 100vh;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          background: transparent;
          position: relative;
        }

        .main-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(1px);
          pointer-events: none;
          z-index: -1;
        }

        /* Mobile Content Padding */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding-top: 4rem; /* Space for mobile menu button */
          }
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .main-content {
            margin-left: 240px;
          }
        }
      `}</style>

      {/* Responsive Dashboard Sidebar */}
      <ResponsiveDashboardSidebar />

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
