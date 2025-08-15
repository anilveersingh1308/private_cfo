'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  StatsCard 
} from '@/components/dashboard/DashboardComponents';
import ResponsiveDataView from '@/components/dashboard/ResponsiveDataView';

interface NewsletterSubscriber {
  id: number;
  email: string;
  categories: string[] | null;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  engagement_score: number | null;
  source: string | null;
  total_emails_sent: number | null;
  last_email_opened: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  pending: number;
  avgEngagement: number;
}

export default function NewsletterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0,
    pending: 0,
    avgEngagement: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    isHtml: true
  });
  const [targetSubscriber, setTargetSubscriber] = useState<number | null>(null);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    categories: [] as string[],
    source: 'manual'
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/dashboard/sign-in');
      return;
    }
    if (user.role !== 'admin') {
      return;
    }
    
    fetchSubscribers();
    fetchStats();
  }, [user, loading, router]);

  const fetchSubscribers = async () => {
    try {
      setLoadingData(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/dashboard/subscribers?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/newsletter-stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (subscriberId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/dashboard/subscribers/${subscriberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchSubscribers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedSubscribers.length === 0) return;

    try {
      const response = await fetch('/api/dashboard/subscribers/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriberIds: selectedSubscribers,
          action 
        })
      });

      if (response.ok) {
        setSelectedSubscribers([]);
        fetchSubscribers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/dashboard/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscriber)
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewSubscriber({ email: '', categories: [], source: 'manual' });
        fetchSubscribers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/dashboard/subscribers/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
    }
  };

  // Email functionality
  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch('/api/dashboard/newsletter/send');
      const data = await response.json();
      if (data.success) {
        setEmailTemplates(data.data);
      }
    } catch (error) {
      console.error('Error fetching email templates:', error);
    }
  };

  const handleOpenEmailModal = (subscriberId?: number) => {
    setTargetSubscriber(subscriberId || null);
    setShowEmailModal(true);
    fetchEmailTemplates();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      const currentDate = new Date();
      const subject = template.subject
        .replace('{{month}}', currentDate.toLocaleDateString('en-US', { month: 'long' }))
        .replace('{{year}}', currentDate.getFullYear().toString())
        .replace('{{date}}', currentDate.toLocaleDateString());
      
      setEmailData({
        subject,
        content: template.content,
        isHtml: true
      });
    }
    setSelectedTemplate(templateId);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.subject || !emailData.content) return;

    const recipientIds = targetSubscriber 
      ? [targetSubscriber] 
      : selectedSubscribers.length > 0 
        ? selectedSubscribers 
        : filteredSubscribers.filter(s => s.status === 'active').map(s => s.id);

    if (recipientIds.length === 0) {
      alert('Please select at least one active subscriber');
      return;
    }

    try {
      setEmailLoading(true);
      const response = await fetch('/api/dashboard/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberIds: recipientIds,
          subject: emailData.subject,
          content: emailData.content,
          isHtml: emailData.isHtml
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${result.data.recipientCount} subscribers!`);
        setShowEmailModal(false);
        setSelectedSubscribers([]);
        setTargetSubscriber(null);
        setEmailData({ subject: '', content: '', isHtml: true });
        setSelectedTemplate('');
        fetchSubscribers();
        fetchStats();
      } else {
        alert(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const handleSelectSubscriber = (subscriberId: number) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', variant: 'success' as const },
      unsubscribed: { label: 'Unsubscribed', variant: 'warning' as const },
      bounced: { label: 'Bounced', variant: 'danger' as const },
      pending: { label: 'Pending', variant: 'info' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'neutral' as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderSubscriberCard = (subscriber: NewsletterSubscriber, index: number) => (
    <div key={subscriber.id} className="subscriber-card">
      <div className="subscriber-header">
        <div className="subscriber-email">
          <h3>{subscriber.email}</h3>
          <p className="subscriber-source">{subscriber.source || 'Unknown'}</p>
        </div>
        <div className="subscriber-badge">
          <Badge variant={getStatusBadge(subscriber.status).variant}>
            {getStatusBadge(subscriber.status).label}
          </Badge>
        </div>
      </div>

      <div className="subscriber-stats">
        <div className="stat-item">
          <span className="stat-label">Engagement</span>
          <span className="stat-value">
            {subscriber.engagement_score ? `${subscriber.engagement_score}%` : 'N/A'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Subscribed</span>
          <span className="stat-value">{formatDate(subscriber.subscribed_at)}</span>
        </div>
      </div>

      {subscriber.categories && subscriber.categories.length > 0 && (
        <div className="subscriber-categories">
          <span className="categories-label">Interests:</span>
          <div className="categories-list">
            {subscriber.categories.slice(0, 3).map((category, idx) => (
              <Badge key={idx} variant="info" size="sm">{category}</Badge>
            ))}
            {subscriber.categories.length > 3 && (
              <Badge variant="neutral" size="sm">+{subscriber.categories.length - 3}</Badge>
            )}
          </div>
        </div>
      )}

      <div className="subscriber-actions">
        <input
          type="checkbox"
          checked={selectedSubscribers.includes(subscriber.id)}
          onChange={() => handleSelectSubscriber(subscriber.id)}
          className="subscriber-checkbox"
        />
        {subscriber.status === 'active' && (
          <Button variant="ghost" size="sm" icon="fas fa-envelope" onClick={() => handleOpenEmailModal(subscriber.id)}>
            Email
          </Button>
        )}
        {subscriber.status !== 'active' && (
          <Button variant="ghost" size="sm" icon="fas fa-check" onClick={() => handleStatusUpdate(subscriber.id, 'active')}>
            Activate
          </Button>
        )}
        {subscriber.status !== 'unsubscribed' && (
          <Button variant="ghost" size="sm" icon="fas fa-times" onClick={() => handleStatusUpdate(subscriber.id, 'unsubscribed')}>
            Unsubscribe
          </Button>
        )}
      </div>
    </div>
  );

  const subscriberColumns = [
    { 
      key: 'select', 
      title: (
        <input
          type="checkbox"
          checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
          onChange={handleSelectAll}
        />
      ) as any,
      render: (_: any, row: NewsletterSubscriber) => (
        <input
          type="checkbox"
          checked={selectedSubscribers.includes(row.id)}
          onChange={() => handleSelectSubscriber(row.id)}
        />
      )
    },
    { key: 'email', title: 'Email' },
    { 
      key: 'status', 
      title: 'Status',
      render: (status: string) => (
        <Badge variant={getStatusBadge(status).variant}>
          {getStatusBadge(status).label}
        </Badge>
      )
    },
    { key: 'source', title: 'Source' },
    { 
      key: 'engagement_score', 
      title: 'Engagement',
      render: (score: number) => score ? `${score}%` : 'N/A'
    },
    { 
      key: 'subscribed_at', 
      title: 'Subscribed',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, row: NewsletterSubscriber) => (
        <div className="action-buttons">
          {row.status === 'active' && (
            <button
              onClick={() => handleOpenEmailModal(row.id)}
              className="action-btn email"
              title="Send Email"
            >
              <i className="fas fa-envelope"></i>
            </button>
          )}
          {row.status !== 'active' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'active')}
              className="action-btn activate"
              title="Activate"
            >
              <i className="fas fa-check"></i>
            </button>
          )}
          {row.status !== 'unsubscribed' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'unsubscribed')}
              className="action-btn unsubscribe"
              title="Unsubscribe"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchSubscribers();
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="newsletter-page">
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ color: '#6b7280' }}>Loading...</span>
          </div>
        </Card>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="newsletter-page">
        <Card>
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#ef4444'
          }}>
            <i className="fas fa-lock" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h2>Access Denied</h2>
            <p>You need administrator privileges to view this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="newsletter-page">
      <PageHeader
        title="Newsletter Management"
        subtitle="Manage newsletter subscribers and email campaigns"
        actions={
          <div className="header-actions">
            <Button onClick={() => handleOpenEmailModal()} variant="primary">
              <i className="fas fa-envelope"></i>
              Send to All Active
            </Button>
            <Button onClick={handleExport} variant="secondary">
              <i className="fas fa-download"></i>
              Export
            </Button>
            <Button onClick={() => setShowAddModal(true)} variant="primary">
              <i className="fas fa-plus"></i>
              Add Subscriber
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Subscribers"
          value={stats.total.toLocaleString()}
          icon="fas fa-users"
          color="blue"
        />
        <StatsCard
          title="Active"
          value={stats.active.toLocaleString()}
          icon="fas fa-check-circle"
          color="green"
        />
        <StatsCard
          title="Unsubscribed"
          value={stats.unsubscribed.toLocaleString()}
          icon="fas fa-user-minus"
          color="orange"
        />
        <StatsCard
          title="Avg Engagement"
          value={`${stats.avgEngagement.toFixed(1)}%`}
          icon="fas fa-chart-line"
          color="purple"
        />
      </div>

      {/* Filters and Actions */}
      <Card>
        <div className="filters-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {selectedSubscribers.length > 0 && (
          <div className="bulk-actions">
            <span>Selected: {selectedSubscribers.length}</span>
            <Button onClick={() => handleOpenEmailModal()} variant="primary" size="sm">
              <i className="fas fa-envelope"></i>
              Send Email
            </Button>
            <Button onClick={() => handleBulkAction('activate')} variant="primary" size="sm">
              Activate
            </Button>
            <Button onClick={() => handleBulkAction('unsubscribe')} variant="secondary" size="sm">
              Unsubscribe
            </Button>
            <Button onClick={() => handleBulkAction('delete')} variant="danger" size="sm">
              Delete
            </Button>
          </div>
        )}
      </Card>

      {/* Subscribers Table */}
      <Card>
        {loadingData ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ color: '#6b7280' }}>Loading subscribers...</span>
          </div>
        ) : (
          <ResponsiveDataView
            data={filteredSubscribers}
            columns={subscriberColumns}
            loading={loadingData}
            searchQuery={searchTerm}
            cardRenderer={renderSubscriberCard}
          />
        )}
      </Card>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Subscriber</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="modal-body">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="source">Source</label>
                <select
                  id="source"
                  value={newSubscriber.source}
                  onChange={(e) => setNewSubscriber({...newSubscriber, source: e.target.value})}
                >
                  <option value="manual">Manual</option>
                  <option value="website">Website</option>
                  <option value="import">Import</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button type="button" onClick={() => setShowAddModal(false)} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <i className="fas fa-plus"></i>
                  Add Subscriber
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {targetSubscriber 
                  ? `Send Email to ${subscribers.find(s => s.id === targetSubscriber)?.email}`
                  : selectedSubscribers.length > 0 
                    ? `Send Email to ${selectedSubscribers.length} Selected Subscribers`
                    : `Send Email to All Active Subscribers (${stats.active})`
                }
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="modal-body">
              <div className="form-group">
                <label htmlFor="email-template">Email Template (Optional)</label>
                <select
                  id="email-template"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                >
                  <option value="">Choose a template...</option>
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="email-subject">Subject</label>
                <input
                  type="text"
                  id="email-subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  required
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email-content">Email Content</label>
                <div className="editor-toolbar">
                  <button
                    type="button"
                    onClick={() => setEmailData({...emailData, isHtml: !emailData.isHtml})}
                    className={`toolbar-btn ${emailData.isHtml ? 'active' : ''}`}
                  >
                    <i className="fas fa-code"></i>
                    HTML
                  </button>
                </div>
                {emailData.isHtml ? (
                  <textarea
                    id="email-content"
                    value={emailData.content}
                    onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                    required
                    placeholder="Enter email content (HTML supported)"
                    rows={15}
                    className="html-editor"
                  />
                ) : (
                  <textarea
                    id="email-content"
                    value={emailData.content}
                    onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                    required
                    placeholder="Enter email content (plain text)"
                    rows={15}
                  />
                )}
              </div>
              
              <div className="email-preview">
                <h4>Preview:</h4>
                <div className="preview-box">
                  <div className="preview-subject">
                    <strong>Subject:</strong> {emailData.subject || 'No subject'}
                  </div>
                  <div className="preview-content">
                    {emailData.isHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: emailData.content }} />
                    ) : (
                      <pre>{emailData.content}</pre>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <Button type="button" onClick={() => setShowEmailModal(false)} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={emailLoading}>
                  {emailLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .newsletter-page {
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .filters-container {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          padding: 1rem 0;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-box i {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: rgba(30, 41, 59, 0.5);
          color: #f8fafc;
        }

        .search-box input::placeholder {
          color: #94a3b8;
        }

        select {
          padding: 0.75rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: rgba(30, 41, 59, 0.5);
          color: #f8fafc;
        }

        .bulk-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .bulk-actions span {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-right: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .action-btn.activate {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .action-btn.activate:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        .action-btn.unsubscribe {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
        }

        .action-btn.unsubscribe:hover {
          background: rgba(251, 146, 60, 0.3);
        }

        .action-btn.bounce {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .action-btn.bounce:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .action-btn.email {
          background: rgba(14, 165, 233, 0.2);
          color: #0ea5e9;
        }

        .action-btn.email:hover {
          background: rgba(14, 165, 233, 0.3);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 1rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          backdrop-filter: blur(12px);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
        }

        .close-btn:hover {
          color: #f8fafc;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #f8fafc;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: rgba(15, 23, 42, 0.8);
          color: #f8fafc;
        }

        .form-group input::placeholder {
          color: #94a3b8;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .large-modal {
          max-width: 800px;
        }

        .editor-toolbar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .toolbar-btn {
          padding: 0.5rem 1rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.25rem;
          background: rgba(30, 41, 59, 0.5);
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #f8fafc;
        }

        .toolbar-btn.active {
          background: rgba(14, 165, 233, 0.2);
          color: #0ea5e9;
          border-color: rgba(14, 165, 233, 0.5);
        }

        .html-editor {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }

        .email-preview {
          margin-top: 1.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          padding-top: 1rem;
        }

        .email-preview h4 {
          color: #f8fafc;
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .preview-box {
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.8);
          max-height: 300px;
          overflow-y: auto;
        }

        .preview-subject {
          color: #f8fafc;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .preview-content {
          color: #cbd5e1;
          line-height: 1.6;
        }

        .preview-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
        }

        .preview-content h1,
        .preview-content h2,
        .preview-content h3 {
          color: #f8fafc;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .preview-content ul,
        .preview-content ol {
          margin: 0.5rem 0 0.5rem 1.5rem;
        }

        .preview-content p {
          margin: 0.5rem 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .newsletter-page {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .bulk-actions {
            flex-wrap: wrap;
          }

          .subscriber-card {
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 0.75rem;
            padding: 1rem;
            transition: all 0.2s ease;
          }

          .subscriber-card:hover {
            border-color: rgba(59, 130, 246, 0.4);
            background: rgba(30, 41, 59, 1);
          }

          .subscriber-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
          }

          .subscriber-email {
            font-weight: 600;
            color: #f8fafc;
            font-size: 0.9rem;
            word-break: break-word;
            flex: 1;
            margin-right: 1rem;
          }

          .subscriber-card-body {
            space-y: 0.5rem;
          }

          .subscriber-meta {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }

          .subscriber-meta-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
          }

          .subscriber-meta-label {
            color: #94a3b8;
            font-weight: 500;
          }

          .subscriber-meta-value {
            color: #e2e8f0;
            font-weight: 500;
          }

          .subscriber-card-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(59, 130, 246, 0.1);
          }

          .subscriber-action-btn {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #94a3b8;
            padding: 0.4rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .subscriber-action-btn:hover {
            background: rgba(59, 130, 246, 0.2);
            color: #f8fafc;
            border-color: rgba(59, 130, 246, 0.5);
          }

          .subscriber-action-btn.email {
            background: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.3);
            color: #22c55e;
          }

          .subscriber-action-btn.email:hover {
            background: rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.5);
          }

          .subscriber-action-btn.activate {
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.3);
            color: #10b981;
          }

          .subscriber-action-btn.activate:hover {
            background: rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.5);
          }

          .subscriber-action-btn.unsubscribe {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #ef4444;
          }

          .subscriber-action-btn.unsubscribe:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.5);
          }

          .subscriber-action-btn.bounce {
            background: rgba(245, 158, 11, 0.1);
            border-color: rgba(245, 158, 11, 0.3);
            color: #f59e0b;
          }

          .subscriber-action-btn.bounce:hover {
            background: rgba(245, 158, 11, 0.2);
            border-color: rgba(245, 158, 11, 0.5);
          }

          .subscriber-checkbox {
            margin-right: 0.5rem;
          }

          /* Mobile card separation */
          .responsive-data-view .card {
            position: relative;
            border: 2px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
          }

          .responsive-data-view .card:not(:last-child)::after {
            content: '';
            position: absolute;
            bottom: -0.75rem;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, #d1d5db, transparent);
          }
        }
      `}</style>
    </div>
  );
}
