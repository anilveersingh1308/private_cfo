'use client';

import React, { useState, useEffect } from 'react';
import { Button, Badge } from './DashboardComponents';

interface ResponsiveDataViewProps {
  data: any[];
  columns: any[];
  loading?: boolean;
  onRowClick?: (item: any) => void;
  searchQuery?: string;
  cardRenderer?: (item: any, index: number) => React.ReactNode;
}

export const ResponsiveDataView: React.FC<ResponsiveDataViewProps> = ({
  data,
  columns,
  loading = false,
  onRowClick,
  searchQuery = '',
  cardRenderer
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'auto' | 'table' | 'cards'>('auto');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldShowCards = viewMode === 'cards' || (viewMode === 'auto' && isMobile);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ background: '#fbbf24', color: '#000', padding: '0 0.2rem', borderRadius: '2px' }}>
          {part}
        </span>
      ) : part
    );
  };

  const DefaultCard: React.FC<{ item: any; index: number }> = ({ item, index }) => (
    <div 
      className="data-card"
      onClick={() => onRowClick?.(item)}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {columns.map((column, colIndex) => {
        if (column.key === 'actions') {
          return (
            <div key={column.key} className="card-actions">
              {column.render ? column.render(item[column.key], item) : item[column.key]}
            </div>
          );
        }

        const value = item[column.key];
        const displayValue = column.render ? column.render(value, item) : value;
        
        if (colIndex < 3) { // Show first 3 columns prominently
          return (
            <div key={column.key} className="card-field">
              <label className="card-label">{column.title}</label>
              <div className="card-value">
                {typeof displayValue === 'string' ? 
                  highlightText(displayValue, searchQuery) : 
                  displayValue
                }
              </div>
            </div>
          );
        }
        return null;
      })}
      
      {/* Show additional info in a compact way */}
      <div className="card-meta">
        {columns.slice(3, -1).map((column) => {
          if (column.key === 'actions') return null;
          const value = item[column.key];
          if (!value) return null;
          
          return (
            <span key={column.key} className="meta-item">
              <strong>{column.title}:</strong> {column.render ? column.render(value, item) : value}
            </span>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="responsive-data-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading data...</span>
        </div>
        <style jsx>{`
          .responsive-data-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            background: rgba(22, 33, 58, 0.5);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
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

  if (data.length === 0) {
    return (
      <div className="responsive-data-empty">
        <i className="fas fa-inbox"></i>
        <h3>No Data Found</h3>
        <p>There are no items to display at the moment.</p>
        <style jsx>{`
          .responsive-data-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            padding: 3rem;
            text-align: center;
            background: rgba(22, 33, 58, 0.5);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }
          .responsive-data-empty i {
            font-size: 3rem;
            color: #64748b;
          }
          .responsive-data-empty h3 {
            margin: 0;
            color: #f8fafc;
            font-size: 1.5rem;
          }
          .responsive-data-empty p {
            margin: 0;
            color: #94a3b8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="responsive-data-view">
      {/* View Mode Toggle */}
      <div className="view-controls">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'auto' ? 'active' : ''}`}
            onClick={() => setViewMode('auto')}
            title="Auto (responsive)"
          >
            <i className="fas fa-magic"></i>
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table view"
          >
            <i className="fas fa-table"></i>
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Card view"
          >
            <i className="fas fa-th-large"></i>
          </button>
        </div>
        <span className="view-info">
          {shouldShowCards ? 'Card View' : 'Table View'} • {data.length} items
        </span>
      </div>

      {/* Data Display */}
      {shouldShowCards ? (
        <div className="cards-container">
          {data.map((item, index) => {
            const key = item.id || index;
            if (cardRenderer) {
              return (
                <React.Fragment key={key}>
                  {cardRenderer(item, index)}
                </React.Fragment>
              );
            }
            return <DefaultCard key={key} item={item} index={index} />;
          })}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr 
                  key={item.id || index}
                  onClick={() => onRowClick?.(item)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Data Footer */}
      <div className="data-footer">
        <span className="data-count">
          Showing {data.length} {data.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <style jsx>{`
        .responsive-data-view {
          background: rgba(22, 33, 58, 0.5);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .view-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(15, 23, 42, 0.3);
        }

        .view-toggle {
          display: flex;
          gap: 0.25rem;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 6px;
          padding: 0.25rem;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 4px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn:hover {
          color: #f8fafc;
          background: rgba(59, 130, 246, 0.1);
        }

        .toggle-btn.active {
          color: #0ea5e9;
          background: rgba(14, 165, 233, 0.2);
        }

        .view-info {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
          padding-bottom: 1rem;
        }

        .data-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1.25rem;
          transition: all 0.2s ease;
        }

        .data-card:hover {
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .card-field {
          margin-bottom: 1rem;
        }

        .card-field:last-of-type {
          margin-bottom: 0.75rem;
        }

        .card-label {
          display: block;
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .card-value {
          color: #f8fafc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .card-meta {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .meta-item {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .meta-item strong {
          color: #cbd5e1;
        }

        .card-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.1);
        }

        .table-container {
          overflow-x: auto;
          padding-bottom: 0;
        }

        .data-footer {
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.3);
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          text-align: center;
        }

        .data-count {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: rgba(15, 23, 42, 0.6);
          color: #cbd5e1;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          color: #f8fafc;
          font-size: 0.875rem;
        }

        .data-table tbody tr:last-child td {
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .data-table tbody tr:hover {
          background: rgba(14, 165, 233, 0.05);
        }

        @media (max-width: 768px) {
          .cards-container {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
            padding-bottom: 0.5rem;
          }

          .data-card {
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            margin-bottom: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            position: relative;
          }

          .data-card:not(:last-child)::after {
            content: '';
            position: absolute;
            bottom: -0.75rem;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
          }

          .view-controls {
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
          }

          .view-toggle {
            align-self: center;
          }

          .view-info {
            text-align: center;
          }

          .data-footer {
            padding: 0.75rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .cards-container {
            padding: 0.75rem;
            gap: 1rem;
          }

          .data-card {
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 0.75rem;
          }

          .data-card:not(:last-child)::after {
            bottom: -1rem;
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveDataView;
