'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  StatsCard 
} from '@/components/admin/AdminComponents';

interface ReportData {
  consultations: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
    revenue: number;
    averageRating: number;
  };
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    subscribersCount: number;
  };
  services: {
    mostPopular: string;
    totalServices: number;
    averageDuration: number;
  };
  financial: {
    totalRevenue: number;
    monthlyGrowth: number;
    pendingPayments: number;
    cancelled: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeChart, setActiveChart] = useState<'revenue' | 'consultations' | 'users'>('revenue');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/reports?period=${selectedPeriod}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      setReportData(data);
      setChartData(data.chartData);
    } catch (err) {
      setError('Failed to fetch report data');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getRevenueChartData = (): ChartData => {
    if (chartData?.revenue) {
      return {
        labels: chartData.revenue.labels,
        datasets: [{
          label: 'Revenue',
          data: chartData.revenue.data,
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderColor: '#0ea5e9'
        }]
      };
    }
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderColor: '#0ea5e9'
      }]
    };
  };

  const getConsultationChartData = (): ChartData => {
    if (chartData?.consultations) {
      return {
        labels: chartData.consultations.labels,
        datasets: [{
          label: 'Consultations',
          data: chartData.consultations.data,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: '#22c55e'
        }]
      };
    }
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Consultations',
        data: [12, 15, 13, 18, 16, 22],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22c55e'
      }]
    };
  };

  const getUserChartData = (): ChartData => {
    if (chartData?.users) {
      return {
        labels: chartData.users.labels,
        datasets: [{
          label: 'New Users',
          data: chartData.users.data,
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderColor: '#a855f7'
        }]
      };
    }
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [85, 92, 78, 105, 95, 112],
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: '#a855f7'
      }]
    };
  };

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting report as ${format.toUpperCase()}`);
    
    if (format === 'pdf') {
      // Export as PDF (in a real app, you'd generate a PDF)
      const reportContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${selectedPeriod}-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Use the export API for CSV and Excel
      const url = `/api/admin/reports/export?format=${format}&period=${selectedPeriod}&type=summary`;
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${selectedPeriod}-${Date.now()}.${format}`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading reports...</span>
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
          <Button variant="primary" size="sm" onClick={fetchReportData}>
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

  if (!reportData) return null;

  return (
    <div className="admin-reports">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Comprehensive business insights and performance metrics"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="period-select"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-file-pdf"
              onClick={() => exportReport('pdf')}
            >
              Export PDF
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon="fas fa-file-excel"
              onClick={() => exportReport('excel')}
            >
              Export Excel
            </Button>
          </div>
        }
      />

      {/* Overview Stats */}
      <div className="stats-grid">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(reportData.financial.totalRevenue)}
          icon="fas fa-rupee-sign"
          trend={{
            value: Math.abs(reportData.financial.monthlyGrowth),
            isPositive: reportData.financial.monthlyGrowth >= 0
          }}
          color="green"
        />
        <StatsCard
          title="Consultations"
          value={reportData.consultations.total.toString()}
          icon="fas fa-calendar-check"
          trend={{
            value: 8,
            isPositive: true
          }}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={reportData.users.active.toString()}
          icon="fas fa-users"
          trend={{
            value: 15,
            isPositive: true
          }}
          color="purple"
        />
        <StatsCard
          title="Completion Rate"
          value={`${Math.round((reportData.consultations.completed / reportData.consultations.total) * 100)}%`}
          icon="fas fa-chart-line"
          trend={{
            value: 3,
            isPositive: true
          }}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <Card>
          <div className="chart-header">
            <h3>Performance Trends</h3>
            <div className="chart-tabs">
              <button 
                className={`chart-tab ${activeChart === 'revenue' ? 'active' : ''}`}
                onClick={() => setActiveChart('revenue')}
              >
                Revenue
              </button>
              <button 
                className={`chart-tab ${activeChart === 'consultations' ? 'active' : ''}`}
                onClick={() => setActiveChart('consultations')}
              >
                Consultations
              </button>
              <button 
                className={`chart-tab ${activeChart === 'users' ? 'active' : ''}`}
                onClick={() => setActiveChart('users')}
              >
                Users
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-mockup">
              <i className="fas fa-chart-area"></i>
              <p>Chart: {activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Trends</p>
              <span>Interactive chart would be rendered here using Chart.js or similar library</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Reports Grid */}
      <div className="reports-grid">
        {/* Consultation Report */}
        <Card>
          <div className="report-header">
            <h4><i className="fas fa-calendar-check"></i> Consultation Analytics</h4>
          </div>
          <div className="report-content">
            <div className="report-metric">
              <span className="metric-label">Total Sessions</span>
              <span className="metric-value">{reportData.consultations.total}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Completed</span>
              <span className="metric-value success">{reportData.consultations.completed}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Upcoming</span>
              <span className="metric-value info">{reportData.consultations.upcoming}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Cancelled</span>
              <span className="metric-value danger">{reportData.consultations.cancelled}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Avg. Rating</span>
              <span className="metric-value">
                {reportData.consultations.averageRating} 
                <i className="fas fa-star" style={{ color: '#fbbf24', marginLeft: '0.25rem' }}></i>
              </span>
            </div>
          </div>
        </Card>

        {/* User Report */}
        <Card>
          <div className="report-header">
            <h4><i className="fas fa-users"></i> User Analytics</h4>
          </div>
          <div className="report-content">
            <div className="report-metric">
              <span className="metric-label">Total Users</span>
              <span className="metric-value">{reportData.users.total}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Active Users</span>
              <span className="metric-value success">{reportData.users.active}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">New This Month</span>
              <span className="metric-value info">{reportData.users.newThisMonth}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Subscribers</span>
              <span className="metric-value">{reportData.users.subscribersCount}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Retention Rate</span>
              <span className="metric-value">
                {Math.round((reportData.users.active / reportData.users.total) * 100)}%
              </span>
            </div>
          </div>
        </Card>

        {/* Financial Report */}
        <Card>
          <div className="report-header">
            <h4><i className="fas fa-rupee-sign"></i> Financial Analytics</h4>
          </div>
          <div className="report-content">
            <div className="report-metric">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-value success">{formatCurrency(reportData.financial.totalRevenue)}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Monthly Growth</span>
              <span className="metric-value info">{formatPercentage(reportData.financial.monthlyGrowth)}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Pending Payments</span>
              <span className="metric-value warning">{formatCurrency(reportData.financial.pendingPayments)}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Cancelled</span>
              <span className="metric-value danger">{formatCurrency(reportData.financial.cancelled)}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Avg. Order Value</span>
              <span className="metric-value">
                {formatCurrency(reportData.consultations.revenue / reportData.consultations.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Service Report */}
        <Card>
          <div className="report-header">
            <h4><i className="fas fa-cogs"></i> Service Analytics</h4>
          </div>
          <div className="report-content">
            <div className="report-metric">
              <span className="metric-label">Total Services</span>
              <span className="metric-value">{reportData.services.totalServices}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Most Popular</span>
              <span className="metric-value success">{reportData.services.mostPopular}</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Avg. Duration</span>
              <span className="metric-value">{reportData.services.averageDuration} min</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Service Utilization</span>
              <span className="metric-value info">87%</span>
            </div>
            <div className="report-metric">
              <span className="metric-label">Customer Satisfaction</span>
              <span className="metric-value success">
                4.8 <i className="fas fa-star" style={{ color: '#fbbf24', marginLeft: '0.25rem' }}></i>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .admin-reports {
          padding: 2rem;
          min-height: 100vh;
        }

        .period-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #f8fafc;
          font-size: 0.875rem;
          min-width: 140px;
        }

        .period-select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .charts-section {
          margin-bottom: 2rem;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .chart-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .chart-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .chart-tab {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #94a3b8;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chart-tab:hover {
          color: #f8fafc;
          border-color: #0ea5e9;
        }

        .chart-tab.active {
          background: rgba(14, 165, 233, 0.1);
          border-color: #0ea5e9;
          color: #0ea5e9;
        }

        .chart-placeholder {
          padding: 2rem;
        }

        .chart-mockup {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: rgba(15, 23, 42, 0.5);
          border: 2px dashed rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #94a3b8;
          text-align: center;
        }

        .chart-mockup i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #0ea5e9;
        }

        .chart-mockup p {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
        }

        .chart-mockup span {
          font-size: 0.875rem;
          opacity: 0.7;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .report-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .report-header h4 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .report-header h4 i {
          color: #0ea5e9;
        }

        .report-content {
          padding: 1.5rem;
        }

        .report-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .report-metric:last-child {
          border-bottom: none;
        }

        .metric-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .metric-value {
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .metric-value.success {
          color: #22c55e;
        }

        .metric-value.info {
          color: #0ea5e9;
        }

        .metric-value.warning {
          color: #f59e0b;
        }

        .metric-value.danger {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .admin-reports {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .chart-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .chart-tabs {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
