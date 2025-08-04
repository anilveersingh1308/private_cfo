'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader,
  Badge
} from '@/components/dashboard/DashboardComponents';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Private CFO',
      siteDescription: 'Professional Financial Consulting Services',
      contactEmail: 'info@privatecfo.com',
      contactPhone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra, India',
      timezone: 'Asia/Kolkata'
    },
    business: {
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      consultationRate: '5000',
      currency: 'INR'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReports: true,
      monthlyReports: true,
      newUserAlerts: true,
      paymentAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      maxLoginAttempts: '5'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-cog' },
    { id: 'business', label: 'Business', icon: 'fas fa-building' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' }
  ];

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Settings saved:', settings);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            placeholder="Site name"
          />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Site Description</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
            placeholder="Site description"
            rows={3}
          />
        </div>
        <div className="form-group full-width">
          <label>Business Address</label>
          <textarea
            value={settings.general.address}
            onChange={(e) => handleInputChange('general', 'address', e.target.value)}
            placeholder="Business address"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessSettings = () => (
    <div className="settings-section">
      <h3>Business Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>GST Number</label>
          <input
            type="text"
            value={settings.business.gstNumber}
            onChange={(e) => handleInputChange('business', 'gstNumber', e.target.value)}
            placeholder="GST Number"
          />
        </div>
        <div className="form-group">
          <label>PAN Number</label>
          <input
            type="text"
            value={settings.business.panNumber}
            onChange={(e) => handleInputChange('business', 'panNumber', e.target.value)}
            placeholder="PAN Number"
          />
        </div>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            value={settings.business.bankName}
            onChange={(e) => handleInputChange('business', 'bankName', e.target.value)}
            placeholder="Bank Name"
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            value={settings.business.accountNumber}
            onChange={(e) => handleInputChange('business', 'accountNumber', e.target.value)}
            placeholder="Account Number"
          />
        </div>
        <div className="form-group">
          <label>IFSC Code</label>
          <input
            type="text"
            value={settings.business.ifscCode}
            onChange={(e) => handleInputChange('business', 'ifscCode', e.target.value)}
            placeholder="IFSC Code"
          />
        </div>
        <div className="form-group">
          <label>Default Consultation Rate (₹)</label>
          <input
            type="number"
            value={settings.business.consultationRate}
            onChange={(e) => handleInputChange('business', 'consultationRate', e.target.value)}
            placeholder="5000"
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={settings.business.currency}
            onChange={(e) => handleInputChange('business', 'currency', e.target.value)}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Settings</h3>
      <div className="notification-options">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="notification-item">
            <div className="notification-info">
              <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              <span>Get notified about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Session Timeout (minutes)</label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password Expiry (days)</label>
          <select
            value={settings.security.passwordExpiry}
            onChange={(e) => handleInputChange('security', 'passwordExpiry', e.target.value)}
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
          </select>
        </div>
        <div className="form-group">
          <label>Max Login Attempts</label>
          <select
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
          >
            <option value="3">3 attempts</option>
            <option value="5">5 attempts</option>
            <option value="10">10 attempts</option>
          </select>
        </div>
        <div className="form-group full-width">
          <div className="security-option">
            <div className="option-info">
              <label>Two-Factor Authentication</label>
              <span>Add an extra layer of security to your account</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'business':
        return renderBusinessSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="System Settings"
        subtitle="Manage your application settings and preferences"
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings' }
        ]}
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i>
            Back
          </Button>
        }
      />

      <div className="settings-container">
        <div className="settings-sidebar">
          <Card className="tabs-card">
            <div className="tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="settings-content">
          <Card>
            <div className="settings-form">
              {renderTabContent()}
              
              <div className="form-actions">
                <Button 
                  variant="secondary" 
                  size="md"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={handleSave}
                  disabled={saving}
                  icon={saving ? "fas fa-spinner fa-spin" : "fas fa-save"}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .settings-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .settings-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .tabs-list {
          padding: 1rem;
        }

        .tab-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          color: #94a3b8;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
        }

        .tab-button:hover {
          background: rgba(14, 165, 233, 0.1);
          color: #e2e8f0;
        }

        .tab-button.active {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(59, 130, 246, 0.1));
          color: #0ea5e9;
          border-left: 3px solid #0ea5e9;
        }

        .tab-button i {
          width: 20px;
          text-align: center;
        }

        .settings-form {
          padding: 2rem;
        }

        .settings-section h3 {
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

        .notification-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item,
        .security-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
        }

        .notification-info,
        .option-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .notification-info label,
        .option-info label {
          color: #f8fafc;
          font-weight: 500;
        }

        .notification-info span,
        .option-info span {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #374151;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background: #0ea5e9;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 1024px) {
          .settings-container {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            position: static;
          }

          .tabs-list {
            display: flex;
            overflow-x: auto;
            gap: 0.5rem;
          }

          .tab-button {
            white-space: nowrap;
            min-width: fit-content;
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-form {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
