'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { 
  Card, 
  Button, 
  PageHeader, 
  Badge,
  StatsCard 
} from '@/components/dashboard/DashboardComponents';

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

export default function DashboardReports() {
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
      
      const response = await fetch(`/api/dashboard/reports?period=${selectedPeriod}`);
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
           // fill: true,
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
         // fill: true,
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
           // fill: true,
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
         // fill: true,
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
           // fill: true,
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
         // fill: true,
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
      const url = `/api/dashboard/reports/export?format=${format}&period=${selectedPeriod}&type=summary`;
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
    <div className="dashboard-reports">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Comprehensive business insights and performance metrics"
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
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
          <div className="chart-area">
            {activeChart === 'revenue' && (
              <Line
                data={getRevenueChartData()}
                options={{
                  responsive: true,
                  animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#0ea5e9',
                        font: { size: 15, weight: 'bold' },
                        boxWidth: 22,
                        boxHeight: 22,
                        padding: 24
                      }
                    },
                    title: {
                      display: true,
                      text: 'Revenue Trends',
                      color: '#f8fafc',
                      font: { size: 20, weight: 'bold' },
                      padding: { top: 16, bottom: 24 }
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#0ea5e9',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#38bdf8',
                      borderWidth: 2,
                      padding: 16,
                      cornerRadius: 10,
                      titleFont: { size: 16, weight: 'bold' },
                      bodyFont: { size: 15 },
                      displayColors: false
                    }
                  },
                  layout: {
                    padding: { left: 16, right: 16, top: 8, bottom: 8 }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(14,165,233,0.12)' },
                      ticks: { color: '#38bdf8', font: { size: 14 } }
                    },
                    x: {
                      grid: { color: 'rgba(14,165,233,0.07)' },
                      ticks: { color: '#38bdf8', font: { size: 14 } }
                    }
                  },
                  elements: {
                    line: {
                      borderWidth: 5,
                      borderColor: '#0ea5e9',
                      backgroundColor: 'rgba(14,165,233,0.15)',
                    },
                    point: {
                      radius: 8,
                      backgroundColor: '#0ea5e9',
                      borderColor: '#fff',
                      borderWidth: 3,
                      hoverRadius: 12,
                      hoverBackgroundColor: '#38bdf8',
                      hoverBorderColor: '#fff',
                      hoverBorderWidth: 4
                    }
                  }
                }}
              />
            )}
            {activeChart === 'consultations' && (
              <Line
                data={getConsultationChartData()}
                options={{
                  responsive: true,
                  animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#22c55e',
                        font: { size: 15, weight: 'bold' },
                        boxWidth: 22,
                        boxHeight: 22,
                        padding: 24
                      }
                    },
                    title: {
                      display: true,
                      text: 'Consultations Trends',
                      color: '#f8fafc',
                      font: { size: 20, weight: 'bold' },
                      padding: { top: 16, bottom: 24 }
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#22c55e',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#38bdf8',
                      borderWidth: 2,
                      padding: 16,
                      cornerRadius: 10,
                      titleFont: { size: 16, weight: 'bold' },
                      bodyFont: { size: 15 },
                      displayColors: false
                    }
                  },
                  layout: {
                    padding: { left: 16, right: 16, top: 8, bottom: 8 }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(34,197,94,0.12)' },
                      ticks: { color: '#22c55e', font: { size: 14 } }
                    },
                    x: {
                      grid: { color: 'rgba(34,197,94,0.07)' },
                      ticks: { color: '#22c55e', font: { size: 14 } }
                    }
                  },
                  elements: {
                    line: {
                      borderWidth: 5,
                      borderColor: '#22c55e',
                      backgroundColor: 'rgba(34,197,94,0.15)',
                    },
                    point: {
                      radius: 8,
                      backgroundColor: '#22c55e',
                      borderColor: '#fff',
                      borderWidth: 3,
                      hoverRadius: 12,
                      hoverBackgroundColor: '#38bdf8',
                      hoverBorderColor: '#fff',
                      hoverBorderWidth: 4
                    }
                  }
                }}
              />
            )}
            {activeChart === 'users' && (
              <Line
                data={getUserChartData()}
                options={{
                  responsive: true,
                  animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#a855f7',
                        font: { size: 15, weight: 'bold' },
                        boxWidth: 22,
                        boxHeight: 22,
                        padding: 24
                      }
                    },
                    title: {
                      display: true,
                      text: 'User Growth Trends',
                      color: '#f8fafc',
                      font: { size: 20, weight: 'bold' },
                      padding: { top: 16, bottom: 24 }
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#a855f7',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#38bdf8',
                      borderWidth: 2,
                      padding: 16,
                      cornerRadius: 10,
                      titleFont: { size: 16, weight: 'bold' },
                      bodyFont: { size: 15 },
                      displayColors: false
                    }
                  },
                  layout: {
                    padding: { left: 16, right: 16, top: 8, bottom: 8 }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(168,85,247,0.12)' },
                      ticks: { color: '#a855f7', font: { size: 14 } }
                    },
                    x: {
                      grid: { color: 'rgba(168,85,247,0.07)' },
                      ticks: { color: '#a855f7', font: { size: 14 } }
                    }
                  },
                  elements: {
                    line: {
                      borderWidth: 5,
                      borderColor: '#a855f7',
                      backgroundColor: 'rgba(168,85,247,0.15)',
                    },
                    point: {
                      radius: 8,
                      backgroundColor: '#a855f7',
                      borderColor: '#fff',
                      borderWidth: 3,
                      hoverRadius: 12,
                      hoverBackgroundColor: '#38bdf8',
                      hoverBorderColor: '#fff',
                      hoverBorderWidth: 4
                    }
                  }
                }}
              />
            )}
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
        .dashboard-reports {
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

        .chart-area {
          padding: 2rem;
          background: rgba(15, 23, 42, 0.5);
          border: 2px dashed rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #94a3b8;
          text-align: center;
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
          .dashboard-reports {
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
