'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  Table 
} from '@/components/dashboard/DashboardComponents';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'consultant' | 'moderator';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  phone?: string;
  location?: string;
  consultations_count?: number;
  total_spent?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

interface NewsletterSubscriber {
  id: number;
  email: string;
  categories: string[];
  subscribed_at: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  engagement_score?: number;
  last_email_opened?: string;
  total_emails_sent?: number;
  source?: string;
}

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'subscribers'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch users from API
      const usersResponse = await fetch('/api/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users || []);
      
      // Fetch newsletter subscribers from API (graceful fallback if API doesn't exist)
      try {
        const subscribersResponse = await fetch('/api/dashboard/subscribers');
        if (subscribersResponse.ok) {
          const subscribersData = await subscribersResponse.json();
          setSubscribers(subscribersData.subscribers || []);
        } else {
          // Set empty array if subscribers API doesn't exist
          setSubscribers([]);
        }
      } catch (err) {
        console.log('Subscribers API not available, setting empty array');
        setSubscribers([]);
      }
      
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (type: 'users' | 'subscribers', format: 'json' | 'csv') => {
    const data = type === 'users' ? filteredUsers : filteredSubscribers;
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const csvContent = convertToCSV(data, type);
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${timestamp}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const convertToCSV = (data: any[], type: string) => {
    if (type === 'users') {
      const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Phone', 'Location', 'Consultations', 'Total Spent', 'Created At', 'Last Login'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.id,
          `"${item.name}"`,
          `"${item.email}"`,
          `"${item.role}"`,
          `"${item.status}"`,
          `"${item.phone || ''}"`,
          `"${item.location || ''}"`,
          item.consultations_count || 0,
          item.total_spent || 0,
          `"${new Date(item.created_at).toISOString()}"`,
          `"${item.last_login ? new Date(item.last_login).toISOString() : 'Never'}"`
        ].join(','))
      ].join('\n');
      return csvContent;
    } else {
      const headers = ['ID', 'Email', 'Categories', 'Status', 'Engagement Score', 'Source', 'Subscribed At', 'Last Email Opened'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.id,
          `"${item.email}"`,
          `"${item.categories.join('; ')}"`,
          `"${item.status}"`,
          item.engagement_score || 0,
          `"${item.source || ''}"`,
          `"${new Date(item.subscribed_at).toISOString()}"`,
          `"${item.last_email_opened ? new Date(item.last_email_opened).toISOString() : 'Never'}"`
        ].join(','))
      ].join('\n');
      return csvContent;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" size="sm">Active</Badge>;
      case 'inactive': return <Badge variant="danger" size="sm">Inactive</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'suspended': return <Badge variant="danger" size="sm">Suspended</Badge>;
      case 'unsubscribed': return <Badge variant="neutral" size="sm">Unsubscribed</Badge>;
      case 'bounced': return <Badge variant="danger" size="sm">Bounced</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="danger" size="sm">Admin</Badge>;
      case 'consultant': return <Badge variant="info" size="sm">Consultant</Badge>;
      case 'moderator': return <Badge variant="warning" size="sm">Moderator</Badge>;
      case 'user': return <Badge variant="neutral" size="sm">User</Badge>;
      default: return <Badge variant="neutral" size="sm">{role}</Badge>;
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
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  // Enhanced filtering and sorting logic
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_login':
          aValue = a.last_login ? new Date(a.last_login).getTime() : 0;
          bValue = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
        case 'consultations_count':
          aValue = a.consultations_count || 0;
          bValue = b.consultations_count || 0;
          break;
        case 'total_spent':
          aValue = a.total_spent || 0;
          bValue = b.total_spent || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const filteredSubscribers = subscribers
    .filter(subscriber => {
      const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           subscriber.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (subscriber.source && subscriber.source.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'subscribed_at':
          aValue = new Date(a.subscribed_at).getTime();
          bValue = new Date(b.subscribed_at).getTime();
          break;
        case 'engagement_score':
          aValue = a.engagement_score || 0;
          bValue = b.engagement_score || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const userColumns = [
    {
      key: 'name',
      title: 'User',
      render: (value: string, row: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${
              row.role === 'admin' ? '#ef4444, #dc2626' :
              row.role === 'consultant' ? '#0ea5e9, #3b82f6' :
              row.role === 'moderator' ? '#f59e0b, #d97706' :
              '#22c55e, #16a34a'
            })`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.email}</div>
            {row.location && (
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '0.25rem' }}></i>
                {row.location}
              </div>
            )}
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      key: 'role',
      title: 'Role',
      render: (value: string) => getRoleBadge(value),
      width: '100px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '100px'
    },
    {
      key: 'consultations_count',
      title: 'Sessions',
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.875rem' }}>
            {value || 0}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>consultations</div>
        </div>
      ),
      width: '100px'
    },
    {
      key: 'total_spent',
      title: 'Spent',
      render: (value: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: value > 0 ? '#22c55e' : '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>
            {value > 0 ? formatCurrency(value) : '—'}
          </div>
        </div>
      ),
      width: '120px'
    },
    {
      key: 'last_login',
      title: 'Last Active',
      render: (value: string) => value ? (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{getTimeAgo(value)}</span>
      ) : (
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Never</span>
      ),
      width: '120px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: User) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => console.log('View user', row.id)}
          >
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-edit"
            onClick={() => console.log('Edit user', row.id)}
          >
            Edit
          </Button>
          {row.role !== 'admin' && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-ban"
              onClick={() => console.log('Suspend user', row.id)}
            >
              Suspend
            </Button>
          )}
        </div>
      ),
      width: '180px'
    }
  ];

  const subscriberColumns = [
    {
      key: 'email',
      title: 'Subscriber',
      render: (value: string, row: NewsletterSubscriber) => (
        <div>
          <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>{value}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Score: {row.engagement_score || 0}% • {row.source}
          </div>
        </div>
      ),
      width: '280px'
    },
    {
      key: 'categories',
      title: 'Interests',
      render: (value: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {value.slice(0, 2).map((category, index) => (
            <Badge key={index} variant="info" size="sm">{category}</Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="neutral" size="sm">+{value.length - 2}</Badge>
          )}
        </div>
      ),
      width: '200px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '120px'
    },
    {
      key: 'engagement_score',
      title: 'Engagement',
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444', 
            fontWeight: '600', 
            fontSize: '0.875rem' 
          }}>
            {value || 0}%
          </div>
        </div>
      ),
      width: '100px'
    },
    {
      key: 'subscribed_at',
      title: 'Subscribed',
      render: (value: string) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{formatDate(value)}</span>
      ),
      width: '140px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: NewsletterSubscriber) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-envelope"
            onClick={() => console.log('Send email to', row.id)}
          >
            Email
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-chart-line"
            onClick={() => console.log('View analytics for', row.id)}
          >
            Analytics
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-ban"
            onClick={() => console.log('Unsubscribe', row.id)}
          >
            Block
          </Button>
        </div>
      ),
      width: '180px'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading users...</span>
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
          <h3>Unable to Load Users</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={fetchData}>
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

  const roleOptions = ['admin', 'consultant', 'moderator', 'user'];

  return (
    <div className="dashboard-users">
      <PageHeader
        title="User Management"
        subtitle={`Manage ${activeTab === 'users' ? 'platform users' : 'newsletter subscribers'} and their permissions`}
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-download"
              onClick={() => exportData(activeTab, 'csv')}
            >
              Export CSV
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-file-code"
              onClick={() => exportData(activeTab, 'json')}
            >
              Export JSON
            </Button>
            <Button variant="primary" size="sm" icon="fas fa-plus">
              Add {activeTab === 'users' ? 'User' : 'Subscriber'}
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i>
          Users ({filteredUsers.length})
        </button>
        <button 
          className={`tab ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          <i className="fas fa-envelope"></i>
          Subscribers ({filteredSubscribers.length})
        </button>
      </div>

      {/* Enhanced Filters */}
      <Card className="filters-card">
        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            {activeTab === 'users' && <option value="suspended">Suspended</option>}
            {activeTab === 'subscribers' && (
              <>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </>
            )}
          </select>

          {activeTab === 'users' && (
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          )}

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value={activeTab === 'users' ? 'created_at' : 'subscribed_at'}>
              Sort by {activeTab === 'users' ? 'Join Date' : 'Subscribe Date'}
            </option>
            <option value={activeTab === 'users' ? 'name' : 'email'}>
              {activeTab === 'users' ? 'Name' : 'Email'}
            </option>
            <option value={activeTab === 'users' ? 'last_login' : 'engagement_score'}>
              {activeTab === 'users' ? 'Last Login' : 'Engagement'}
            </option>
            {activeTab === 'users' && (
              <>
                <option value="consultations_count">Consultations</option>
                <option value="total_spent">Total Spent</option>
              </>
            )}
          </select>

          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <i className={`fas fa-sort-amount-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </Card>

      {/* Data Table */}
      {activeTab === 'users' ? (
        <Table
          columns={userColumns}
          data={filteredUsers}
          loading={loading}
          onRowClick={(user) => console.log('View user details:', user)}
        />
      ) : (
        <Table
          columns={subscriberColumns}
          data={filteredSubscribers}
          loading={loading}
          onRowClick={(subscriber) => console.log('View subscriber details:', subscriber)}
        />
      )}

      <style jsx>{`
        .dashboard-users {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #f8fafc;
          background: rgba(59, 130, 246, 0.1);
        }

        .tab.active {
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.1);
          border-bottom: 2px solid #0ea5e9;
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

        .sort-order-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sort-order-btn:hover {
          color: #f8fafc;
          border-color: #0ea5e9;
        }

        @media (max-width: 768px) {
          .dashboard-users {
            padding: 1rem;
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
