'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  Table,
  StatsCard 
} from '@/components/admin/AdminComponents';

interface Consultation {
  id: number;
  client_name: string;
  client_email: string;
  service_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'ongoing';
  scheduled_date: string;
  duration: number;
  notes?: string;
  amount: number;
  payment_status: 'paid' | 'pending' | 'failed';
  created_at: string;
  consultant?: string;
  meeting_link?: string;
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultantsLoading, setConsultantsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStatsType, setSelectedStatsType] = useState<string>('');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    service_type: '',
    status: 'scheduled' as Consultation['status'],
    scheduled_date: '',
    duration: '60',
    amount: '',
    payment_status: 'pending' as Consultation['payment_status'],
    consultant: '',
    meeting_link: '',
    notes: ''
  });

  useEffect(() => {
    fetchConsultations();
    fetchConsultants(); // Pre-load consultants when page loads
  }, [filterStatus, filterService]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterService !== 'all') params.append('service_type', filterService);
      
      const response = await fetch(`/api/admin/consultations?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch consultations');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch consultations');
      }
      
      // Transform API data to match interface
      const transformedData: Consultation[] = result.data.map((item: any) => ({
        id: item.id,
        client_name: item.client_name,
        client_email: item.client_email,
        service_type: item.service_type,
        status: item.status,
        scheduled_date: item.scheduled_date,
        duration: item.duration || 60,
        amount: parseFloat(item.amount || '0'),
        payment_status: item.payment_status,
        created_at: item.created_at,
        consultant: item.consultant,
        meeting_link: item.meeting_link,
        notes: item.notes
      }));
      
      setConsultations(transformedData);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    try {
      setConsultantsLoading(true);
      
      const response = await fetch('/api/admin/consultants');
      
      if (!response.ok) {
        throw new Error('Failed to fetch consultants');
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Fetched consultants:', result.data); // Debug log
        setConsultants(result.data);
      } else {
        console.error('Failed to fetch consultants:', result.error);
      }
    } catch (err) {
      console.error('Error fetching consultants:', err);
    } finally {
      setConsultantsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge variant="info" size="sm">Scheduled</Badge>;
      case 'completed': return <Badge variant="success" size="sm">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger" size="sm">Cancelled</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'ongoing': return <Badge variant="info" size="sm">Ongoing</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success" size="sm">Paid</Badge>;
      case 'pending': return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'failed': return <Badge variant="danger" size="sm">Failed</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Action handlers
  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowViewModal(true);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setFormData({
      client_name: consultation.client_name,
      client_email: consultation.client_email,
      service_type: consultation.service_type,
      status: consultation.status,
      scheduled_date: consultation.scheduled_date,
      duration: consultation.duration.toString(),
      amount: consultation.amount.toString(),
      payment_status: consultation.payment_status,
      consultant: consultation.consultant || '',
      meeting_link: consultation.meeting_link || '',
      notes: consultation.notes || ''
    });
    setShowEditModal(true);
    // Fetch consultants when modal opens
    fetchConsultants();
  };

  const handleScheduleNew = () => {
    setFormData({
      client_name: '',
      client_email: '',
      service_type: 'Financial Planning',
      status: 'scheduled',
      scheduled_date: '',
      duration: '60',
      amount: '5000',
      payment_status: 'pending',
      consultant: '',
      meeting_link: '',
      notes: ''
    });
    setShowScheduleModal(true);
    // Fetch consultants when modal opens
    console.log('Opening Schedule Modal, fetching consultants...');
    fetchConsultants();
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleAddNotes = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setFormData(prev => ({
      ...prev,
      notes: consultation.notes || ''
    }));
    setShowNotesModal(true);
  };

  const handleCreateConsultation = async () => {
    try {
      // Validate required fields
      if (!formData.client_name || !formData.client_email || !formData.service_type || 
          !formData.scheduled_date || !formData.amount || !formData.consultant) {
        alert('Please fill in all required fields including consultant selection.');
        return;
      }

      const response = await fetch('/api/admin/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: formData.client_name,
          client_email: formData.client_email,
          service_type: formData.service_type,
          scheduled_date: formData.scheduled_date,
          duration: parseInt(formData.duration) || 60,
          amount: parseFloat(formData.amount),
          consultant: formData.consultant,
          meeting_link: formData.meeting_link,
          notes: formData.notes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh consultations list
        await fetchConsultations();
        setShowScheduleModal(false);
        // Reset form
        setFormData({
          client_name: '',
          client_email: '',
          service_type: '',
          status: 'scheduled',
          scheduled_date: '',
          duration: '60',
          amount: '',
          payment_status: 'pending',
          consultant: '',
          meeting_link: '',
          notes: ''
        });
        console.log('Consultation created successfully:', result.data);
      } else {
        console.error('Failed to create consultation:', result.error);
      }
    } catch (error) {
      console.error('Failed to create consultation:', error);
    }
  };

  const handleUpdateConsultation = async () => {
    if (!selectedConsultation) return;
    
    try {
      const response = await fetch('/api/admin/consultations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedConsultation.id,
          client_name: formData.client_name,
          client_email: formData.client_email,
          service_type: formData.service_type,
          status: formData.status,
          scheduled_date: formData.scheduled_date,
          duration: parseInt(formData.duration) || 60,
          amount: parseFloat(formData.amount),
          payment_status: formData.payment_status,
          consultant: formData.consultant,
          meeting_link: formData.meeting_link,
          notes: formData.notes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh consultations list
        await fetchConsultations();
        setShowEditModal(false);
        console.log('Consultation updated successfully:', result.data);
      } else {
        console.error('Failed to update consultation:', result.error);
      }
    } catch (error) {
      console.error('Failed to update consultation:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedConsultation) return;
    
    try {
      const response = await fetch('/api/admin/consultations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedConsultation.id,
          client_name: selectedConsultation.client_name,
          client_email: selectedConsultation.client_email,
          service_type: selectedConsultation.service_type,
          status: selectedConsultation.status,
          scheduled_date: selectedConsultation.scheduled_date,
          duration: selectedConsultation.duration,
          amount: selectedConsultation.amount,
          payment_status: selectedConsultation.payment_status,
          consultant: selectedConsultation.consultant,
          meeting_link: selectedConsultation.meeting_link,
          notes: formData.notes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh consultations list
        await fetchConsultations();
        setShowNotesModal(false);
        console.log('Notes saved successfully for consultation:', selectedConsultation.id);
      } else {
        console.error('Failed to save notes:', result.error);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const handleStatsCardClick = (statsType: string) => {
    setSelectedStatsType(statsType);
    setShowStatsModal(true);
  };

  const handleExportData = () => {
    const csvContent = convertToCSV(filteredConsultations);
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: Consultation[]) => {
    const headers = ['ID', 'Client Name', 'Email', 'Service', 'Status', 'Date', 'Duration', 'Amount', 'Payment', 'Consultant'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.id,
        `"${item.client_name}"`,
        `"${item.client_email}"`,
        `"${item.service_type}"`,
        `"${item.status}"`,
        `"${new Date(item.scheduled_date).toISOString()}"`,
        item.duration,
        item.amount,
        `"${item.payment_status}"`,
        `"${item.consultant || 'Not assigned'}"`
      ].join(','))
    ].join('\n');
    return csvContent;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'amount' ? Number(value) : value
    }));
  };

  const getUpcomingConsultations = () => {
    const now = new Date();
    return consultations.filter(c => {
      const consultationDate = new Date(c.scheduled_date);
      return consultationDate > now && (c.status === 'scheduled' || c.status === 'pending');
    }).length;
  };

  const getTotalRevenue = () => {
    return consultations
      .filter(c => c.payment_status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const getCompletionRate = () => {
    const totalConsultations = consultations.length;
    if (totalConsultations === 0) return 0;
    
    const completedConsultations = consultations.filter(c => c.status === 'completed').length;
    return Math.round((completedConsultations / totalConsultations) * 100);
  };

  const getPendingRevenue = () => {
    return consultations
      .filter(c => c.payment_status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const getActiveConsultations = () => {
    return consultations.filter(c => c.status === 'ongoing').length;
  };

  const getConsultationsByStatus = () => {
    return {
      scheduled: consultations.filter(c => c.status === 'scheduled').length,
      completed: consultations.filter(c => c.status === 'completed').length,
      ongoing: consultations.filter(c => c.status === 'ongoing').length,
      pending: consultations.filter(c => c.status === 'pending').length,
      cancelled: consultations.filter(c => c.status === 'cancelled').length
    };
  };

  const getRevenueByStatus = () => {
    return {
      paid: consultations.filter(c => c.payment_status === 'paid').reduce((sum, c) => sum + c.amount, 0),
      pending: consultations.filter(c => c.payment_status === 'pending').reduce((sum, c) => sum + c.amount, 0),
      failed: consultations.filter(c => c.payment_status === 'failed').reduce((sum, c) => sum + c.amount, 0)
    };
  };

  const getConsultationStats = () => {
    const total = consultations.length;
    const completed = consultations.filter(c => c.status === 'completed').length;
    const upcoming = getUpcomingConsultations();
    const revenue = getTotalRevenue();
    const completionRate = getCompletionRate();
    
    return {
      total,
      completed,
      upcoming,
      revenue,
      completionRate,
      pendingRevenue: getPendingRevenue(),
      activeConsultations: getActiveConsultations()
    };
  };

  // Filter logic
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.service_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus;
    const matchesService = filterService === 'all' || consultation.service_type === filterService;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const consultationDate = new Date(consultation.scheduled_date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = consultationDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = consultationDate >= now && consultationDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesDate = consultationDate >= now && consultationDate <= monthFromNow;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const consultationColumns = [
    {
      key: 'client_name',
      title: 'Client',
      render: (value: string, row: Consultation) => (
        <div>
          <div style={{ fontWeight: '600', color: '#f8fafc' }}>{value}</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{row.client_email}</div>
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
      key: 'consultant',
      title: 'Consultant',
      render: (value: string) => (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{value || 'Not assigned'}</span>
      ),
      width: '120px'
    },
    {
      key: 'scheduled_date',
      title: 'Date & Time',
      render: (value: string) => (
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{formatDate(value)}</span>
      ),
      width: '140px'
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (value: number) => (
        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{value} min</span>
      ),
      width: '80px'
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>
          {formatCurrency(value)}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => getStatusBadge(value),
      width: '100px'
    },
    {
      key: 'payment_status',
      title: 'Payment',
      render: (value: string) => getPaymentBadge(value),
      width: '100px'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: Consultation) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-eye"
            onClick={() => handleViewConsultation(row)}
          >
            View
          </Button>
          {row.meeting_link && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon="fas fa-video"
              onClick={() => handleJoinMeeting(row.meeting_link!)}
            >
              Join
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-edit"
            onClick={() => handleEditConsultation(row)}
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon="fas fa-sticky-note"
            onClick={() => handleAddNotes(row)}
          >
            Notes
          </Button>
        </div>
      ),
      width: '220px'
    }
  ];

  const serviceTypes = [...new Set(consultations.map(c => c.service_type))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading consultations...</span>
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
          <span>{error}</span>
          <Button variant="primary" size="sm" onClick={fetchConsultations}>
            Retry
          </Button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
            color: #ef4444;
            text-align: center;
          }
          .error-container i {
            font-size: 3rem;
          }
        `}</style>
      </Card>
    );
  }

  return (
    <div className="admin-consultations">
      <PageHeader
        title="Consultation Management"
        subtitle={`Track and manage all consultation sessions` }
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Consultations' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {consultants.length > 0 && (
              <span style={{ 
                color: '#10b981', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <i className="fas fa-users" style={{ fontSize: '0.75rem' }}></i>
                {consultants.length} Active Consultant{consultants.length !== 1 ? 's' : ''}
              </span>
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-calendar-plus"
              onClick={handleScheduleNew}
            >
              Schedule New
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon="fas fa-download"
              onClick={handleExportData}
            >
              Export Data
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <div onClick={() => handleStatsCardClick('total')} className="stats-card-clickable">
          <StatsCard
            title="Total Consultations"
            value={consultations.length.toString()}
            icon="fas fa-calendar-check"
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
        </div>
        <div onClick={() => handleStatsCardClick('upcoming')} className="stats-card-clickable">
          <StatsCard
            title="Upcoming Sessions"
            value={getUpcomingConsultations().toString()}
            icon="fas fa-clock"
            color="orange"
          />
        </div>
        <div onClick={() => handleStatsCardClick('completion')} className="stats-card-clickable">
          <StatsCard
            title="Completion Rate"
            value={`${getCompletionRate()}%`}
            icon="fas fa-chart-line"
            trend={{ value: 5, isPositive: true }}
            color="green"
          />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="stats-grid secondary-stats">
        <div className="stat-summary">
          <div className="stat-item" onClick={() => handleStatsCardClick('active')}>
            <span className="stat-label">Active Sessions</span>
            <span className="stat-value">{getActiveConsultations()}</span>
          </div>
          <div className="stat-item" onClick={() => handleStatsCardClick('pending-revenue')}>
            <span className="stat-label">Pending Revenue</span>
            <span className="stat-value">{formatCurrency(getPendingRevenue())}</span>
          </div>
          <div className="stat-item" onClick={() => handleStatsCardClick('cancelled')}>
            <span className="stat-label">Cancelled</span>
            <span className="stat-value">{getConsultationsByStatus().cancelled}</span>
          </div>
          <div className="stat-item" onClick={() => handleStatsCardClick('success-rate')}>
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{consultations.length > 0 ? Math.round(((consultations.filter(c => c.status === 'completed').length) / consultations.length) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search consultations..."
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
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>
      </Card>

      {/* Consultations Table */}
      <Table
        columns={consultationColumns}
        data={filteredConsultations}
        loading={loading}
        onRowClick={(consultation) => handleViewConsultation(consultation)}
      />

      {/* View Consultation Modal */}
      {showViewModal && selectedConsultation && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Consultation Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="consultation-header">
                <div className="consultation-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="consultation-info">
                  <h4>{selectedConsultation.client_name}</h4>
                  <p>{selectedConsultation.client_email}</p>
                  <div className="consultation-badges">
                    {getStatusBadge(selectedConsultation.status)}
                    {getPaymentBadge(selectedConsultation.payment_status)}
                    <Badge variant="info" size="sm">{selectedConsultation.service_type}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>Consultation ID</label>
                  <span>#{selectedConsultation.id}</span>
                </div>
                <div className="detail-item">
                  <label>Service Type</label>
                  <span>{selectedConsultation.service_type}</span>
                </div>
                <div className="detail-item">
                  <label>Consultant</label>
                  <span>{selectedConsultation.consultant || 'Not assigned'}</span>
                </div>
                <div className="detail-item">
                  <label>Scheduled Date</label>
                  <span>{formatDate(selectedConsultation.scheduled_date)}</span>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <span>{selectedConsultation.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <span>{formatCurrency(selectedConsultation.amount)}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span>{selectedConsultation.status}</span>
                </div>
                <div className="detail-item">
                  <label>Payment Status</label>
                  <span>{selectedConsultation.payment_status}</span>
                </div>
              </div>

              {selectedConsultation.meeting_link && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                  <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-video" style={{ marginRight: '0.5rem', color: '#0ea5e9' }}></i>
                    Meeting Link
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {selectedConsultation.meeting_link}
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon="fas fa-external-link-alt"
                    onClick={() => handleJoinMeeting(selectedConsultation.meeting_link!)}
                  >
                    Join Meeting
                  </Button>
                </div>
              )}

              {selectedConsultation.notes && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#f8fafc', marginBottom: '1rem', fontSize: '1rem' }}>
                    <i className="fas fa-sticky-note" style={{ marginRight: '0.5rem', color: '#0ea5e9' }}></i>
                    Notes
                  </h4>
                  <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <p style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                      {selectedConsultation.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowViewModal(false);
                handleEditConsultation(selectedConsultation);
              }}>
                Edit Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule New Consultation Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Consultation</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
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
                  />
                </div>
                <div className="form-group">
                  <label>Client Email *</label>
                  <input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleInputChange}
                    placeholder="client@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Service Type *</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Tax Consulting">Tax Consulting</option>
                    <option value="Investment Advice">Investment Advice</option>
                    <option value="Retirement Planning">Retirement Planning</option>
                    <option value="Business Consulting">Business Consulting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Consultant *</label>
                  <select
                    name="consultant"
                    value={formData.consultant}
                    onChange={handleInputChange}
                    disabled={consultantsLoading}
                    className="consultant-select"
                    required
                  >
                    <option value="">
                      {consultantsLoading ? 'Loading consultants...' : `Select Consultant (${consultants.length} available)`}
                    </option>
                    {consultants.map(consultant => (
                      <option key={consultant.id} value={consultant.name}>
                        {consultant.name} • Active: {consultant.stats.active} • Upcoming: {consultant.stats.upcoming} • Total: {consultant.stats.total}
                      </option>
                    ))}
                  </select>
                  {consultants.length === 0 && !consultantsLoading && (
                    <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      ⚠️ No active consultants found. Please add consultant users first.
                    </small>
                  )}
                  {consultantsLoading && (
                    <small style={{ color: '#0ea5e9', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      🔄 Loading consultant data...
                    </small>
                  )}
                  {formData.consultant && consultants.length > 0 && (
                    <div className="consultant-info">
                      {(() => {
                        const selectedConsultant = consultants.find(c => c.name === formData.consultant);
                        if (selectedConsultant) {
                          return (
                            <div className="consultant-stats">
                              <small>
                                <strong>{selectedConsultant.name}</strong> - 
                                Active: <span className="stat-badge active">{selectedConsultant.stats.active}</span>
                                Upcoming: <span className="stat-badge upcoming">{selectedConsultant.stats.upcoming}</span>
                                Completed: <span className="stat-badge completed">{selectedConsultant.stats.completed}</span>
                                Total: <span className="stat-badge total">{selectedConsultant.stats.total}</span>
                              </small>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select
                    name="duration"
                    value={formData.duration.toString()}
                    onChange={handleInputChange}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="5000"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Meeting Link</label>
                  <input
                    type="url"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleInputChange}
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Initial Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any initial notes or special requirements..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateConsultation}>
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Consultation Modal */}
      {showEditModal && selectedConsultation && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Consultation</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client Email *</label>
                  <input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                  >
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Tax Consulting">Tax Consulting</option>
                    <option value="Investment Advice">Investment Advice</option>
                    <option value="Retirement Planning">Retirement Planning</option>
                    <option value="Business Consulting">Business Consulting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Consultant *</label>
                  <select
                    name="consultant"
                    value={formData.consultant}
                    onChange={handleInputChange}
                    disabled={consultantsLoading}
                    className="consultant-select"
                    required
                  >
                    <option value="">
                      {consultantsLoading ? 'Loading consultants...' : `Select Consultant (${consultants.length} available)`}
                    </option>
                    {consultants.map(consultant => (
                      <option key={consultant.id} value={consultant.name}>
                        {consultant.name} • Active: {consultant.stats.active} • Upcoming: {consultant.stats.upcoming} • Total: {consultant.stats.total}
                      </option>
                    ))}
                  </select>
                  {consultants.length === 0 && !consultantsLoading && (
                    <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      ⚠️ No active consultants found. Please add consultant users first.
                    </small>
                  )}
                  {consultantsLoading && (
                    <small style={{ color: '#0ea5e9', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      🔄 Loading consultant data...
                    </small>
                  )}
                  {formData.consultant && consultants.length > 0 && (
                    <div className="consultant-info">
                      {(() => {
                        const selectedConsultant = consultants.find(c => c.name === formData.consultant);
                        if (selectedConsultant) {
                          return (
                            <div className="consultant-stats">
                              <small>
                                <strong>{selectedConsultant.name}</strong> - 
                                Active: <span className="stat-badge active">{selectedConsultant.stats.active}</span>
                                Upcoming: <span className="stat-badge upcoming">{selectedConsultant.stats.upcoming}</span>
                                Completed: <span className="stat-badge completed">{selectedConsultant.stats.completed}</span>
                                Total: <span className="stat-badge total">{selectedConsultant.stats.total}</span>
                              </small>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select
                    name="duration"
                    value={formData.duration.toString()}
                    onChange={handleInputChange}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Meeting Link</label>
                  <input
                    type="url"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleInputChange}
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateConsultation}>
                Update Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedConsultation && (
        <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Consultation Notes</h3>
              <button className="modal-close" onClick={() => setShowNotesModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '1rem' }}>
                  {selectedConsultation.client_name} - {selectedConsultation.service_type}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                  {formatDate(selectedConsultation.scheduled_date)}
                </p>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add consultation notes, key discussion points, action items..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowNotesModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Details Modal */}
      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedStatsType === 'total' && 'Total Consultations Details'}
                {selectedStatsType === 'upcoming' && 'Upcoming Sessions Details'}
                {selectedStatsType === 'completion' && 'Completion Rate Analysis'}
                {selectedStatsType === 'revenue' && 'Revenue Breakdown'}
                {selectedStatsType === 'active' && 'Active Sessions Details'}
                {selectedStatsType === 'pending-revenue' && 'Pending Revenue Analysis'}
                {selectedStatsType === 'cancelled' && 'Cancelled Consultations'}
                {selectedStatsType === 'success-rate' && 'Success Rate Breakdown'}
              </h3>
              <button className="modal-close" onClick={() => setShowStatsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* Total Consultations Details */}
              {selectedStatsType === 'total' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Total Consultations: {consultations.length}</h4>
                      <p>Complete overview of all consultation sessions</p>
                    </div>
                  </div>
                  
                  <div className="breakdown-section">
                    <h4>Status Distribution</h4>
                    <div className="breakdown-grid">
                      <div className="breakdown-item">
                        <span className="breakdown-label">Scheduled</span>
                        <span className="breakdown-value">{getConsultationsByStatus().scheduled}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().scheduled / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Completed</span>
                        <span className="breakdown-value">{getConsultationsByStatus().completed}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().completed / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Ongoing</span>
                        <span className="breakdown-value">{getConsultationsByStatus().ongoing}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().ongoing / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Pending</span>
                        <span className="breakdown-value">{getConsultationsByStatus().pending}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().pending / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Cancelled</span>
                        <span className="breakdown-value">{getConsultationsByStatus().cancelled}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().cancelled / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="consultation-list">
                    <h4>Recent Consultations</h4>
                    <div className="consultation-items">
                      {consultations.slice(0, 5).map(consultation => (
                        <div key={consultation.id} className="consultation-item">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            {getStatusBadge(consultation.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Sessions Details */}
              {selectedStatsType === 'upcoming' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Upcoming Sessions: {getUpcomingConsultations()}</h4>
                      <p>Sessions scheduled for future dates</p>
                    </div>
                  </div>
                  
                  <div className="consultation-list">
                    <h4>Upcoming Schedule</h4>
                    <div className="consultation-items">
                      {consultations.filter(c => {
                        const consultationDate = new Date(c.scheduled_date);
                        const now = new Date();
                        return consultationDate > now && (c.status === 'scheduled' || c.status === 'pending');
                      }).map(consultation => (
                        <div key={consultation.id} className="consultation-item upcoming">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            <span className="consultation-duration">{consultation.duration} min</span>
                            <span className="consultation-amount">{formatCurrency(consultation.amount)}</span>
                          </div>
                        </div>
                      ))}
                      {getUpcomingConsultations() === 0 && (
                        <div className="empty-state">
                          <i className="fas fa-calendar-check"></i>
                          <p>No upcoming sessions scheduled</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Rate Analysis */}
              {selectedStatsType === 'completion' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Completion Rate: {getCompletionRate()}%</h4>
                      <p>Percentage of successfully completed consultations</p>
                    </div>
                  </div>
                  
                  <div className="calculation-summary">
                    <h4>Calculation Breakdown</h4>
                    <div className="calculation-grid">
                      <div className="calculation-item">
                        <span className="calculation-formula">Total Consultations:</span>
                        <span className="calculation-details">{consultations.length}</span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Completed Consultations:</span>
                        <span className="calculation-details">{getConsultationsByStatus().completed}</span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Completion Rate Formula:</span>
                        <span className="calculation-details">
                          {getConsultationsByStatus().completed} ÷ {consultations.length} × 100 = {getCompletionRate()}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="consultation-list">
                    <h4>Completed Consultations</h4>
                    <div className="consultation-items">
                      {consultations.filter(c => c.status === 'completed').map(consultation => (
                        <div key={consultation.id} className="consultation-item completed">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            <span className="consultation-amount">{formatCurrency(consultation.amount)}</span>
                            {getStatusBadge(consultation.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Breakdown */}
              {selectedStatsType === 'revenue' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Total Revenue: {formatCurrency(getTotalRevenue())}</h4>
                      <p>Complete revenue analysis across all consultations</p>
                    </div>
                  </div>
                  
                  <div className="breakdown-section">
                    <h4>Revenue by Payment Status</h4>
                    <div className="breakdown-grid">
                      <div className="breakdown-item revenue">
                        <span className="breakdown-label">Paid Revenue</span>
                        <span className="breakdown-value">{formatCurrency(getRevenueByStatus().paid)}</span>
                        <span className="breakdown-percentage">
                          {(getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed) > 0 ? 
                            Math.round((getRevenueByStatus().paid / (getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item revenue">
                        <span className="breakdown-label">Pending Revenue</span>
                        <span className="breakdown-value">{formatCurrency(getRevenueByStatus().pending)}</span>
                        <span className="breakdown-percentage">
                          {(getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed) > 0 ? 
                            Math.round((getRevenueByStatus().pending / (getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item revenue">
                        <span className="breakdown-label">Failed/Lost Revenue</span>
                        <span className="breakdown-value">{formatCurrency(getRevenueByStatus().failed)}</span>
                        <span className="breakdown-percentage">
                          {(getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed) > 0 ? 
                            Math.round((getRevenueByStatus().failed / (getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed)) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="calculation-summary">
                    <h4>Revenue Analytics</h4>
                    <div className="calculation-grid">
                      <div className="calculation-item">
                        <span className="calculation-formula">Average Revenue per Consultation:</span>
                        <span className="calculation-details">
                          {formatCurrency(consultations.length > 0 ? getTotalRevenue() / consultations.length : 0)}
                        </span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Revenue Collection Rate:</span>
                        <span className="calculation-details">
                          {(getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed) > 0 ? 
                            Math.round((getRevenueByStatus().paid / (getRevenueByStatus().paid + getRevenueByStatus().pending + getRevenueByStatus().failed)) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Sessions Details */}
              {selectedStatsType === 'active' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Active Sessions: {getActiveConsultations()}</h4>
                      <p>Consultations currently in progress</p>
                    </div>
                  </div>
                  
                  <div className="consultation-list">
                    <h4>Currently Active</h4>
                    <div className="consultation-items">
                      {consultations.filter(c => c.status === 'ongoing').map(consultation => (
                        <div key={consultation.id} className="consultation-item active">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            <span className="consultation-consultant">{consultation.consultant}</span>
                            {consultation.meeting_link && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon="fas fa-video"
                                onClick={() => handleJoinMeeting(consultation.meeting_link!)}
                              >
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {getActiveConsultations() === 0 && (
                        <div className="empty-state">
                          <i className="fas fa-clock"></i>
                          <p>No active sessions at the moment</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Revenue Analysis */}
              {selectedStatsType === 'pending-revenue' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Pending Revenue: {formatCurrency(getPendingRevenue())}</h4>
                      <p>Revenue from consultations with pending payments</p>
                    </div>
                  </div>
                  
                  <div className="consultation-list">
                    <h4>Pending Payments</h4>
                    <div className="consultation-items">
                      {consultations.filter(c => c.payment_status === 'pending').map(consultation => (
                        <div key={consultation.id} className="consultation-item pending">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            <span className="consultation-amount pending-amount">{formatCurrency(consultation.amount)}</span>
                            {getPaymentBadge(consultation.payment_status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled Consultations */}
              {selectedStatsType === 'cancelled' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Cancelled Consultations: {getConsultationsByStatus().cancelled}</h4>
                      <p>Consultations that were cancelled</p>
                    </div>
                  </div>
                  
                  <div className="consultation-list">
                    <h4>Cancellation Details</h4>
                    <div className="consultation-items">
                      {consultations.filter(c => c.status === 'cancelled').map(consultation => (
                        <div key={consultation.id} className="consultation-item cancelled">
                          <div className="consultation-client">
                            <span className="client-name">{consultation.client_name}</span>
                            <span className="client-service">{consultation.service_type}</span>
                          </div>
                          <div className="consultation-details">
                            <span className="consultation-date">{formatDate(consultation.scheduled_date)}</span>
                            <span className="consultation-amount lost-amount">{formatCurrency(consultation.amount)}</span>
                            {getStatusBadge(consultation.status)}
                          </div>
                          {consultation.notes && (
                            <div className="consultation-notes">
                              <small>{consultation.notes}</small>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Rate Breakdown */}
              {selectedStatsType === 'success-rate' && (
                <div className="stats-details">
                  <div className="stats-overview">
                    <div className="overview-card">
                      <h4>Success Rate: {consultations.length > 0 ? Math.round(((consultations.filter(c => c.status === 'completed').length) / consultations.length) * 100) : 0}%</h4>
                      <p>Overall success rate of consultations</p>
                    </div>
                  </div>
                  
                  <div className="calculation-summary">
                    <h4>Success Metrics</h4>
                    <div className="calculation-grid">
                      <div className="calculation-item">
                        <span className="calculation-formula">Total Consultations:</span>
                        <span className="calculation-details">{consultations.length}</span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Successful (Completed):</span>
                        <span className="calculation-details">{consultations.filter(c => c.status === 'completed').length}</span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Failed (Cancelled):</span>
                        <span className="calculation-details">{getConsultationsByStatus().cancelled}</span>
                      </div>
                      <div className="calculation-item">
                        <span className="calculation-formula">Success Rate:</span>
                        <span className="calculation-details">
                          {consultations.filter(c => c.status === 'completed').length} ÷ {consultations.length} × 100 = {consultations.length > 0 ? Math.round(((consultations.filter(c => c.status === 'completed').length) / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-section">
                    <h4>Performance Analysis</h4>
                    <div className="breakdown-grid">
                      <div className="breakdown-item success">
                        <span className="breakdown-label">Completed Successfully</span>
                        <span className="breakdown-value">{consultations.filter(c => c.status === 'completed').length}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((consultations.filter(c => c.status === 'completed').length / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item warning">
                        <span className="breakdown-label">In Progress</span>
                        <span className="breakdown-value">{getConsultationsByStatus().ongoing + getConsultationsByStatus().scheduled + getConsultationsByStatus().pending}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round(((getConsultationsByStatus().ongoing + getConsultationsByStatus().scheduled + getConsultationsByStatus().pending) / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="breakdown-item danger">
                        <span className="breakdown-label">Cancelled/Failed</span>
                        <span className="breakdown-value">{getConsultationsByStatus().cancelled}</span>
                        <span className="breakdown-percentage">
                          {consultations.length > 0 ? Math.round((getConsultationsByStatus().cancelled / consultations.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setShowStatsModal(false)}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={handleExportData}>
                Export Data
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-consultations {
          padding: 2rem;
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .secondary-stats {
          margin-bottom: 1.5rem;
        }

        .stat-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .stat-item:hover {
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-2px);
          background: rgba(14, 165, 233, 0.1);
        }

        .stat-label {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
        }

        .stat-value {
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* Breakdown Styles */
        .breakdown-card {
          margin-bottom: 2rem;
        }

        .breakdown-header {
          padding: 1.5rem 1.5rem 0 1.5rem;
        }

        .breakdown-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .breakdown-content {
          padding: 1.5rem;
        }

        .breakdown-section {
          margin-bottom: 2rem;
        }

        .breakdown-section:last-child {
          margin-bottom: 0;
        }

        .breakdown-section h4 {
          margin: 0 0 1rem 0;
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 600;
        }

        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }

        .breakdown-item:hover {
          border-color: rgba(14, 165, 233, 0.3);
          transform: translateY(-1px);
        }

        .breakdown-item.revenue {
          background: rgba(34, 197, 94, 0.05);
          border-color: rgba(34, 197, 94, 0.2);
        }

        .breakdown-label {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .breakdown-value {
          color: #f8fafc;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .breakdown-percentage {
          color: #0ea5e9;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Calculation Summary */
        .calculation-summary {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(14, 165, 233, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(14, 165, 233, 0.2);
        }

        .calculation-summary h4 {
          margin: 0 0 1rem 0;
          color: #f8fafc;
          font-size: 1rem;
          font-weight: 600;
        }

        .calculation-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .calculation-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.3);
          border-radius: 6px;
        }

        .calculation-formula {
          color: #0ea5e9;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .calculation-details {
          color: #cbd5e1;
          font-size: 0.8rem;
          font-family: 'Courier New', monospace;
        }

        /* Stats Cards Clickable */
        .stats-card-clickable {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stats-card-clickable:hover {
          transform: translateY(-2px);
        }

        /* Stats Details Modal Styles */
        .stats-details {
          overflow-y: visible;
        }

        .stats-overview {
          margin-bottom: 2rem;
        }

        .overview-card {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 12px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          text-align: center;
        }

        .overview-card h4 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .overview-card p {
          margin: 0;
          color: #94a3b8;
          font-size: 1rem;
        }

        .consultation-list {
          margin-top: 2rem;
        }

        .consultation-list h4 {
          margin: 0 0 1rem 0;
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 600;
        }

        .consultation-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .consultation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }

        .consultation-item:hover {
          border-color: rgba(14, 165, 233, 0.3);
        }

        .consultation-item.upcoming {
          border-color: rgba(249, 115, 22, 0.3);
          background: rgba(249, 115, 22, 0.05);
        }

        .consultation-item.completed {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }

        .consultation-item.active {
          border-color: rgba(14, 165, 233, 0.3);
          background: rgba(14, 165, 233, 0.05);
        }

        .consultation-item.pending {
          border-color: rgba(234, 179, 8, 0.3);
          background: rgba(234, 179, 8, 0.05);
        }

        .consultation-item.cancelled {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .consultation-client {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .client-name {
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .client-service {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .consultation-details {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .consultation-date {
          color: #cbd5e1;
          font-size: 0.75rem;
        }

        .consultation-duration {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .consultation-amount {
          color: #10b981;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .consultation-amount.pending-amount {
          color: #f59e0b;
        }

        .consultation-amount.lost-amount {
          color: #ef4444;
        }

        .consultation-consultant {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .consultation-notes {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 4px;
          border-left: 3px solid rgba(239, 68, 68, 0.5);
        }

        .consultation-notes small {
          color: #94a3b8;
          font-size: 0.75rem;
          font-style: italic;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem;
          color: #64748b;
          text-align: center;
        }

        .empty-state i {
          font-size: 3rem;
          color: #475569;
        }

        .empty-state p {
          margin: 0;
          font-size: 1rem;
        }

        /* Enhanced Breakdown Items */
        .breakdown-item.success {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }

        .breakdown-item.warning {
          border-color: rgba(249, 115, 22, 0.3);
          background: rgba(249, 115, 22, 0.05);
        }

        .breakdown-item.danger {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
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
          padding: 2rem;
          overflow-y: auto;
        }

        .modal-content {
          background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 600px;
          max-height: calc(100vh - 4rem);
          display: flex;
          flex-direction: column;
          margin: auto;
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          flex-shrink: 0;
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
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          flex-shrink: 0;
        }

        /* Consultation Header */
        .consultation-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .consultation-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          border: 3px solid rgba(14, 165, 233, 0.3);
        }

        .consultation-info h4 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .consultation-info p {
          margin: 0 0 1rem 0;
          color: #94a3b8;
          font-size: 1rem;
        }

        .consultation-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.1);
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

        @media (max-width: 768px) {
          .admin-consultations {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .modal-overlay {
            align-items: flex-start;
            padding: 1rem;
          }

          .modal-content {
            width: 100%;
            margin: 0;
            max-height: calc(100vh - 2rem);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .consultation-header {
            flex-direction: column;
            text-align: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Consultant Selection Styles */
        .consultant-select {
          font-family: 'Inter', sans-serif;
        }

        .consultant-info {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(14, 165, 233, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(14, 165, 233, 0.2);
        }

        .consultant-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .consultant-stats small {
          color: #cbd5e1;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .stat-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.6875rem;
          margin: 0 0.25rem;
        }

        .stat-badge.active {
          background: rgba(14, 165, 233, 0.2);
          color: #0ea5e9;
          border: 1px solid rgba(14, 165, 233, 0.3);
        }

        .stat-badge.upcoming {
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .stat-badge.completed {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .stat-badge.total {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </div>
  );
}
