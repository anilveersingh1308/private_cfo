'use client';


import { useState, useEffect } from 'react';
import { Card, PageHeader, Table, Button } from '@/components/dashboard/DashboardComponents';

interface PaymentRecord {
  id: number;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentType: string;
  reference: string;
  notes: string;
  paidDate?: string;
  dueDate: string;
  consultantName?: string;
  paymentId?: string;
}

export default function PaymentsRecordPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filter states
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      // Ensure paymentId is mapped from API data
      const mapped = data.map((p: any) => ({
        ...p,
        paymentId: p.paymentId || p.payment_id || '-',
      }));
      setPayments(mapped);
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'paymentId', title: 'Payment #' },
    { key: 'invoiceNumber', title: 'Invoice #' },
    { key: 'clientName', title: 'Client/User Name' },
    { key: 'amount', title: 'Amount', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'status', title: 'Status', render: (value: string) => <span className={`badge ${value}`}>{value}</span> },
    { key: 'paymentMethod', title: 'Method' },
    { key: 'paymentType', title: 'Type' },
    { key: 'reference', title: 'Reference' },
    { key: 'paidDate', title: 'Paid Date', render: (value: string) => value ? new Date(value).toLocaleDateString() : '-' },
    { key: 'dueDate', title: 'Due Date', render: (value: string) => value ? (isNaN(Date.parse(value)) ? '-' : new Date(value).toLocaleDateString()) : '-' },
  ];

  // Filtered payments
  const filteredPayments = payments.filter((p: PaymentRecord) => {
    return (
      (!filterClient || p.clientName?.toLowerCase().includes(filterClient.toLowerCase())) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterMethod || p.paymentMethod === filterMethod) &&
      (!filterType || p.paymentType === filterType)
    );
  });

  return (
    <div className="payments-record-page">
      <PageHeader
        title="Payments Record"
        subtitle="Track all payment transactions and invoice statuses"
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Payments' }]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              icon="fas fa-plus"
              onClick={() => {
                window.location.href = '/dashboard/payments/new';
              }}
            >
              New Payment
            </Button>
            <Button variant="secondary" size="sm" icon="fas fa-download">
              Export CSV
            </Button>
          </div>
        }
      />
      {/* Filters Section */}
        <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Filter by Client"
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 8, minWidth: 160 }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 8, minWidth: 140 }}
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
            <option value="Refunded">Refunded</option>
          </select>
          <select
            value={filterMethod}
            onChange={e => setFilterMethod(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 8, minWidth: 140 }}
          >
            <option value="">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 8, minWidth: 140 }}
          >
            <option value="">All Types</option>
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
            <option value="Advance">Advance</option>
            <option value="Refund">Refund</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredPayments}
            onRowClick={row => {
              if (row && row.id) {
                window.location.href = `/dashboard/payments/${row.id}`;
              }
            }}
          />
        )}
      <style jsx>{`
        .payments-record-page {
          padding: 2rem;
          min-height: 100vh;
        }
        .loading {
          color: #0ea5e9;
          padding: 2rem;
          text-align: center;
        }
        .error {
          color: #ef4444;
          padding: 2rem;
          text-align: center;
        }
        .filters input, .filters select {
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #334155;
        }
        .filters input:focus, .filters select:focus {
          outline: none;
          border-color: #0ea5e9;
        }
      `}</style>
    </div>
  );
}
