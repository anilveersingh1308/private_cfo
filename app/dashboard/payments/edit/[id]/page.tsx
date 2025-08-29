
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, PageHeader, Button } from '@/components/dashboard/DashboardComponents';

// Reuse the same UI and logic as the new payment page
export default function EditPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params?.id;
  const [invoices, setInvoices] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultantLoading, setConsultantLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    paymentId: '',
    invoiceId: '',
    consultantId: '',
    paymentAmount: '',
    paymentMethod: '',
    paymentType: '',
    reference: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch invoices and consultants for dropdowns
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/invoices');
        if (!res.ok) throw new Error('Failed to fetch invoices');
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        setError('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    const fetchConsultants = async () => {
      setConsultantLoading(true);
      try {
        const res = await fetch('/api/dashboard/consultants');
        if (!res.ok) throw new Error('Failed to fetch consultants');
        const result = await res.json();
        if (result && Array.isArray(result.data)) {
          setConsultants(result.data);
        } else {
          setConsultants([]);
        }
      } catch (err) {
        setError('Failed to fetch consultants');
        setConsultants([]);
      } finally {
        setConsultantLoading(false);
      }
    };
    fetchInvoices();
    fetchConsultants();
  }, []);

  useEffect(() => {
    // Fetch payment details for editing
    async function fetchPayment() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/payments/${paymentId}`);
        if (!res.ok) throw new Error('Failed to fetch payment');
        const data = await res.json();
        // Find invoice by invoiceNumber
        let invoiceId = '';
        if (data.invoiceNumber && invoices.length > 0) {
          const invoice = invoices.find(inv => inv.invoice_number === data.invoiceNumber);
          if (invoice) invoiceId = String(invoice.id);
        }
        // Find consultant by name
        let consultantId = '';
        if (data.consultant && consultants.length > 0) {
          const consultant = consultants.find(c => c.name === data.consultant);
          if (consultant) consultantId = String(consultant.id);
        }
        setForm({
          paymentId: data.paymentId || data.payment_id || '',
          invoiceId,
          consultantId,
          paymentAmount: data.amount || '',
          paymentMethod: data.paymentMethod || '',
          paymentType: data.paymentType || '',
          reference: data.transactionId || '',
          notes: data.notes || ''
        });
      } catch (err) {
        setError('Failed to fetch payment');
      } finally {
        setLoading(false);
      }
    }
    if (paymentId) fetchPayment();
  }, [paymentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'paymentType' && value === 'Full') {
      const invoiceAmount = getInvoiceAmount();
      setForm(f => ({
        ...f,
        paymentType: value,
        paymentAmount: invoiceAmount !== null ? String(invoiceAmount) : ''
      }));
    } else if (name === 'paymentType') {
      setForm(f => ({ ...f, paymentType: value }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const getInvoiceAmount = () => {
    const selected = invoices.find(inv => String(inv.id) === String(form.invoiceId));
    return selected ? Number(selected.total_amount) : null;
  };

  const validateForm = () => {
    const invoiceAmount = getInvoiceAmount();
    const paymentAmount = Number(form.paymentAmount);
    if (!form.invoiceId || !form.paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0 || !form.paymentMethod || !form.paymentType) {
      return false;
    }
    if (form.paymentType === 'Full') {
      if (invoiceAmount === null || paymentAmount !== invoiceAmount) {
        return false;
      }
    } else {
      if (invoiceAmount !== null && paymentAmount > invoiceAmount) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceAmount = getInvoiceAmount();
    const paymentAmount = Number(form.paymentAmount);
    if (!form.invoiceId || !form.paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0 || !form.paymentMethod || !form.paymentType) {
      setError('Please fill all required fields and enter a valid amount.');
      return;
    }
    if (invoiceAmount !== null && paymentAmount > invoiceAmount) {
      setError('Payment amount cannot be greater than the invoice amount (₹' + invoiceAmount.toLocaleString() + ').');
      return;
    }
    setSubmitting(true);
    setSuccess(false);
    setError('');
    try {
      // Find the invoice number from the selected invoiceId
      const selectedInvoice = invoices.find(inv => String(inv.id) === String(form.invoiceId));
      const invoiceNumber = selectedInvoice ? selectedInvoice.invoice_number : '';
      // Find consultant name from consultantId
      const selectedConsultant = consultants.find(c => String(c.id) === String(form.consultantId));
      const consultantName = selectedConsultant ? selectedConsultant.name : '';
      const res = await fetch(`/api/dashboard/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber,
          consultant: consultantName,
          amount: form.paymentAmount,
          transactionId: form.reference,
          paymentDate: new Date().toISOString(),
          status: 'paid',
          notes: form.notes,
          metadata: {
            paymentMethod: form.paymentMethod,
            paymentType: form.paymentType
          }
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || 'Failed to update payment');
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/payments');
      }, 1200);
    } catch (err) {
      setError('Failed to update payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-payment-page">
      <PageHeader
        title="Edit Payment"
        subtitle="Update payment details"
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Payments', href: '/dashboard/payments' },
          { label: 'Edit Payment' }
        ]}
      />
      <Card>
        <div style={{marginBottom:'1rem',color:'#0ea5e9',fontWeight:600,fontSize:'1.08rem'}}>Payment ID: {form.paymentId || '-'}</div>
        <form onSubmit={handleSubmit} className="payment-form column-layout">
          <div className="form-section animate-fadein">
            <h4 className="section-title"><i className="fas fa-file-invoice" style={{marginRight:6}}></i>Invoice Details</h4>
            <label className="form-label">Select Invoice <span className="required">*</span></label>
            <select
              name="invoiceId"
              value={form.invoiceId}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            >
              <option value="">{loading ? 'Loading invoices...' : 'Select Invoice'}</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.client_name} (₹{parseFloat(inv.total_amount || '0').toLocaleString()})
                </option>
              ))}
            </select>
            <span className="helper-text">Choose the invoice for which payment is being recorded.</span>
          </div>

          <div className="form-section animate-fadein">
            <h4 className="section-title"><i className="fas fa-user-tie" style={{marginRight:6}}></i>Consultant</h4>
            <label className="form-label">Select Consultant</label>
            <select
              name="consultantId"
              value={form.consultantId}
              onChange={handleChange}
              disabled={consultantLoading}
              className="form-input"
            >
              <option value="">{consultantLoading ? 'Loading consultants...' : 'Select Consultant'}</option>
              {Array.isArray(consultants) && consultants.length > 0
                ? consultants.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))
                : null}
            </select>
            <span className="helper-text">(Optional) Choose the consultant associated with this payment.</span>
          </div>

          <div className="form-section animate-fadein">
            <h4 className="section-title"><i className="fas fa-credit-card" style={{marginRight:6}}></i>Payment Details</h4>

            <label className="form-label">Payment Amount <span className="required">*</span></label>
            <input
              type="number"
              name="paymentAmount"
              min="0"
              step="0.01"
              placeholder={typeof getInvoiceAmount() === 'number' ? `Max: ₹${getInvoiceAmount()!.toLocaleString()}` : 'Enter payment amount'}
              value={form.paymentAmount}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="off"
              disabled={form.paymentType === 'Full'}
            />
            <span className="helper-text">
              {form.paymentType === 'Full'
                ? 'Amount is set to invoice total for full payment.'
                : 'Enter the amount paid for this invoice. Must not exceed invoice amount.'}
            </span>

            <label className="form-label">Mode of Payment <span className="required">*</span></label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select Mode</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
            <span className="helper-text">How was the payment made?</span>

            <label className="form-label">Type of Payment <span className="required">*</span></label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select Type</option>
              <option value="Full">Full</option>
              <option value="Partial">Partial</option>
              <option value="Advance">Advance</option>
              <option value="Refund">Refund</option>
              <option value="Other">Other</option>
            </select>
            <span className="helper-text">Specify the payment type.</span>

            <label className="form-label">Reference / Transaction ID</label>
            <input
              type="text"
              name="reference"
              placeholder="Reference / Transaction ID"
              value={form.reference}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
            <span className="helper-text">(Optional) Enter the transaction or reference ID for tracking.</span>
          </div>

          <div className="form-section animate-fadein">
            <h4 className="section-title"><i className="fas fa-comment-dots" style={{marginRight:6}}></i>Additional Notes</h4>
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
            <span className="helper-text">Add any remarks or comments about this payment.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon="fas fa-check"
            disabled={submitting || loading || !validateForm()}
          >
            {submitting ? 'Updating...' : 'Update Payment'}
          </Button>
          {success && <div className="success-msg"><i className="fas fa-check-circle"></i> Payment updated successfully!</div>}
          {error && <div className="error-msg"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
        </form>
      </Card>
      {/* Reuse the same styles as new payment page */}
      <style jsx>{`
        .new-payment-page {
        padding: 2rem;
        min-height: 100vh;
        }
        .payment-form,
        .column-layout {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        max-width: 480px;
        margin: 0 auto;
        }
        .form-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: rgba(30,41,59,0.10);
        border-radius: 14px;
        padding: 1.5rem 1rem 1.25rem 1rem;
        box-shadow: 0 4px 18px rgba(14,165,233,0.10);
        margin-bottom: 0.5rem;
        animation: fadein 0.7s;
        }
        .animate-fadein {
        animation: fadein 0.7s;
        }
        @keyframes fadein {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
        }
        .section-title {
        margin: 0 0 0.75rem 0;
        font-size: 1.12rem;
        color: #0ea5e9;
        font-weight: 700;
        display: flex;
        align-items: center;
        }
        .form-label {
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: #f8fafc;
        }
        .form-input {
        padding: 0.75rem;
        border-radius: 8px;
        border: 1.5px solid #334155;
        background: #0f172a;
        color: #f8fafc;
        font-size: 1rem;
        margin-bottom: 0.5rem;
        transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14,165,233,0.18);
        }
        .helper-text {
        font-size: 0.92rem;
        color: #94a3b8;
        margin-bottom: 0.5rem;
        margin-left: 2px;
        }
        .required {
        color: #ef4444;
        font-size: 1rem;
        }
        .success-msg {
        color: #22c55e;
        text-align: center;
        font-weight: 500;
        margin-top: 1rem;
        font-size: 1.08rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        }
        .error-msg {
        color: #ef4444;
        text-align: center;
        font-weight: 500;
        margin-top: 1rem;
        font-size: 1.08rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        }
        @media (max-width: 600px) {
        .payment-form,
        .column-layout {
          max-width: 100%;
          padding: 0 0.5rem;
        }
        .form-section {
          padding: 1rem 0.5rem;
        }
        .section-title {
          font-size: 1rem;
        }
        }
      `}</style>
    </div>
  );
}
