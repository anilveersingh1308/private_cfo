'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  StatsCard 
} from '@/components/dashboard/DashboardComponents';

interface DashboardData {
  stats: {
    totalConsultations: number;
    upcomingSessions: number;
    completionRate: number;
    totalRevenue: number;
    monthlyRevenue: number;
    activeUsers: number;
    activeSubscribers: number;
  };
  consultationBreakdown: Array<{
    service: string;
    count: number;
    revenue: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    consultations: number;
  }>;
  recentConsultations: Array<{
    id: number;
    client_name: string;
    service_type: string;
    scheduled_date: string;
    status: string;
    amount: string;
    consultant: string;
  }>;
  consultantStats: Array<{
    name: string;
    totalConsultations: number;
    completedConsultations: number;
    totalRevenue: number;
    successRate: number;
  }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    client_name: '',
    client_email: '',
    phone: '',
    service_type: 'Financial Planning',
    scheduled_date: '',
    scheduled_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch dashboard statistics from API
      const response = await fetch('/api/dashboard/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      
      const apiData = result.data;
      
      // Transform API data to match interface
      const dashboardData: DashboardData = {
        stats: {
          totalConsultations: apiData.overview.totalConsultations,
          upcomingSessions: apiData.overview.upcomingSessions,
          completionRate: apiData.overview.completionRate,
          totalRevenue: apiData.overview.totalRevenue,
          monthlyRevenue: apiData.overview.monthlyRevenue,
          activeUsers: apiData.overview.activeUsers,
          activeSubscribers: apiData.overview.activeSubscribers
        },
        consultationBreakdown: apiData.consultationBreakdown || [],
        monthlyBreakdown: apiData.monthlyBreakdown || [],
        recentConsultations: apiData.recentConsultations || [],
        consultantStats: apiData.consultantStats || []
      };
      
      setDashboardData(dashboardData);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data. Please try again.');
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
    router.push('/dashboard/users/new');
  };

  const handleGenerateInvoice = () => {
    // Navigate to invoice generation page
    router.push('/dashboard/invoices/new');
  };

  const handleSendNewsletter = () => {
    setShowNewsletterModal(true);
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    router.push('/dashboard/reports');
  };

  const handleSystemSettings = () => {
    // Navigate to settings page
    router.push('/dashboard/settings');
  };

