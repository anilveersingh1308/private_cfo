'use client';

import React from 'react';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        <ul>
          <li><a href="/admin">Dashboard</a></li>
          <li><a href="/admin/users">Users</a></li>
          <li><a href="/admin/consultations">Consultations</a></li>
          <li><a href="/admin/reports">Reports</a></li>
        </ul>
      </nav>
      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          background: #1e293b;
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }
        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #374151;
        }
        nav {
          padding: 1rem;
        }
        nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        nav li {
          margin-bottom: 0.5rem;
        }
        nav a {
          color: white;
          text-decoration: none;
          padding: 0.5rem;
          display: block;
          border-radius: 4px;
        }
        nav a:hover {
          background: #374151;
        }
      `}</style>
    </aside>
  );
}
