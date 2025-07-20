'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  StatsCard 
} from '@/components/admin/AdminComponents';

interface DashboardData {
  stats: {
    totalConsultations: number;
    activeUsers: number;
    newsletterSubscribers: number;
    monthlyRevenue: number;
    activeSessions: number;
    citiesServed: number;
  };
  recentActivity: Array<{
    id: number;
    type: 'consultation' | 'user' | 'payment' | 'subscription';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'pending' | 'warning' | 'error';
    amount?: number;
  }>;
  trends: {
    consultations: { value: number; trend: 'up' | 'down' | 'neutral' };
    users: { value: number; trend: 'up' | 'down' | 'neutral' };
    revenue: { value: number; trend: 'up' | 'down' | 'neutral' };
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call with realistic business data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData: DashboardData = {
        stats: {
          totalConsultations: 1247,
          activeUsers: 8432,
          newsletterSubscribers: 12589,
          monthlyRevenue: 2850000,
          activeSessions: 23,
          citiesServed: 45
        },
        recentActivity: [
          {
            id: 1,
            type: 'consultation',
            title: 'New Consultation Scheduled',
            description: 'Financial Planning session with Rajesh Kumar',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            description: 'Tax Consulting service payment',
            timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
            status: 'success',
            amount: 5000
          },
          {
            id: 3,
            type: 'user',
            title: 'New User Registration',
            description: 'Priya Sharma joined the platform',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 4,
            type: 'subscription',
            title: 'Newsletter Subscription',
            description: 'Investment Advice newsletter signup',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 5,
            type: 'consultation',
            title: 'Session Completed',
            description: 'Retirement Planning with Amit Verma',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 6,
            type: 'payment',
            title: 'Payment Pending',
            description: 'Business Consulting service',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            status: 'warning',
            amount: 12000
          }
        ],
        trends: {
          consultations: { value: 12.5, trend: 'up' },
          users: { value: 8.3, trend: 'up' },
          revenue: { value: 15.7, trend: 'up' }
        }
      };
      
      setDashboardData(mockData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Quick Action Handlers
  const handleScheduleConsultation = () => {
    setShowScheduleModal(true);
  };

  const handleAddUser = () => {
    setShowUserModal(true);
  };

  const handleGenerateInvoice = () => {
    // Navigate to invoice generation page
    router.push('/admin/invoices/new');
  };

  const handleSendNewsletter = () => {
    setShowNewsletterModal(true);
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    router.push('/admin/reports');
  };

  const handleSystemSettings = () => {
    // Navigate to settings page
    router.push('/admin/settings');
  };

  const handleScheduleSubmit = (formData: any) => {
    // Handle consultation scheduling
    console.log('Scheduling consultation:', formData);
    setShowScheduleModal(false);
    // You can add actual API call here
  };

  const handleUserSubmit = (formData: any) => {
    // Handle user creation
    console.log('Creating user:', formData);
    setShowUserModal(false);
    // You can add actual API call here
  };

  const handleNewsletterSubmit = (formData: any) => {
    // Handle newsletter sending
    console.log('Sending newsletter:', formData);
    setShowNewsletterModal(false);
    // You can add actual API call here
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return 'fas fa-calendar-check';
      case 'user': return 'fas fa-user-plus';
      case 'payment': return 'fas fa-rupee-sign';
      case 'subscription': return 'fas fa-envelope';
      default: return 'fas fa-bell';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading dashboard...</span>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
          }
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            color: #94a3b8;
            font-size: 1rem;
          }
          .loading-spinner i {
            font-size: 2rem;
            color: #0ea5e9;
          }
        `}</style>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <Card>
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Unable to Load Dashboard</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={fetchDashboardData}>
            <i className="fas fa-refresh"></i>
            Try Again
          </Button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
            text-align: center;
          }
          .error-container i {
            font-size: 3rem;
            color: #ef4444;
          }
          .error-container h3 {
            margin: 0;
            color: #f8fafc;
            font-size: 1.5rem;
          }
          .error-container p {
            margin: 0;
            color: #94a3b8;
          }
        `}</style>
      </Card>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="admin-dashboard">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with Private CFO today."
        breadcrumb={[
          { label: 'Admin', href: '/admin' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="period-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button 
              variant="secondary" 
              size="sm" 
              icon={refreshing ? "fas fa-spinner fa-spin" : "fas fa-sync-alt"}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="primary" size="sm" icon="fas fa-download">
              Export Report
            </Button>
          </div>
        }
      />

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Consultations"
          value={dashboardData.stats.totalConsultations.toLocaleString()}
          icon="fas fa-calendar-check"
          trend={{
            value: dashboardData.trends.consultations.value,
            isPositive: dashboardData.trends.consultations.trend === 'up'
          }}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={dashboardData.stats.activeUsers.toLocaleString()}
          icon="fas fa-users"
          trend={{
            value: dashboardData.trends.users.value,
            isPositive: dashboardData.trends.users.trend === 'up'
          }}
          color="green"
        />
        <StatsCard
          title="Newsletter Subscribers"
          value={dashboardData.stats.newsletterSubscribers.toLocaleString()}
          icon="fas fa-envelope"
          trend={{
            value: 6.2,
            isPositive: true
          }}
          color="purple"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardData.stats.monthlyRevenue)}
          icon="fas fa-rupee-sign"
          trend={{
            value: dashboardData.trends.revenue.value,
            isPositive: dashboardData.trends.revenue.trend === 'up'
          }}
          color="orange"
        />
        <StatsCard
          title="Active Sessions"
          value={dashboardData.stats.activeSessions.toString()}
          icon="fas fa-video"
          color="red"
        />
        <StatsCard
          title="Cities Served"
          value={dashboardData.stats.citiesServed.toString()}
          icon="fas fa-map-marker-alt"
          trend={{
            value: 2,
            isPositive: true
          }}
          color="indigo"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <Card className="activity-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-clock"></i>
              Recent Activity
            </h3>
            <Button variant="ghost" size="sm" icon="fas fa-external-link-alt">
              View All
            </Button>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: getStatusColor(activity.status) }}>
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-meta">
                    <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                    {activity.amount && (
                      <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                    )}
                  </div>
                </div>
                <div className="activity-status">
                  <Badge 
                    variant={activity.status === 'success' ? 'success' : 
                            activity.status === 'warning' ? 'warning' : 
                            activity.status === 'error' ? 'danger' : 'neutral'}
                    size="sm"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="quick-actions-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
          </div>
          <div className="quick-actions">
            <Button 
              variant="primary" 
              size="md" 
              icon="fas fa-calendar-plus"
              onClick={handleScheduleConsultation}
            >
              Schedule Consultation
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon="fas fa-user-plus"
              onClick={handleAddUser}
            >
              Add New User
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon="fas fa-file-invoice-dollar"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon="fas fa-envelope"
              onClick={handleSendNewsletter}
            >
              Send Newsletter
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon="fas fa-chart-bar"
              onClick={handleViewAnalytics}
            >
              View Analytics
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon="fas fa-cog"
              onClick={handleSystemSettings}
            >
              System Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Schedule Consultation Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Consultation</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" placeholder="Enter client name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="client@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select>
                    <option>Financial Planning</option>
                    <option>Tax Consulting</option>
                    <option>Investment Advice</option>
                    <option>Business Consulting</option>
                    <option>Retirement Planning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea rows={3} placeholder="Additional notes or requirements"></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleScheduleSubmit({})}>
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="First name" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="user@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select>
                    <option>Client</option>
                    <option>Admin</option>
                    <option>Consultant</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="City" />
                </div>
                <div className="form-group full-width">
                  <label>Password</label>
                  <input type="password" placeholder="Temporary password" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleUserSubmit({})}>
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="modal-overlay" onClick={() => setShowNewsletterModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Newsletter</h3>
              <button className="modal-close" onClick={() => setShowNewsletterModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Subject</label>
                  <input type="text" placeholder="Newsletter subject" />
                </div>
                <div className="form-group">
                  <label>Recipient Group</label>
                  <select>
                    <option>All Subscribers</option>
                    <option>Active Clients</option>
                    <option>Potential Clients</option>
                    <option>Premium Members</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Template</label>
                  <select>
                    <option>Investment Tips</option>
                    <option>Market Update</option>
                    <option>Tax Planning</option>
                    <option>Custom Template</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Content</label>
                  <textarea rows={8} placeholder="Newsletter content..."></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowNewsletterModal(false)}>
                Cancel
              </Button>
              <Button variant="ghost" size="sm">
                Save Draft
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleNewsletterSubmit({})}>
                Send Newsletter
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .period-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #f8fafc;
          font-size: 0.875rem;
          min-width: 140px;
        }

        .period-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .card-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-header h3 i {
          color: #0ea5e9;
        }

        .activity-list {
          padding: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .activity-description {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-time {
          color: #64748b;
          font-size: 0.75rem;
        }

        .activity-amount {
          color: #22c55e;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .activity-status {
          flex-shrink: 0;
        }

        .quick-actions {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quick-actions :global(.admin-btn) {
          width: 100%;
        }

        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .activity-item {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .activity-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .modal-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          color: #e2e8f0;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #64748b;
        }

        .form-group select option {
          background: #1e293b;
          color: #f8fafc;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