  const handleScheduleSubmit = async () => {
    try {
      if (!consultationForm.client_name || !consultationForm.client_email || !consultationForm.scheduled_date) {
        alert('Please fill in all required fields');
        return;
      }

      const scheduledDateTime = new Date(`${consultationForm.scheduled_date}T${consultationForm.scheduled_time || '10:00'}`);
      
      const consultationData = {
        client_name: consultationForm.client_name,
        client_email: consultationForm.client_email,
        service_type: consultationForm.service_type,
        scheduled_date: scheduledDateTime.toISOString(),
        duration: 60,
        amount: getServicePrice(consultationForm.service_type),
        consultant: 'Dr. Sharma', // Default consultant
        notes: consultationForm.notes
      };

      const response = await fetch('/api/dashboard/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      const result = await response.json();

      if (result.success) {
        setShowScheduleModal(false);
        setConsultationForm({
          client_name: '',
          client_email: '',
          phone: '',
          service_type: 'Financial Planning',
          scheduled_date: '',
          scheduled_time: '',
          notes: ''
        });
        // Refresh dashboard data
        await fetchDashboardData();
        alert('Consultation scheduled successfully!');
      } else {
        alert('Failed to schedule consultation: ' + result.error);
      }
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      alert('An error occurred while scheduling the consultation');
    }
  };

  const getServicePrice = (serviceType: string): string => {
    const prices: { [key: string]: string } = {
      'Financial Planning': '5000',
      'Tax Consulting': '3500',
      'Investment Advice': '7500',
      'Business Consulting': '10000',
      'Retirement Planning': '4500'
    };
    return prices[serviceType] || '5000';
  };

  const handleNewsletterSubmit = (formData: any) => {
    // Handle newsletter sending
    console.log('Sending newsletter:', formData);
    setShowNewsletterModal(false);
    // You can add actual newsletter API call here
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConsultationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'scheduled': return '#0ea5e9';
      case 'ongoing': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
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
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with Private CFO today."
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' }
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
            value: 12.5,
            isPositive: true
          }}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={dashboardData.stats.activeUsers.toLocaleString()}
          icon="fas fa-users"
          trend={{
            value: 8.3,
            isPositive: true
          }}
          color="green"
        />
        <StatsCard
          title="Newsletter Subscribers"
          value={dashboardData.stats.activeSubscribers.toLocaleString()}
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
            value: 15.7,
            isPositive: true
          }}
          color="orange"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={dashboardData.stats.upcomingSessions.toString()}
          icon="fas fa-video"
          trend={{
            value: 3,
            isPositive: true
          }}
          color="red"
        />
        <StatsCard
          title="Completion Rate"
          value={`${dashboardData.stats.completionRate}%`}
          icon="fas fa-chart-line"
          trend={{
            value: 2.1,
            isPositive: true
          }}
          color="indigo"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Consultations */}
        <Card className="activity-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-calendar-alt"></i>
              Recent Consultations
            </h3>
            <Button variant="ghost" size="sm" icon="fas fa-external-link-alt" onClick={() => router.push('/dashboard/consultations')}>
              View All
            </Button>
          </div>
          <div className="activity-list">
            {dashboardData.recentConsultations.map((consultation) => (
              <div key={consultation.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: getConsultationStatusColor(consultation.status) }}>
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{consultation.client_name}</div>
                  <div className="activity-description">{consultation.service_type}</div>
                  <div className="activity-meta">
                    <span className="activity-time">
                      {formatDateTime(consultation.scheduled_date)}
                    </span>
                    <span className="activity-amount">{formatCurrency(parseFloat(consultation.amount))}</span>
                  </div>
                </div>
                <div className="activity-status">
                  <Badge 
                    variant={consultation.status === 'completed' ? 'success' : 
                            consultation.status === 'scheduled' ? 'info' : 
                            consultation.status === 'cancelled' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {consultation.status}
                  </Badge>
                </div>
              </div>
            ))}
            {dashboardData.recentConsultations.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>No recent consultations</p>
              </div>
            )}
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
                  <input 
                    type="text" 
                    placeholder="Enter client name" 
                    value={consultationForm.client_name}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, client_name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="client@example.com" 
                    value={consultationForm.client_email}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, client_email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={consultationForm.phone}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select
                    value={consultationForm.service_type}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, service_type: e.target.value }))}
                  >
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Tax Consulting">Tax Consulting</option>
                    <option value="Investment Advice">Investment Advice</option>
                    <option value="Business Consulting">Business Consulting</option>
                    <option value="Retirement Planning">Retirement Planning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={consultationForm.scheduled_date}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    value={consultationForm.scheduled_time}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea 
                    rows={3} 
                    placeholder="Additional notes or requirements"
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, notes: e.target.value }))}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleScheduleSubmit}>
                Schedule Consultation
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
        .dashboard-page {
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem 1rem;
          color: #64748b;
          text-align: center;
        }

        .empty-state i {
          font-size: 2rem;
          color: #475569;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
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
          .dashboard-page {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .content-grid {
            gap: 1.5rem;
          }

          .activity-item {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 0.75rem 0;
          }

          .activity-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .activity-icon {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
          }

          .activity-title {
            font-size: 0.8rem;
          }

          .activity-description {
            font-size: 0.8rem;
          }

          .card-header {
            padding: 1rem 1rem 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .card-header h3 {
            font-size: 1rem;
          }

          .activity-list {
            padding: 1rem;
            max-height: 400px;
          }

          .quick-actions {
            padding: 1rem;
            gap: 0.75rem;
          }

          .period-select {
            min-width: 120px;
            font-size: 0.8rem;
            padding: 0.4rem 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-page {
            padding: 0.75rem;
          }

          .stats-grid {
            gap: 0.75rem;
          }

          .content-grid {
            gap: 1rem;
          }

          .activity-item {
            padding: 0.5rem 0;
          }

          .activity-icon {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .activity-title {
            font-size: 0.75rem;
            margin-bottom: 0.15rem;
          }

          .activity-description {
            font-size: 0.75rem;
            margin-bottom: 0.375rem;
          }

          .activity-time,
          .activity-amount {
            font-size: 0.65rem;
          }

          .card-header {
            padding: 0.75rem 0.75rem 0.5rem;
          }

          .card-header h3 {
            font-size: 0.875rem;
          }

          .activity-list {
            padding: 0.75rem;
            max-height: 350px;
          }

          .quick-actions {
            padding: 0.75rem;
            gap: 0.5rem;
          }

          .period-select {
            min-width: 100px;
            font-size: 0.75rem;
            padding: 0.375rem 0.5rem;
          }

          .empty-state {
            padding: 2rem 0.75rem;
          }

          .empty-state i {
            font-size: 1.5rem;
          }

          .empty-state p {
            font-size: 0.8rem;
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
            max-height: 85vh;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .modal-header h3 {
            font-size: 1.125rem;
          }

          .form-group label {
            font-size: 0.8rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.625rem;
            font-size: 0.8rem;
          }

          .modal-footer {
            flex-direction: column-reverse;
            gap: 0.5rem;
          }

          .modal-footer :global(.admin-btn) {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            width: 95%;
            margin: 0.5rem;
            max-height: 90vh;
            border-radius: 12px;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 0.75rem;
          }

          .modal-header h3 {
            font-size: 1rem;
          }

          .modal-close {
            padding: 0.375rem;
            font-size: 1.125rem;
          }

          .form-group label {
            font-size: 0.75rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.5rem;
            font-size: 0.75rem;
            border-radius: 6px;
          }
        }
      `}</style>
    </div>
  );
}
