'use client';

import { useState, useEffect } from 'react';

interface Consultation {
  id: number;
  name: string;
  phone: string;
  country_code: string;
  email: string;
  city: string;
  occupation: string;
  age?: string;
  guidance?: string;
  industry?: string;
  income?: string;
  preferred_communication?: string;
  consultation_timing?: string;
  message?: string;
  privacy: boolean;
  not_job: boolean;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultation');
      const result = await response.json();
      
      if (response.ok) {
        setConsultations(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Consultation Submissions</h1>
      <p>Total submissions: {consultations.length}</p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>City</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Occupation</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Submitted</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.id}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{consultation.id}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{consultation.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{consultation.email}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  {consultation.country_code && consultation.phone ? 
                    `${consultation.phone}` : 
                    consultation.phone
                  }
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{consultation.city}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{consultation.occupation}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  {new Date(consultation.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  <details>
                    <summary style={{ cursor: 'pointer' }}>View More</summary>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
                      {consultation.age && <p><strong>Age:</strong> {consultation.age}</p>}
                      {consultation.guidance && <p><strong>Guidance:</strong> {consultation.guidance}</p>}
                      {consultation.industry && <p><strong>Industry:</strong> {consultation.industry}</p>}
                      {consultation.income && <p><strong>Income:</strong> {consultation.income}</p>}
                      {consultation.preferred_communication && (
                        <p><strong>Preferred Communication:</strong> {consultation.preferred_communication}</p>
                      )}
                      {consultation.consultation_timing && (
                        <p><strong>Timing:</strong> {consultation.consultation_timing}</p>
                      )}
                      {consultation.message && <p><strong>Message:</strong> {consultation.message}</p>}
                      <p><strong>Marketing Consent:</strong> {consultation.marketing_consent ? 'Yes' : 'No'}</p>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
