// Dashboard UI Components Library
import React, { useState } from 'react';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false 
}) => {
  return (
    <div className={`dashboard-card ${hover ? 'hover-effect' : ''} ${gradient ? 'gradient' : ''} ${className}`}>
      {children}
      <style jsx>{`
        .dashboard-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-card.hover-effect:hover {
          transform: translateY(-4px);
          border-color: rgba(14, 165, 233, 0.4);
          box-shadow: 0 16px 48px rgba(14, 165, 233, 0.2);
        }

        .dashboard-card.gradient {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .dashboard-card {
            padding: 1rem;
            border-radius: 12px;
          }

          .dashboard-card.hover-effect:hover {
            transform: none; /* Disable hover effects on mobile */
          }
        }

        @media (max-width: 480px) {
          .dashboard-card {
            padding: 0.875rem;
            border-radius: 8px;
          }
        }
      `}</style>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  trend 
}) => {
  const colorMap = {
    blue: { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgba(14, 165, 233, 0.3)', text: '#0ea5e9' },
    green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
    purple: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7' },
    orange: { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)', text: '#fb923c' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
    indigo: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: '#6366f1' }
  };

  return (
    <Card hover className="stats-card">
      <div className="stats-content">
        <div className="stats-icon">
          <i className={icon}></i>
        </div>
        <div className="stats-info">
          <h3>{title}</h3>
          <div className="stats-value">{value}</div>
          {trend && (
            <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`}></i>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .stats-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stats-icon {
          width: 64px;
          height: 64px;
          background: ${colorMap[color].bg};
          border: 2px solid ${colorMap[color].border};
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: ${colorMap[color].text};
          flex-shrink: 0;
        }

        .stats-info {
          flex: 1;
          min-width: 0;
        }

        .stats-info h3 {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-value {
          color: #f8fafc;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          line-height: 1;
        }

        .stats-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stats-trend.positive {
          color: #22c55e;
        }

        .stats-trend.negative {
          color: #ef4444;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .stats-content {
            gap: 0.75rem;
          }

          .stats-icon {
            width: 56px;
            height: 56px;
            font-size: 1.25rem;
            border-radius: 12px;
          }

          .stats-info h3 {
            font-size: 0.8rem;
            margin-bottom: 0.375rem;
          }

          .stats-value {
            font-size: 1.75rem;
          }

          .stats-trend {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .stats-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.5rem;
          }

          .stats-icon {
            width: 48px;
            height: 48px;
            font-size: 1.125rem;
            border-radius: 10px;
          }

          .stats-info h3 {
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
          }

          .stats-value {
            font-size: 1.5rem;
          }

          .stats-trend {
            font-size: 0.65rem;
            justify-content: center;
          }
        }
      `}</style>
    </Card>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  icon,
  loading = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`dashboard-btn ${variant} ${size} ${disabled ? 'disabled' : ''}`}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : icon ? (
        <i className={icon}></i>
      ) : null}
      <span>{children}</span>
      
      <style jsx>{`
        .dashboard-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dashboard-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .dashboard-btn:hover::before {
          left: 100%;
        }

        /* Variants */
        .dashboard-btn.primary {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
        }

        .dashboard-btn.primary:hover {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
        }

        .dashboard-btn.secondary {
          background: rgba(30, 41, 59, 0.8);
          color: #f8fafc;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .dashboard-btn.secondary:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(14, 165, 233, 0.5);
        }

        .dashboard-btn.danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }

        .dashboard-btn.danger:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }

        .dashboard-btn.ghost {
          background: transparent;
          color: #cbd5e1;
          border: 1px solid transparent;
        }

        .dashboard-btn.ghost:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #0ea5e9;
          border-color: rgba(14, 165, 233, 0.3);
        }

        /* Sizes */
        .dashboard-btn.sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .dashboard-btn.md {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
        }

        .dashboard-btn.lg {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .dashboard-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .dashboard-btn {
            border-radius: 10px;
          }

          .dashboard-btn.sm {
            padding: 0.45rem 0.875rem;
            font-size: 0.8rem;
          }

          .dashboard-btn.md {
            padding: 0.625rem 1.25rem;
            font-size: 0.8rem;
          }

          .dashboard-btn.lg {
            padding: 0.875rem 1.75rem;
            font-size: 0.9rem;
          }

          .dashboard-btn:hover {
            transform: none; /* Disable hover transforms on mobile */
          }
        }

        @media (max-width: 480px) {
          .dashboard-btn {
            border-radius: 8px;
            gap: 0.375rem;
          }

          .dashboard-btn.sm {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
          }

          .dashboard-btn.md {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }

          .dashboard-btn.lg {
            padding: 0.75rem 1.5rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </button>
  );
};

// Table Component
interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  onRowClick,
  pagination
}) => {
  if (loading) {
    return (
      <Card>
        <div className="table-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading...</span>
        </div>
        <style jsx>{`
          .table-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 3rem;
            color: #94a3b8;
            font-size: 0.875rem;
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card className="table-container">
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={{ width: column.width }}>
                  {column.title}
                  {column.sortable && <i className="fas fa-sort ml-1"></i>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index} 
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {(pagination.current - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} entries
          </span>
          <div className="pagination-controls">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              icon="fas fa-chevron-left"
            >
              Previous
            </Button>
            <span className="pagination-current">
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
              icon="fas fa-chevron-right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(15, 23, 42, 0.6);
        }

        .admin-table th {
          background: rgba(30, 41, 59, 0.8);
          color: #f8fafc;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .admin-table td {
          padding: 1rem;
          color: #cbd5e1;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(30, 41, 59, 0.5);
        }

        .admin-table tr.clickable {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .admin-table tr.clickable:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          margin-top: 1rem;
        }

        .pagination-info {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pagination-current {
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </Card>
  );
};

// Page Header Component
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumb
}) => {
  return (
    <div className="page-header">
      {breadcrumb && (
        <nav className="breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={index} className="breadcrumb-item">
              {item.href ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumb.length - 1 && <i className="fas fa-chevron-right"></i>}
            </span>
          ))}
        </nav>
      )}
      
      <div className="header-content">
        <div className="header-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>

      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
          overflow-x: auto;
          white-space: nowrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .breadcrumb a {
          color: #0ea5e9;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb a:hover {
          color: #38bdf8;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
        }

        .header-text {
          flex: 1;
          min-width: 0;
        }

        .header-text h1 {
          color: #f8fafc;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .header-text p {
          color: #94a3b8;
          font-size: 1rem;
          margin: 0;
          line-height: 1.4;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .page-header {
            margin-bottom: 1.5rem;
          }

          .breadcrumb {
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-text h1 {
            font-size: 1.75rem;
            margin-bottom: 0.375rem;
          }

          .header-text p {
            font-size: 0.9rem;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
            gap: 0.5rem;
          }

          .header-actions :global(.admin-btn) {
            flex: 1;
            min-width: 0;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            margin-bottom: 1rem;
          }

          .breadcrumb {
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          .header-content {
            gap: 0.75rem;
          }

          .header-text h1 {
            font-size: 1.5rem;
            margin-bottom: 0.25rem;
          }

          .header-text p {
            font-size: 0.85rem;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
            gap: 0.375rem;
          }

          .header-actions :global(.admin-btn) {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md'
}) => {
  const variants = {
    success: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    warning: { bg: 'rgba(251, 146, 60, 0.2)', color: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' },
    danger: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
    info: { bg: 'rgba(14, 165, 233, 0.2)', color: '#0ea5e9', border: 'rgba(14, 165, 233, 0.3)' },
    neutral: { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' }
  };

  return (
    <span className={`badge ${variant} ${size}`}>
      {children}
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          font-weight: 500;
          border: 1px solid;
          background: ${variants[variant].bg};
          color: ${variants[variant].color};
          border-color: ${variants[variant].border};
        }

        .badge.sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .badge.md {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
    </span>
  );
};

// FormField Component
interface FormFieldProps {
  label: string;
  children?: React.ReactNode;
  error?: string;
  required?: boolean;
  // Input-specific props
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  name,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  
  // If children are provided, use wrapper mode, otherwise create input
  const inputElement = children ? children : (
    <input
      type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      autoComplete={autoComplete}
    />
  );

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="form-input-wrapper">
        {inputElement}
        {isPasswordField && !children && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        )}
      </div>
      {error && <div className="form-error">{error}</div>}
      <style jsx>{`
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: #e2e8f0;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .required {
          color: #ef4444;
          font-weight: 600;
        }

        .form-input-wrapper {
          position: relative;
        }

        .form-input-wrapper :global(input),
        .form-input-wrapper :global(select),
        .form-input-wrapper :global(textarea) {
          width: 100%;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .form-input-wrapper :global(input[type="password"]) {
          padding-right: 3rem;
        }

        .form-input-wrapper :global(input:focus),
        .form-input-wrapper :global(select:focus),
        .form-input-wrapper :global(textarea:focus) {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .form-input-wrapper :global(input::placeholder),
        .form-input-wrapper :global(textarea::placeholder) {
          color: #64748b;
        }

        .form-input-wrapper :global(input:disabled),
        .form-input-wrapper :global(select:disabled),
        .form-input-wrapper :global(textarea:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .password-toggle:hover {
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.1);
        }

        .password-toggle:focus {
          outline: none;
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.1);
        }

        .password-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle i {
          font-size: 0.875rem;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// Alert Component
interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = ''
}) => {
  const variants = {
    success: { 
      bg: 'rgba(34, 197, 94, 0.1)', 
      color: '#22c55e', 
      border: 'rgba(34, 197, 94, 0.3)',
      icon: 'fas fa-check-circle'
    },
    warning: { 
      bg: 'rgba(251, 146, 60, 0.1)', 
      color: '#fb923c', 
      border: 'rgba(251, 146, 60, 0.3)',
      icon: 'fas fa-exclamation-triangle'
    },
    error: { 
      bg: 'rgba(239, 68, 68, 0.1)', 
      color: '#ef4444', 
      border: 'rgba(239, 68, 68, 0.3)',
      icon: 'fas fa-exclamation-circle'
    },
    info: { 
      bg: 'rgba(14, 165, 233, 0.1)', 
      color: '#0ea5e9', 
      border: 'rgba(14, 165, 233, 0.3)',
      icon: 'fas fa-info-circle'
    }
  };

  return (
    <div className={`alert ${variant} ${className}`}>
      <i className={variants[variant].icon}></i>
      <div className="alert-content">{children}</div>
      <style jsx>{`
        .alert {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid;
          background: ${variants[variant].bg};
          color: ${variants[variant].color};
          border-color: ${variants[variant].border};
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .alert i {
          flex-shrink: 0;
          margin-top: 0.125rem;
          font-size: 1rem;
        }

        .alert-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
