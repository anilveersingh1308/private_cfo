'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader
} from '@/components/admin/AdminComponents';

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
  payment_status: 'pending' | 'paid' | 'failed';
  payment_terms: string;
  due_date: string;
  created_at: string;
  updated_at?: string;
}

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [originalFormData, setOriginalFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    amount: '',
    description: '',
    due_date: '',
    payment_terms: '30',
    status: 'draft' as Invoice['status']
  });
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    amount: '',
    description: '',
    due_date: '',
    payment_terms: '30',
    status: 'draft' as Invoice['status']
  });

  const serviceTypes = [
    'Financial Planning',
    'Tax Consulting',
    'Investment Advice',
    'Business Consulting',
    'Retirement Planning',
    'Audit Services',
    'Bookkeeping',
    'Other'
  ];

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  // Add beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, originalFormData]);

  // Handle navigation within the app
  useEffect(() => {
    const handleRouteChange = () => {
      if (hasFormChanges()) {
        const shouldLeave = confirm(
          'You have unsaved changes. Are you sure you want to leave without saving?'
        );
        if (!shouldLeave) {
          return false;
        }
      }
      return true;
    };

    // Note: In Next.js 13+ with app router, route change interception is more complex
    // For now, we'll rely on the beforeunload event and manual checks in navigation functions
  }, [formData, originalFormData]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch invoice from API
      const response = await fetch(`/api/admin/invoices/${invoiceId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }
      
      const fetchedInvoice = await response.json();
      
      setInvoice(fetchedInvoice);
      const formDataObj = {
        client_name: fetchedInvoice.client_name,
        client_email: fetchedInvoice.client_email,
        client_phone: fetchedInvoice.client_phone || '',
        service_type: fetchedInvoice.service_type,
        amount: fetchedInvoice.amount.toString(),
        description: fetchedInvoice.service_description || '',
        due_date: new Date(fetchedInvoice.due_date).toISOString().split('T')[0],
        payment_terms: fetchedInvoice.payment_terms,
        status: fetchedInvoice.status
      };
      setFormData(formDataObj);
      setOriginalFormData({ ...formDataObj }); // Store original data for change detection
    } catch (err) {
      setError('Failed to fetch invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const tax = amount * 0.18; // 18% GST
    return amount + tax;
  };

  const hasFormChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updateData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        service_type: formData.service_type,
        service_description: formData.description,
        amount: formData.amount,
        payment_terms: formData.payment_terms,
        due_date: formData.due_date,
        status: formData.status
      };

      // Send update request to API
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      const result = await response.json();
      console.log('Invoice updated:', result);
      
      // Reset original form data to current data (no more changes)
      setOriginalFormData({ ...formData });
      
      // Redirect back to invoices list
      router.push('/admin/invoices');
    } catch (error) {
      console.error('Failed to update invoice:', error);
      setError('Failed to update invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasFormChanges()) {
      const shouldLeave = confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?'
      );
      if (!shouldLeave) {
        return;
      }
    }
    router.push('/admin/invoices');
  };

  const handleDuplicate = async () => {
    try {
      // Check if there are unsaved changes
      if (hasFormChanges()) {
        const shouldProceed = confirm(
          'You have unsaved changes. Do you want to duplicate the original invoice or save changes first?\n\n' +
          'Click "OK" to duplicate the original invoice (current changes will be lost)\n' +
          'Click "Cancel" to save changes first'
        );
        
        if (!shouldProceed) {
          return; // User wants to save changes first
        }
      }

      setSaving(true);
      
      if (!invoice) {
        throw new Error('No invoice data available');
      }

      // Prepare duplicate data - use original invoice data, not current form data
      const duplicateData = {
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        client_phone: invoice.client_phone,
        service_type: invoice.service_type,
        service_description: invoice.service_description,
        amount: invoice.amount.toString(),
        payment_terms: invoice.payment_terms,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'draft', // Always create duplicates as draft
        payment_status: 'pending'
      };

      // Create duplicate via API
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicateData),
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate invoice');
      }

      const result = await response.json();
      console.log('Invoice duplicated:', result);
      
      // Redirect to edit the duplicated invoice
      router.push(`/admin/invoices/${result.id}/edit`);
    } catch (error) {
      console.error('Failed to duplicate invoice:', error);
      alert('Failed to duplicate invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
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
          <h3>Unable to Load Invoice</h3>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" size="sm" onClick={() => router.push('/admin/invoices')}>
              Back to Invoices
            </Button>
            <Button variant="primary" size="sm" onClick={fetchInvoice}>
              <i className="fas fa-refresh"></i>
              Try Again
            </Button>
          </div>
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

  if (!invoice) {
    return (
      <Card>
        <div className="error-container">
          <i className="fas fa-file-times"></i>
          <h3>Invoice Not Found</h3>
          <p>The requested invoice could not be found.</p>
          <Button variant="primary" size="sm" onClick={() => router.push('/admin/invoices')}>
            Back to Invoices
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
    <div className="edit-invoice">
      <PageHeader
        title="Edit Invoice"
        subtitle={`Editing ${invoice.invoice_number}${hasFormChanges() ? ' • Unsaved changes' : ''}`}
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' },
          { label: 'Edit' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-copy"
              onClick={handleDuplicate}
              disabled={saving}
            >
              Duplicate
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        }
      />

      <Card>
        <div className="invoice-form-header">
          <div className="invoice-info">
            <h3>{invoice.invoice_number}</h3>
            <div className="invoice-meta">
              <span>Created: {new Date(invoice.created_at).toLocaleDateString('en-IN')}</span>
              <span>Current Amount: {formatCurrency(invoice.amount)}</span>
            </div>
          </div>
          <div className="status-badge">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="status-select"
              disabled={saving}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="invoice-form">
          <div className="form-section">
            <h4>Client Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Service Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="100"
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Payment Terms (Days)</label>
                <select
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                  disabled={saving}
                >
                  <option value="0">Due on Receipt</option>
                  <option value="15">Net 15</option>
                  <option value="30">Net 30</option>
                  <option value="45">Net 45</option>
                  <option value="60">Net 60</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Description</h4>
            <div className="form-group full-width">
              <label>Service Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of services provided..."
                rows={4}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Invoice Summary</h4>
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{(parseFloat(formData.amount) || 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{((parseFloat(formData.amount) || 0) * 0.18).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {hasFormChanges() && (
            <div className="unsaved-changes-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <span>You have unsaved changes</span>
            </div>
          )}

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={saving}
              icon={saving ? "fas fa-spinner fa-spin" : "fas fa-save"}
            >
              {saving ? 'Updating...' : 'Update Invoice'}
            </Button>
          </div>
        </form>
      </Card>

      <style jsx>{`
        .edit-invoice {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .invoice-form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .invoice-info h3 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .invoice-meta {
          display: flex;
          gap: 1.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .status-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .invoice-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .form-section h4 {
          margin: 0 0 1.5rem 0;
          color: #0ea5e9;
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(14, 165, 233, 0.2);
          padding-bottom: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
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

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .invoice-summary {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 400px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          color: #e2e8f0;
          font-size: 0.875rem;
        }

        .summary-row.total {
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-weight: 600;
          font-size: 1rem;
          color: #0ea5e9;
        }

        .unsaved-changes-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 0.875rem;
          margin: 1rem 0;
        }

        .unsaved-changes-warning i {
          color: #ef4444;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .edit-invoice {
            padding: 1rem;
          }

          .invoice-form-header {
            flex-direction: column;
            gap: 1rem;
          }

          .invoice-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .invoice-form {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
}
