type PaymentDetails = {
  paymentId?: string;
  invoiceNumber?: string;
  consultant?: string;
  amount?: string | number;
  status?: string;
  paymentMethod?: string;
  paymentType?: string;
  transactionId?: string;
  paymentDate?: string;
  notes?: string;
};
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, PageHeader, Button } from '@/components/dashboard/DashboardComponents';

export default function PaymentViewPage() {
  const params = useParams();
  const paymentId = params?.id;
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayment() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/payments/${paymentId}`);
        if (!res.ok) throw new Error('Failed to fetch payment');
        const data = await res.json();
        setPayment(data);
      } catch (err) {
        setError('Failed to fetch payment');
      } finally {
        setLoading(false);
      }
    }
    if (paymentId) fetchPayment();
  }, [paymentId]);

  return (
    <div className="payment-view-page">
      <PageHeader
        title={payment ? `Payment #${paymentId}` : 'Payment Details'}
        subtitle={payment ? `Details for payment record` : ''}
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Payments', href: '/dashboard/payments' },
          { label: `View Payment #${paymentId}` }
        ]}
      />
      <Card>
        {loading ? (
          <div className="loading">Loading payment...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : payment ? (
          <div className="payment-details">
            <h3 style={{ marginBottom: '1rem', color: '#0ea5e9' }}>Payment Details</h3>
            <div className="details-grid">
              <div><span className="label">Payment ID:</span> <span className="value">{payment.paymentId || '-'}</span></div>
              <div>
                <span className="label">Invoice #:</span>
                {payment.invoiceNumber ? (
                  <a
                    href={`/dashboard/invoices/${payment.invoiceNumber}`}
                    style={{ color: '#f59e42', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {payment.invoiceNumber}
                    <i className="fas fa-external-link-alt" style={{ fontSize: '1rem', color: '#f59e42' }}></i>
                  </a>
                ) : (
                  <span className="value">-</span>
                )}
              </div>
              <div><span className="label">Consultant:</span> <span className="value">{payment.consultant || '-'}</span></div>
              <div><span className="label">Amount:</span> <span className="value">₹{Number(payment.amount).toLocaleString()}</span></div>
              <div><span className="label">Status:</span> <span className={`badge ${payment.status}`}>{payment.status || '-'}</span></div>
              <div><span className="label">Mode of Payment:</span> <span className="value">{payment.paymentMethod || '-'}</span></div>
              <div><span className="label">Type of Payment:</span> <span className="value">{payment.paymentType || '-'}</span></div>
              <div><span className="label">Transaction ID:</span> <span className="value">{payment.transactionId || '-'}</span></div>
              <div><span className="label">Payment Date:</span> <span className="value">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : '-'}</span></div>
              <div><span className="label">Notes:</span> <span className="value">{payment.notes || '-'}</span></div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" size="md" icon="fas fa-arrow-left" onClick={() => window.location.href = '/dashboard/payments'}>Back to Payments</Button>
              <Button variant="primary" size="md" icon="fas fa-edit" onClick={() => window.location.href = `/dashboard/payments/edit/${paymentId}`}>Edit Payment</Button>
            </div>
          </div>
        ) : null}
      </Card>
      <style jsx>{`
        .payment-details {
          padding: 1.5rem 1rem;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 2rem;
          background: rgba(30,41,59,0.08);
          border-radius: 12px;
          padding: 1.25rem 1rem;
          box-shadow: 0 2px 12px rgba(14,165,233,0.07);
          margin-bottom: 1.5rem;
        }
        .label {
          font-weight: 600;
          color: #0ea5e9;
          margin-right: 0.5rem;
        }
        .value {
          color: #f8fafc;
        }
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          background: #334155;
          color: #f8fafc;
          margin-left: 0.5rem;
        }
        .badge.paid {
          background: #22c55e;
          color: #fff;
        }
        .badge.failed {
          background: #ef4444;
          color: #fff;
        }
        .badge.pending {
          background: #f59e42;
          color: #fff;
        }
        .loading {
          color: #0ea5e9;
          text-align: center;
          font-weight: 500;
          margin-top: 1rem;
        }
        .error {
          color: #ef4444;
          text-align: center;
          font-weight: 500;
          margin-top: 1rem;
        }
        @media (max-width: 600px) {
          .details-grid {
            grid-template-columns: 1fr;
            padding: 1rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
