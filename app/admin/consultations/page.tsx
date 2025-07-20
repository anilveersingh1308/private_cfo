'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  Table,
  StatsCard 
} from '@/components/admin/AdminComponents';

interface Consultation {
  id: number;
  client_name: string;
  client_email: string;
  service_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'ongoing';
  scheduled_date: string;
  duration: number;
  notes?: string;
  amount: number;
  payment_status: 'paid' | 'pending' | 'failed';
  created_at: string;
  consultant?: string;
  meeting_link?: string;
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      // Enhanced mock data for consultations
      setConsultations([
        {
          id: 1,
          client_name: 'Rajesh Kumar',
          client_email: 'rajesh.kumar@email.com',
          service_type: 'Financial Planning',
          status: 'scheduled',
          scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          amount: 5000,
          payment_status: 'paid',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          consultant: 'Dr. Sharma',
          meeting_link: 'https://meet.google.com/abc-defg-hij'
        },
        {
          id: 2,
          client_name: 'Priya Patel',
          client_email: 'priya.patel@email.com',
          service_type: 'Tax Consulting',
          status: 'completed',
          scheduled_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          amount: 3500,
          payment_status: 'paid',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          consultant: 'CA Verma',
          notes: 'Discussed tax optimization strategies for FY 2024-25'
        },
        {
          id: 3,
          client_name: 'Amit Singh',
          client_email: 'amit.singh@email.com',
          service_type: 'Investment Advice',
          status: 'ongoing',
          scheduled_date: new Date().toISOString(),
          duration: 90,
          amount: 7500,
          payment_status: 'paid',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          consultant: 'Mr. Gupta',
          meeting_link: 'https://zoom.us/j/123456789'
        },
        {
          id: 4,
          client_name: 'Sneha Reddy',
          client_email: 'sneha.reddy@email.com',
          service_type: 'Retirement Planning',
          status: 'pending',
          scheduled_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          amount: 4500,
          payment_status: 'pending',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          consultant: 'Dr. Sharma'
        },
        {
          id: 5,
          client_name: 'Vikram Joshi',
          client_email: 'vikram.joshi@email.com',
          service_type: 'Business Consulting',
          status: 'cancelled',
          scheduled_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 120,
          amount: 10000,
          payment_status: 'failed',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          consultant: 'Mr. Agarwal',
          notes: 'Client requested cancellation due to scheduling conflict'
        }
      ]);
    } catch (err) {
      setError('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge variant="info" size="sm">Scheduled</Badge>;
      case 'completed': return <Badge variant="success" size="sm">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger" size="sm">Cancelled</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'ongoing': return <Badge variant="info" size="sm">Ongoing</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success" size="sm">Paid</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'failed': return <Badge variant="danger" size="sm">Failed</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getUpcomingConsultations = () => {
    const now = new Date();
    return consultations.filter(c => new Date(c.scheduled_date) > now && c.status === 'scheduled').length;
  };

  const getTotalRevenue = () => {
    return consultations
      .filter(c => c.payment_status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const getCompletionRate = () => {
    const completed = consultations.filter(c => c.status === 'completed').length;
    const total = consultations.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Filter logic
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.service_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus;
    const matchesService = filterService === 'all' || consultation.service_type === filterService;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const consultationDate = new Date(consultation.scheduled_date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = consultationDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = consultationDate >= now && consultationDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesDate = consultationDate >= now && consultationDate <= monthFromNow;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const consultationColumns = [
    {
      key: 'client_name',
      title: 'Client',
      render: (value: string, row: Consultation) => (
        <div>
          <div style={{ fontWeight: '600', color: '#f8fafc' }}>{value}</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{row.client_email}</div>
        </div>
      ),
      width: '200px'
    },
    {
      key: 'service_type',
      title: 'Service',
      render: (value: string) => (
        <Badge variant="info" size="sm">{value}</Badge>
      ),
      width: '150px'
    },
    {
      key: 'consultant',
      title: 'Consultant',
      render: (value: string) => (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{value || 'Not assigned'}</span>
      ),
      width: '120px'
    },
    {
      key: 'scheduled_date',
      title: 'Date & Time',
      render: (value: string) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{formatDate(value)}</span>
      ),
      width: '140px'
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (value: number) => (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{value} min</span>
      ),
      width: '80px'
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>
          {formatCurrency(value)}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '100px'
    },
    {
      key: 'payment_status',
      title: 'Payment',
      render: (value: string) => getPaymentBadge(value),
      width: '100px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: Consultation) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => console.log('View consultation', row.id)}
          >
            View
          </Button>
          {row.meeting_link && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-video"
              onClick={() => window.open(row.meeting_link, '_blank')}
            >
              Join
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-edit"
            onClick={() => console.log('Edit consultation', row.id)}
          >
            Edit
          </Button>
        </div>
      ),
      width: '180px'
    }
  ];

  const serviceTypes = [...new Set(consultations.map(c => c.service_type))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading consultations...</span>
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

  if (error) {
    return (
      <Card>
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <Button variant="primary" size="sm" onClick={fetchConsultations}>
            Retry
          </Button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
            color: #ef4444;
            text-align: center;
          }
          .error-container i {
            font-size: 3rem;
          }
        `}</style>
      </Card>
    );
  }

  return (
    <div className="admin-consultations">
      <PageHeader
        title="Consultation Management"
        subtitle="Track and manage all consultation sessions"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Consultations' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" size="sm" icon="fas fa-calendar-plus">
              Schedule New
            </Button>
            <Button variant="primary" size="sm" icon="fas fa-download">
              Export Data
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Consultations"
          value={consultations.length.toString()}
          icon="fas fa-calendar-check"
          trend="up"
          trendValue="12%"
          trendText="vs last month"
          color="blue"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={getUpcomingConsultations().toString()}
          icon="fas fa-clock"
          trend="neutral"
          trendText="Next 7 days"
          color="orange"
        />
        <StatsCard
          title="Completion Rate"
          value={`${getCompletionRate()}%`}
          icon="fas fa-chart-line"
          trend="up"
          trendValue="5%"
          trendText="vs last month"
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(getTotalRevenue())}
          icon="fas fa-rupee-sign"
          trend="up"
          trendValue="18%"
          trendText="vs last month"
          color="purple"
        />
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>
      </Card>

      {/* Consultations Table */}
      <Table
        columns={consultationColumns}
        data={filteredConsultations}
        loading={loading}
        onRowClick={(consultation) => console.log('View consultation details:', consultation)}
      />

      <style jsx>{`
        .admin-consultations {
          padding: 2rem;
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .search-box input::placeholder {
          color: #64748b;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        @media (max-width: 768px) {
          .admin-consultations {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
