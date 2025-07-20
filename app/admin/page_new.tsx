'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface DashboardStats {
  totalConsultations: number;
  newsletterSubscribers: number;
  recentConsultations: number;
  activeCities: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    newsletterSubscribers: 0,
    recentConsultations: 0,
    activeCities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data - in real implementation, fetch from API
      setStats({
        totalConsultations: 17,
        newsletterSubscribers: 53,
        recentConsultations: 17,
        activeCities: 14
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style jsx global>{`
          body {
            background-color: #0d0e1b !important;
          }
        `}</style>
        <div style={{ 
          padding: '2rem', 
          color: '#FFFFFF', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #0076c6',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading dashboard...
          </div>
        </div>
      </>
    );
  }

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

      <style jsx>{`
        :root {
          --bg-dark-blue: #0A1121;
          --primary-blue: linear-gradient(90deg, rgba(70, 199, 255, 0.88) 10%, rgb(0, 98, 196) 90%);
          --text-white: #FFFFFF;
          --text-light-gray: #B0B5C1;
          --highlight-yellow: #FFD700;
          --card-bg: rgba(22, 33, 58, 0.5);
          --card-border: rgba(128, 128, 128, 0.2);
          --success-color: #28a745;
          --warning-color: #ffc107;
          --info-color: #17a2b8;
          --danger-color: #dc3545;
          --border-radius: 12px;
          --transition: all 0.3s ease;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem 0;
        }

        .dashboard-title h1 {
          color: var(--text-white);
          font-size: 2.5rem;
          margin: 0;
          font-weight: 700;
          background: linear-gradient(135deg, #fff, #b0b5c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-title p {
          color: var(--text-light-gray);
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--info-color), var(--success-color));
          opacity: 0;
          transition: var(--transition);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          transition: var(--transition);
        }

        .stat-icon.consultations { 
          background: linear-gradient(135deg, var(--info-color), #0d6efd);
        }

        .stat-icon.newsletters { 
          background: linear-gradient(135deg, var(--success-color), #198754);
        }

        .stat-icon.recent { 
          background: linear-gradient(135deg, var(--warning-color), #fd7e14);
        }

        .stat-icon.analytics { 
          background: linear-gradient(135deg, var(--danger-color), #dc3545);
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }

        .stat-number {
          color: var(--text-white);
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
          line-height: 1;
        }

        .stat-label {
          color: var(--text-light-gray);
          font-size: 1rem;
          margin: 0.5rem 0;
          font-weight: 500;
        }

        .stat-change {
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 15px;
          display: inline-block;
          color: var(--text-light-gray);
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .nav-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius);
          padding: 2rem;
          text-align: center;
          text-decoration: none;
          color: inherit;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .nav-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transition: left 0.5s;
        }

        .nav-card:hover::before {
          left: 100%;
        }

        .nav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 178, 255, 0.15);
          color: inherit;
          text-decoration: none;
          border-color: rgba(0, 178, 255, 0.3);
        }

        .nav-card-icon {
          width: 70px;
          height: 70px;
          border-radius: 15px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          transition: var(--transition);
        }

        .nav-card-icon.consultations {
          background: linear-gradient(135deg, var(--info-color), #0d6efd);
        }

        .nav-card-icon.newsletters {
          background: linear-gradient(135deg, var(--success-color), #198754);
        }

        .nav-card-icon.recent {
          background: linear-gradient(135deg, var(--warning-color), #fd7e14);
        }

        .nav-card:hover .nav-card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .nav-card h3 {
          color: var(--text-white);
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .nav-card p {
          color: var(--text-light-gray);
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .quick-actions {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .quick-actions h2 {
          color: var(--text-white);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          background: linear-gradient(135deg, #00458a 0%, #0076c6 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 69, 138, 0.3);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0, 69, 138, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
          box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .action-btn.secondary:hover {
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
        }

        .recent-activity {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--border-radius);
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .recent-activity h2 {
          color: var(--text-white);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 1rem;
          margin: 0 -1rem;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          flex-shrink: 0;
          transition: var(--transition);
        }

        .activity-item:hover .activity-icon {
          transform: scale(1.1);
        }

        .activity-content {
          flex: 1;
        }

        .activity-content h4 {
          color: var(--text-white);
          margin: 0 0 0.3rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .activity-content p {
          color: var(--text-light-gray);
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 1200px) {
          .dashboard-container {
            padding: 0 15px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            text-align: center;
          }

          .dashboard-title h1 {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nav-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 0 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-number {
            font-size: 2rem;
          }

          .quick-actions,
          .recent-activity {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening with your CFO services.</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon consultations">
                <i className="fas fa-handshake"></i>
              </div>
            </div>
            <h2 className="stat-number">{stats.totalConsultations}</h2>
            <p className="stat-label">Total Consultation Requests</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon newsletters">
                <i className="fas fa-envelope"></i>
              </div>
            </div>
            <h2 className="stat-number">{stats.newsletterSubscribers}</h2>
            <p className="stat-label">Newsletter Subscribers</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon recent">
                <i className="fas fa-clock"></i>
              </div>
            </div>
            <h2 className="stat-number">{stats.recentConsultations}</h2>
            <p className="stat-label">Recent Consultations</p>
            <p className="stat-change">Last 30 days</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon analytics">
                <i className="fas fa-map-marker-alt"></i>
              </div>
            </div>
            <h2 className="stat-number">{stats.activeCities}</h2>
            <p className="stat-label">Active Cities</p>
            <p className="stat-change">Geographic reach</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="nav-grid">
          <Link href="/admin/consultations" className="nav-card">
            <div className="nav-card-icon consultations">
              <i className="fas fa-handshake"></i>
            </div>
            <h3>Consultation Requests</h3>
            <p>View and manage all consultation requests from potential clients</p>
          </Link>

          <Link href="/admin/users" className="nav-card">
            <div className="nav-card-icon newsletters">
              <i className="fas fa-users"></i>
            </div>
            <h3>Newsletter Subscribers</h3>
            <p>Manage newsletter subscribers and email marketing campaigns</p>
          </Link>

          <Link href="/admin/reports" className="nav-card">
            <div className="nav-card-icon recent">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>Reports & Analytics</h3>
            <p>Track recent consultations and analyze business performance</p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link href="/admin/consultations" className="action-btn">
              <i className="fas fa-download"></i>
              Export Consultations
            </Link>
            <Link href="/admin/users" className="action-btn">
              <i className="fas fa-download"></i>
              Export Subscribers
            </Link>
            <Link href="/consultation" className="action-btn secondary">
              <i className="fas fa-external-link-alt"></i>
              View Live Site
            </Link>
            <button className="action-btn secondary" onClick={fetchDashboardStats}>
              <i className="fas fa-sync"></i>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Top Insights & Statistics</h2>
          
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #28a745, #198754)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="activity-content">
              <h4>Growing Demand</h4>
              <p>Consultation requests have increased by 23% this month, showing strong market interest in your CFO services.</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #17a2b8, #138496)' }}>
              <i className="fas fa-users"></i>
            </div>
            <div className="activity-content">
              <h4>Newsletter Growth</h4>
              <p>Your subscriber base has grown to 53 engaged professionals interested in financial insights and services.</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #ffc107, #fd7e14)' }}>
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="activity-content">
              <h4>Market Reach</h4>
              <p>Your services are now active in 14 cities across India, demonstrating excellent geographic expansion.</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)' }}>
              <i className="fas fa-target"></i>
            </div>
            <div className="activity-content">
              <h4>Client Satisfaction</h4>
              <p>Maintaining high client satisfaction with personalized CFO services and strategic financial guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
