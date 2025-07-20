'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Consultation {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  occupation: string;
  age?: string;
  guidance?: string;
  industry?: string;
  income?: string;
  message?: string;
  status: string;
  priority: string;
  scheduled_date?: string;
  consultation_fee?: number;
  client_satisfaction_rating?: number;
  advisor_notes?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  assigned_advisor?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    specialization?: string;
  };
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
      return;
    }
    
    if (!authLoading && user) {
      fetchConsultations();
    }
  }, [authLoading, user, filters]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      
      const response = await fetch(`/api/consultations?${params.toString()}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        let filteredConsultations = data.consultations;
        
        // Apply search filter on client side
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredConsultations = filteredConsultations.filter((consultation: Consultation) =>
            consultation.name.toLowerCase().includes(searchLower) ||
            consultation.email.toLowerCase().includes(searchLower) ||
            consultation.phone.includes(filters.search) ||
            consultation.city.toLowerCase().includes(searchLower)
          );
        }
        
        setConsultations(filteredConsultations);
      } else {
        setError('Failed to fetch consultations');
      }
    } catch (error) {
      setError('Error loading consultations');
    } finally {
      setLoading(false);
    }
  };

  const updateConsultation = async (consultationId: number, updateData: any) => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId, ...updateData }),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchConsultations(); // Refresh the list
        setShowUpdateModal(false);
        setSelectedConsultation(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update consultation');
      }
    } catch (error) {
      alert('Error updating consultation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'assigned': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchConsultations}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
              <p className="mt-2 text-gray-600">
                Manage your assigned consultations and track progress
              </p>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, phone, or city..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', search: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {consultations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {consultation.city} • {consultation.occupation}
                          </div>
                          {consultation.industry && (
                            <div className="text-xs text-gray-400">
                              {consultation.industry}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.email}</div>
                        <div className="text-sm text-gray-500">{consultation.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                            {consultation.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(consultation.priority)}`}>
                            {consultation.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {consultation.scheduled_date && (
                            <div className="text-xs text-gray-500">
                              Scheduled: {new Date(consultation.scheduled_date).toLocaleDateString()}
                            </div>
                          )}
                          {consultation.client_satisfaction_rating && (
                            <div className="text-xs text-yellow-600">
                              Rating: {consultation.client_satisfaction_rating}/5
                            </div>
                          )}
                          {consultation.follow_up_required && (
                            <div className="text-xs text-blue-600">
                              Follow-up required
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowUpdateModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            // Add functionality to view consultation details
                            alert('View details functionality to be implemented');
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No consultations found</p>
            </div>
          )}
        </div>

        {/* Update Modal */}
        {showUpdateModal && selectedConsultation && (
          <UpdateConsultationModal
            consultation={selectedConsultation}
            onUpdate={updateConsultation}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedConsultation(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Update Consultation Modal Component
function UpdateConsultationModal({ 
  consultation, 
  onUpdate, 
  onClose 
}: {
  consultation: Consultation;
  onUpdate: (id: number, data: any) => void;
  onClose: () => void;
}) {
  const [updateData, setUpdateData] = useState({
    status: consultation.status,
    priority: consultation.priority,
    scheduled_date: consultation.scheduled_date?.split('T')[0] || '',
    consultation_fee: consultation.consultation_fee || '',
    advisor_notes: consultation.advisor_notes || '',
    client_satisfaction_rating: consultation.client_satisfaction_rating || '',
    follow_up_required: consultation.follow_up_required,
    follow_up_date: consultation.follow_up_date?.split('T')[0] || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatePayload: any = {
      status: updateData.status,
      priority: updateData.priority,
      advisor_notes: updateData.advisor_notes,
      follow_up_required: updateData.follow_up_required,
    };

    if (updateData.scheduled_date) {
      updatePayload.scheduled_date = new Date(updateData.scheduled_date).toISOString();
    }

    if (updateData.consultation_fee) {
      updatePayload.consultation_fee = parseFloat(updateData.consultation_fee as string);
    }

    if (updateData.client_satisfaction_rating) {
      updatePayload.client_satisfaction_rating = parseInt(updateData.client_satisfaction_rating as string);
    }

    if (updateData.follow_up_date) {
      updatePayload.follow_up_date = new Date(updateData.follow_up_date).toISOString();
    }

    onUpdate(consultation.id, updatePayload);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Update Consultation - {consultation.name}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={updateData.priority}
              onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
            <input
              type="date"
              value={updateData.scheduled_date}
              onChange={(e) => setUpdateData({ ...updateData, scheduled_date: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
            <input
              type="number"
              step="0.01"
              value={updateData.consultation_fee}
              onChange={(e) => setUpdateData({ ...updateData, consultation_fee: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Rating (1-5)</label>
            <select
              value={updateData.client_satisfaction_rating}
              onChange={(e) => setUpdateData({ ...updateData, client_satisfaction_rating: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Not rated</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Advisor Notes</label>
            <textarea
              value={updateData.advisor_notes}
              onChange={(e) => setUpdateData({ ...updateData, advisor_notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Add notes about the consultation..."
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={updateData.follow_up_required}
                onChange={(e) => setUpdateData({ ...updateData, follow_up_required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
              <span className="ml-2 text-sm text-gray-700">Follow-up required</span>
            </label>
          </div>

          {updateData.follow_up_required && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
              <input
                type="date"
                value={updateData.follow_up_date}
                onChange={(e) => setUpdateData({ ...updateData, follow_up_date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
