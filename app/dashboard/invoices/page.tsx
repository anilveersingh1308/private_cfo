'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge 
} from '@/components/dashboard/DashboardComponents';
import ResponsiveDataView from '@/components/dashboard/ResponsiveDataView';

interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  client_email: string;
  service_type: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  created_at: string;
  paid_at?: string;
  payment_method?: string;
}

export default function AdminInvoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch from API
      const response = await fetch('/api/dashboard/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/${invoice.invoice_number}?edit=true`);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev.map(inv => 
        inv.id === invoice.id 
          ? { ...inv, status: 'sent' as const }
          : inv
      ));
      
      console.log('Invoice sent:', invoice.invoice_number);
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev.map(inv => 
        inv.id === invoice.id 
          ? { 
              ...inv, 
              status: 'paid' as const,
              paid_at: new Date().toISOString(),
              payment_method: 'Manual Entry'
            }
          : inv
      ));
      
      console.log('Invoice marked as paid:', invoice.invoice_number);
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedInvoice) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== selectedInvoice.id));
      setShowDeleteModal(false);
      console.log('Invoice deleted:', selectedInvoice.invoice_number);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success" size="sm">Paid</Badge>;
      case 'sent': return <Badge variant="info" size="sm">Sent</Badge>;
      case 'overdue': return <Badge variant="danger" size="sm">Overdue</Badge>;
      case 'draft': return <Badge variant="neutral" size="sm">Draft</Badge>;
      case 'cancelled': return <Badge variant="neutral" size="sm">Cancelled</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const exportInvoices = (format: 'json' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredInvoices, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoices-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Invoice Number', 'Client', 'Service', 'Amount', 'Status', 'Due Date', 'Created Date'];
      const csvContent = [
        headers.join(','),
        ...filteredInvoices.map(invoice => [
          `"${invoice.invoice_number}"`,
          `"${invoice.client_name}"`,
          `"${invoice.service_type}"`,
          invoice.amount,
          `"${invoice.status}"`,
          `"${formatDate(invoice.due_date)}"`,
          `"${formatDate(invoice.created_at)}"`
        ].join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoices-${timestamp}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Enhanced filtering and sorting logic
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.client_email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'client_name':
          aValue = a.client_name.toLowerCase();
          bValue = b.client_name.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'due_date':
          aValue = new Date(a.due_date).getTime();
          bValue = new Date(b.due_date).getTime();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
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

  const columns = [
    {
      key: 'invoice_number',
      title: 'Invoice',
      render: (value: string, row: Invoice) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>
            {value}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
      width: '140px'
    },
    {
      key: 'client_name',
      title: 'Client',
      render: (value: string, row: Invoice) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.875rem' }}>
            {value}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {row.client_email}
          </div>
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
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <div style={{ textAlign: 'right', fontWeight: '600', color: '#22c55e', fontSize: '0.875rem' }}>
          {formatCurrency(value)}
        </div>
      ),
      width: '120px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '100px'
    },
    {
      key: 'due_date',
      title: 'Due Date',
      render: (value: string, row: Invoice) => {
        const isOverdue = row.status !== 'paid' && new Date(value) < new Date();
        const daysOverdue = getDaysOverdue(value);
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ 
              color: isOverdue ? '#ef4444' : '#cbd5e1', 
              fontSize: '0.875rem',
              fontWeight: isOverdue ? '600' : '500'
            }}>
              {formatDate(value)}
            </div>
            {isOverdue && daysOverdue > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                {daysOverdue} days overdue
              </div>
            )}
          </div>
        );
      },
      width: '120px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: Invoice) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => handleViewInvoice(row)}
          >
            View
          </Button>
          {row.status === 'draft' && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-paper-plane"
              onClick={() => handleSendInvoice(row)}
            >
              Send
            </Button>
          )}
          {(row.status === 'sent' || row.status === 'overdue') && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-check"
              onClick={() => handleMarkAsPaid(row)}
            >
              Mark Paid
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-edit"
            onClick={() => handleEditInvoice(row)}
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-trash"
            onClick={() => handleDeleteInvoice(row)}
          >
            Delete
          </Button>
        </div>
      ),
      width: '280px'
    }
  ];

  // Calculate summary statistics
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const renderInvoiceCard = (invoice: Invoice, index: number) => (
    <div key={invoice.id} className="invoice-card" onClick={() => handleViewInvoice(invoice)}>
      <div className="invoice-header">
        <div className="invoice-info">
          <h3 className="invoice-number">{invoice.invoice_number}</h3>
          <p className="invoice-date">{formatDate(invoice.created_at)}</p>
        </div>
        <div className="invoice-status">
          {getStatusBadge(invoice.status)}
        </div>
      </div>

      <div className="invoice-client">
        <h4 className="client-name">{invoice.client_name}</h4>
        <p className="client-email">{invoice.client_email}</p>
      </div>

      <div className="invoice-details">
        <div className="detail-row">
          <span className="detail-label">Service</span>
          <Badge variant="info" size="sm">{invoice.service_type}</Badge>
        </div>
        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span className="detail-value amount">{formatCurrency(invoice.amount)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Due Date</span>
          <span className="detail-value">{formatDate(invoice.due_date)}</span>
        </div>
        {invoice.paid_at && (
          <div className="detail-row">
            <span className="detail-label">Paid</span>
            <span className="detail-value">{formatDate(invoice.paid_at)}</span>
          </div>
        )}
      </div>

      <div className="invoice-actions">
        <Button variant="ghost" size="sm" icon="fas fa-eye" onClick={() => handleViewInvoice(invoice)}>
          View
        </Button>
        <Button variant="ghost" size="sm" icon="fas fa-edit" onClick={() => handleEditInvoice(invoice)}>
          Edit
        </Button>
        {invoice.status === 'draft' && (
          <Button variant="ghost" size="sm" icon="fas fa-paper-plane" onClick={() => handleSendInvoice(invoice)}>
            Send
          </Button>
        )}
        {invoice.status === 'sent' && (
          <Button variant="ghost" size="sm" icon="fas fa-check" onClick={() => handleMarkAsPaid(invoice)}>
            Mark Paid
          </Button>
        )}
        <Button variant="ghost" size="sm" icon="fas fa-trash" onClick={() => handleDeleteInvoice(invoice)}>
          Delete
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading invoices...</span>
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
          <h3>Unable to Load Invoices</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={fetchInvoices}>
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

  return (
    <div className="admin-invoices">
      <PageHeader
        title="Invoice Management"
        subtitle={`Manage invoices and billing for ${filteredInvoices.length} record(s)`}
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-download"
              onClick={() => exportInvoices('csv')}
            >
              Export CSV
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-file-code"
              onClick={() => exportInvoices('json')}
            >
              Export JSON
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon="fas fa-plus"
              onClick={() => router.push('/dashboard/invoices/new')}
            >
              Create Invoice
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="summary-cards">
        <Card className="summary-card">
          <div className="summary-content">
            <div className="summary-icon total">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="summary-details">
              <div className="summary-value">{formatCurrency(totalAmount)}</div>
              <div className="summary-label">Total Amount</div>
            </div>
          </div>
        </Card>
        <Card className="summary-card">
          <div className="summary-content">
            <div className="summary-icon paid">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="summary-details">
              <div className="summary-value">{formatCurrency(paidAmount)}</div>
              <div className="summary-label">Paid Amount</div>
            </div>
          </div>
        </Card>
        <Card className="summary-card">
          <div className="summary-content">
            <div className="summary-icon overdue">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="summary-details">
              <div className="summary-value">{formatCurrency(overdueAmount)}</div>
              <div className="summary-label">Overdue Amount</div>
            </div>
          </div>
        </Card>
        <Card className="summary-card">
          <div className="summary-content">
            <div className="summary-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="summary-details">
              <div className="summary-value">{formatCurrency(totalAmount - paidAmount)}</div>
              <div className="summary-label">Pending Amount</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search invoices..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="created_at">Sort by Created Date</option>
            <option value="due_date">Due Date</option>
            <option value="amount">Amount</option>
            <option value="client_name">Client Name</option>
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
      <ResponsiveDataView
        data={filteredInvoices}
        columns={columns}
        loading={loading}
        searchQuery={searchQuery}
        cardRenderer={renderInvoiceCard}
        onRowClick={(invoice: Invoice) => handleViewInvoice(invoice)}
      />

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-header">
                <div className="invoice-number">
                  <h4>{selectedInvoice.invoice_number}</h4>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <div className="invoice-amount">
                  <div className="amount-value">{formatCurrency(selectedInvoice.amount)}</div>
                </div>
              </div>
              
              <div className="invoice-details-grid">
                <div className="detail-section">
                  <h5>Client Information</h5>
                  <div className="detail-item">
                    <label>Name</label>
                    <span>{selectedInvoice.client_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedInvoice.client_email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Service Type</label>
                    <span>{selectedInvoice.service_type}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h5>Invoice Information</h5>
                  <div className="detail-item">
                    <label>Created Date</label>
                    <span>{formatDate(selectedInvoice.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date</label>
                    <span>{formatDate(selectedInvoice.due_date)}</span>
                  </div>
                  {selectedInvoice.paid_at && (
                    <div className="detail-item">
                      <label>Paid Date</label>
                      <span>{formatDate(selectedInvoice.paid_at)}</span>
                    </div>
                  )}
                  {selectedInvoice.payment_method && (
                    <div className="detail-item">
                      <label>Payment Method</label>
                      <span>{selectedInvoice.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowViewModal(false);
                router.push(`/dashboard/invoices/${selectedInvoice.invoice_number}?edit=true`);
              }}>
                Edit Invoice
              </Button>
              {selectedInvoice.status === 'draft' && (
                <Button variant="primary" size="sm" onClick={() => {
                  setShowViewModal(false);
                  handleSendInvoice(selectedInvoice);
                }}>
                  Send Invoice
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Invoice</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-content">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="confirmation-text">
                  <p>
                    Are you sure you want to delete invoice <strong>{selectedInvoice.invoice_number}</strong>?
                  </p>
                  <p className="warning-note">
                    This action cannot be undone. All invoice data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
                Delete Invoice
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-invoices {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .summary-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }

        .summary-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .summary-icon.total {
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
        }

        .summary-icon.paid {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .summary-icon.overdue {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .summary-icon.pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .summary-details {
          flex: 1;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.25rem;
        }

        .summary-label {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
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

        .modal-content.small {
          max-width: 500px;
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

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .invoice-number h4 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .amount-value {
          font-size: 2rem;
          font-weight: 700;
          color: #22c55e;
        }

        .invoice-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .detail-section h5 {
          margin: 0 0 1rem 0;
          color: #0ea5e9;
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(14, 165, 233, 0.2);
          padding-bottom: 0.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .detail-item label {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-item span {
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .confirmation-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          text-align: left;
        }

        .warning-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 1.5rem;
        }

        .confirmation-text p {
          margin: 0 0 0.75rem 0;
          color: #e2e8f0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .confirmation-text p:last-child {
          margin-bottom: 0;
        }

        .warning-note {
          color: #fbbf24 !important;
          font-size: 0.8rem !important;
        }

        /* Invoice Card Styles */
        .invoice-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1.25rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .invoice-card:hover {
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .invoice-info {
          flex: 1;
        }

        .invoice-number {
          margin: 0 0 0.25rem 0;
          color: #f8fafc;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .invoice-date {
          margin: 0;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .invoice-client {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .client-name {
          margin: 0 0 0.25rem 0;
          color: #f8fafc;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .client-email {
          margin: 0;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .invoice-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .detail-value {
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .detail-value.amount {
          color: #22c55e;
          font-weight: 600;
        }

        .invoice-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .admin-invoices {
            padding: 1rem;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .modal-content {
            width: 95%;
            margin: 1rem;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .invoice-header {
            flex-direction: column;
            gap: 1rem;
          }

          .invoice-details-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .confirmation-content {
            flex-direction: column;
            text-align: center;
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
