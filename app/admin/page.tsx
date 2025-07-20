'use client';

import { useState, useEffect } from 'react';
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

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
            <Button variant="primary" size="md" icon="fas fa-calendar-plus">
              Schedule Consultation
            </Button>
            <Button variant="secondary" size="md" icon="fas fa-user-plus">
              Add New User
            </Button>
            <Button variant="secondary" size="md" icon="fas fa-file-invoice-dollar">
              Generate Invoice
            </Button>
            <Button variant="secondary" size="md" icon="fas fa-envelope">
              Send Newsletter
            </Button>
            <Button variant="secondary" size="md" icon="fas fa-chart-bar">
              View Analytics
            </Button>
            <Button variant="secondary" size="md" icon="fas fa-cog">
              System Settings
            </Button>
          </div>
        </Card>
      </div>

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
      `}</style>
    </div>
  );
}
