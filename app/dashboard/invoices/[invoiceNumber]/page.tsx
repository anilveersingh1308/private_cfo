'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader, 
  FormField, 
  Alert,
  Badge 
} from '@/components/dashboard/DashboardComponents';

interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  service_type: string;
  service_description?: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed';
  payment_terms: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  consultation_id?: number;
  created_at: string;
  updated_at: string;
}

export default function InvoiceViewEdit() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const invoiceNumber = params.invoiceNumber as string;
  const isEditMode = searchParams.get('edit') === 'true';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    service_description: '',
    amount: '',
    payment_terms: '30',
    due_date: '',
    status: 'draft' as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);

  useEffect(() => {
    if (invoice && isEditMode) {
      setFormData({
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        client_phone: invoice.client_phone || '',
        service_type: invoice.service_type || '',
        service_description: invoice.service_description || '',
        amount: invoice.amount?.toString() || '',
        payment_terms: invoice.payment_terms || '30',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        status: invoice.status || 'draft'
      });
    }
  }, [invoice, isEditMode]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/dashboard/invoices/by-number/${invoiceNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invoice not found');
        }
        throw new Error('Failed to fetch invoice');
      }

      const data = await response.json();
      setInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.client_name.trim()) {
      errors.client_name = 'Client name is required';
    }

    if (!formData.client_email.trim()) {
      errors.client_email = 'Client email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      errors.client_email = 'Please enter a valid email address';
    }

    if (!formData.service_type.trim()) {
      errors.service_type = 'Service type is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/api/dashboard/invoices/by-number/${invoiceNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update invoice');
      }

      const result = await response.json();
      setInvoice(result.invoice);
      setHasUnsavedChanges(false);
      setSuccessMessage('Invoice updated successfully');
      
      // Redirect to view mode
      router.push(`/dashboard/invoices/${invoiceNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice');
      console.error('Error updating invoice:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        router.push(`/dashboard/invoices/${invoiceNumber}`);
      }
    } else {
      router.push(`/dashboard/invoices/${invoiceNumber}`);
    }
  };

  const handleDuplicate = () => {
    if (invoice) {
      router.push(`/dashboard/invoices/new?duplicate=${invoice.invoice_number}`);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading invoice...</span>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
      <div className="error-container">
        <Card>
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Unable to Load Invoice</h3>
            <p>{error}</p>
            <div className="error-actions">
              <Button variant="primary" size="sm" onClick={fetchInvoice}>
                <i className="fas fa-refresh"></i>
                Try Again
              </Button>
              <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard/invoices')}>
                <i className="fas fa-arrow-left"></i>
                Back to Invoices
              </Button>
            </div>
          </div>
        </Card>
        <style jsx>{`
          .error-container {
            padding: 2rem;
            min-height: 60vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
            text-align: center;
          }
          .error-content i {
            font-size: 3rem;
            color: #ef4444;
          }
          .error-content h3 {
            margin: 0;
            color: #f8fafc;
            font-size: 1.5rem;
          }
          .error-content p {
            margin: 0;
            color: #94a3b8;
          }
          .error-actions {
            display: flex;
            gap: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="invoice-view-edit">
      <PageHeader
        title={isEditMode ? 'Edit Invoice' : 'Invoice Details'}
        subtitle={`Invoice ${invoice.invoice_number}`}
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: invoice.invoice_number }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isEditMode && (
              <>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon="fas fa-copy"
                  onClick={handleDuplicate}
                >
                  Duplicate
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon="fas fa-edit"
                  onClick={() => router.push(`/dashboard/invoices/${invoiceNumber}?edit=true`)}
                >
                  Edit Invoice
                </Button>
              </>
            )}
            {isEditMode && (
              <>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon="fas fa-save"
                  onClick={handleSave}
                  disabled={saving || !hasUnsavedChanges}
                  loading={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        }
      />

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {hasUnsavedChanges && isEditMode && (
        <Alert variant="warning" className="mb-4">
          <i className="fas fa-exclamation-triangle"></i>
          You have unsaved changes. Don't forget to save your work.
        </Alert>
      )}

      <div className="invoice-content">
        {/* Invoice Header */}
        <Card className="invoice-header-card">
          <div className="invoice-header">
            <div className="invoice-number-section">
              <h2>{invoice.invoice_number}</h2>
              {getStatusBadge(invoice.status)}
            </div>
            <div className="invoice-amount-section">
              <div className="amount-breakdown">
                <div className="amount-line">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.amount)}</span>
                </div>
                <div className="amount-line">
                  <span>Tax (18% GST):</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <div className="total-line">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="invoice-form-grid">
          {/* Client Information */}
          <Card className="form-section">
            <h3>Client Information</h3>
            <div className="form-grid">
              <FormField
                label="Client Name"
                error={formErrors.client_name}
                required
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    placeholder="Enter client name"
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value">{invoice.client_name}</div>
                )}
              </FormField>

              <FormField
                label="Email Address"
                error={formErrors.client_email}
                required
              >
                {isEditMode ? (
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => handleInputChange('client_email', e.target.value)}
                    placeholder="Enter email address"
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value">
                    <a href={`mailto:${invoice.client_email}`} className="email-link">
                      {invoice.client_email}
                    </a>
                  </div>
                )}
              </FormField>

              <FormField
                label="Phone Number"
                error={formErrors.client_phone}
              >
                {isEditMode ? (
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => handleInputChange('client_phone', e.target.value)}
                    placeholder="Enter phone number"
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value">
                    {invoice.client_phone ? (
                      <a href={`tel:${invoice.client_phone}`} className="phone-link">
                        {invoice.client_phone}
                      </a>
                    ) : (
                      <span className="empty-value">Not provided</span>
                    )}
                  </div>
                )}
              </FormField>
            </div>
          </Card>

          {/* Service Information */}
          <Card className="form-section">
            <h3>Service Information</h3>
            <div className="form-grid">
              <FormField
                label="Service Type"
                error={formErrors.service_type}
                required
              >
                {isEditMode ? (
                  <select
                    value={formData.service_type}
                    onChange={(e) => handleInputChange('service_type', e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select service type</option>
                    <option value="Tax Filing">Tax Filing</option>
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Business Consultation">Business Consultation</option>
                    <option value="Accounting Services">Accounting Services</option>
                    <option value="Audit Services">Audit Services</option>
                    <option value="GST Filing">GST Filing</option>
                    <option value="Company Registration">Company Registration</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="read-only-value">{invoice.service_type}</div>
                )}
              </FormField>

              <FormField
                label="Service Description"
                error={formErrors.service_description}
              >
                {isEditMode ? (
                  <textarea
                    value={formData.service_description}
                    onChange={(e) => handleInputChange('service_description', e.target.value)}
                    placeholder="Enter service description"
                    rows={3}
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value">
                    {invoice.service_description || <span className="empty-value">No description provided</span>}
                  </div>
                )}
              </FormField>

              <FormField
                label="Amount (₹)"
                error={formErrors.amount}
                required
              >
                {isEditMode ? (
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value amount-value">
                    {formatCurrency(invoice.amount)}
                  </div>
                )}
              </FormField>
            </div>
          </Card>

          {/* Payment & Terms */}
          <Card className="form-section">
            <h3>Payment & Terms</h3>
            <div className="form-grid">
              <FormField
                label="Payment Terms (Days)"
                error={formErrors.payment_terms}
              >
                {isEditMode ? (
                  <select
                    value={formData.payment_terms}
                    onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                    disabled={saving}
                  >
                    <option value="0">Due on Receipt</option>
                    <option value="15">Net 15</option>
                    <option value="30">Net 30</option>
                    <option value="45">Net 45</option>
                    <option value="60">Net 60</option>
                  </select>
                ) : (
                  <div className="read-only-value">
                    {invoice.payment_terms === '0' ? 'Due on Receipt' : `Net ${invoice.payment_terms}`}
                  </div>
                )}
              </FormField>

              <FormField
                label="Due Date"
                error={formErrors.due_date}
                required
              >
                {isEditMode ? (
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    disabled={saving}
                  />
                ) : (
                  <div className="read-only-value">
                    {formatDate(invoice.due_date)}
                  </div>
                )}
              </FormField>

              <FormField
                label="Status"
                error={formErrors.status}
              >
                {isEditMode ? (
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={saving}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div className="read-only-value">
                    {getStatusBadge(invoice.status)}
                  </div>
                )}
              </FormField>
            </div>
          </Card>

          {/* Invoice Information */}
          <Card className="form-section">
            <h3>Invoice Information</h3>
            <div className="form-grid">
              <FormField label="Created Date">
                <div className="read-only-value">
                  {formatDate(invoice.created_at)}
                </div>
              </FormField>

              {invoice.updated_at && (
                <FormField label="Last Modified">
                  <div className="read-only-value">
                    {formatDate(invoice.updated_at)}
                  </div>
                </FormField>
              )}

              {invoice.paid_date && (
                <FormField label="Paid Date">
                  <div className="read-only-value">
                    {formatDate(invoice.paid_date)}
                  </div>
                </FormField>
              )}

              {invoice.payment_method && (
                <FormField label="Payment Method">
                  <div className="read-only-value">
                    {invoice.payment_method}
                  </div>
                </FormField>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .invoice-view-edit {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .invoice-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .invoice-header-card {
          margin-bottom: 2rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
        }

        .invoice-number-section h2 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 2rem;
          font-weight: 700;
        }

        .invoice-amount-section {
          text-align: right;
        }

        .amount-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .amount-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #cbd5e1;
          font-size: 0.875rem;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          color: #f8fafc;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .total-line span:last-child {
          color: #22c55e;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .invoice-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
        }

        .form-section {
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .form-section h3 {
          margin: 0 0 1.5rem 0;
          color: #0ea5e9;
          font-size: 1.2rem;
          font-weight: 600;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(14, 165, 233, 0.2);
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .read-only-value {
          color: #f8fafc;
          font-size: 0.875rem;
          line-height: 1.5;
          min-height: 1.25rem;
        }

        .amount-value {
          color: #22c55e;
          font-weight: 600;
          font-size: 1rem;
        }

        .email-link {
          color: #0ea5e9;
          text-decoration: none;
        }

        .email-link:hover {
          text-decoration: underline;
        }

        .phone-link {
          color: #0ea5e9;
          text-decoration: none;
        }

        .phone-link:hover {
          text-decoration: underline;
        }

        .empty-value {
          color: #64748b;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .invoice-view-edit {
            padding: 1rem;
          }

          .invoice-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: left;
          }

          .invoice-amount-section {
            text-align: left;
          }

          .invoice-form-grid {
            grid-template-columns: 1fr;
          }

          .amount-breakdown {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
