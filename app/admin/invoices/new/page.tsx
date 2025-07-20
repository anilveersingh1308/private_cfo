'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader
} from '@/components/admin/AdminComponents';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: '',
    amount: '',
    description: '',
    dueDate: '',
    paymentTerms: '30'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.clientName.trim()) {
      alert('Please enter client name');
      return;
    }
    if (!formData.clientEmail.trim()) {
      alert('Please enter client email');
      return;
    }
    if (!formData.serviceType) {
      alert('Please select service type');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!formData.dueDate) {
      alert('Please select due date');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare the invoice data
      const invoiceData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        service_type: formData.serviceType,
        service_description: formData.description,
        amount: formData.amount,
        payment_terms: formData.paymentTerms,
        due_date: formData.dueDate,
        status: 'sent',
        payment_status: 'pending'
      };

      // Submit to API
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const result = await response.json();
      console.log('Invoice created:', result);
      
      // Redirect to invoices list
      router.push('/admin/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Validate required fields (less strict for drafts)
    if (!formData.clientName.trim()) {
      alert('Please enter client name to save draft');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare the invoice data
      const invoiceData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        service_type: formData.serviceType,
        service_description: formData.description,
        amount: formData.amount || '0',
        payment_terms: formData.paymentTerms,
        due_date: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        payment_status: 'pending'
      };

      // Submit to API
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      const result = await response.json();
      console.log('Draft saved:', result);
      
      // Redirect to invoices list
      router.push('/admin/invoices');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const tax = amount * 0.18; // 18% GST
    return amount + tax;
  };

  return (
    <div className="new-invoice-page">
      <PageHeader
        title="Generate Invoice"
        subtitle="Create a new invoice for client services"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' },
          { label: 'New Invoice' }
        ]}
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i>
            Back
          </Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="invoice-form">
            <div className="form-section">
              <h3>Client Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="clientName">Client Name *</label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clientEmail">Email Address *</label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="client@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clientPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Service Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount (₹) *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="paymentTerms">Payment Terms (Days)</label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                  >
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">Service Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the services provided..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Invoice Summary</h3>
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

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                size="md"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="md"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="md"
                disabled={loading}
                icon={loading ? "fas fa-spinner fa-spin" : "fas fa-file-invoice"}
              >
                {loading ? 'Generating...' : 'Generate Invoice'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <style jsx>{`
        .new-invoice-page {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .invoice-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          color: #f8fafc;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .new-invoice-page {
            padding: 1rem;
          }

          .invoice-form {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
