'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LegacyInvoiceRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const redirectToNewRoute = async () => {
      try {
        // Fetch the redirect information for this ID
        const response = await fetch(`/api/dashboard/invoices/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Check if this is an actual invoice or redirect info
          if (data.invoice_number) {
            // Redirect to the new invoice number-based route
            router.replace(`/dashboard/invoices/${data.invoice_number}`);
          } else {
            // If not found, redirect to invoices list
            router.replace('/dashboard/invoices');
          }
        } else {
          // If not found, redirect to invoices list
          router.replace('/dashboard/invoices');
        }
      } catch (error) {
        console.error('Error redirecting:', error);
        // Fallback to invoices list
        router.replace('/dashboard/invoices');
      }
    };

    if (id) {
      redirectToNewRoute();
    }
  }, [id, router]);

  return (
    <div className="redirect-container">
      <div className="redirect-content">
        <i className="fas fa-spinner fa-spin"></i>
        <h3>Redirecting...</h3>
        <p>The invoice system has been updated. You're being redirected to the new interface.</p>
      </div>
      <style jsx>{`
        .redirect-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        .redirect-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem;
          text-align: center;
          color: #f8fafc;
        }
        .redirect-content i {
          font-size: 3rem;
          color: #0ea5e9;
        }
        .redirect-content h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .redirect-content p {
          margin: 0;
          color: #94a3b8;
          max-width: 400px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
