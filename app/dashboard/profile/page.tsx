'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Card, 
  Button, 
  PageHeader, 
  FormField, 
  Alert,
  Badge 
} from '@/components/dashboard/DashboardComponents';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  desktop_notifications: boolean;
  invoice_reminders: boolean;
  consultation_alerts: boolean;
  marketing_emails: boolean;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_alerts: boolean;
  session_timeout: number;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    timezone: 'Asia/Kolkata'
  });

  // OTP verification state
  const [otpVerification, setOtpVerification] = useState({
    email: {
      isChanging: false,
      newEmail: '',
      otpSent: false,
      otp: '',
      verified: false,
      timer: 0
    },
    phone: {
      isChanging: false,
      newPhone: '',
      otpSent: false,
      otp: '',
      verified: false,
      timer: 0
    }
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    desktop_notifications: false,
    invoice_reminders: true,
    consultation_alerts: true,
    marketing_emails: false
  });

  // Security settings
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_enabled: false,
    login_alerts: true,
    session_timeout: 60
  });

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: '',
        timezone: 'Asia/Kolkata'
      });
    }
    fetchUserSettings();
    requestNotificationPermission();
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/dashboard/profile/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.notifications) setNotifications(data.notifications);
        if (data.security) setSecurity(data.security);
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(prev => ({ ...prev, desktop_notifications: true }));
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/dashboard/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        await refreshUser();
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/dashboard/profile/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Password changed successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async (key: keyof NotificationSettings, value: boolean) => {
    // Handle desktop notifications permission
    if (key === 'desktop_notifications' && value && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage({ type: 'error', text: 'Please allow notifications in your browser settings' });
        return;
      }
    }

    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      const response = await fetch('/api/dashboard/profile/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotifications)
      });

      if (!response.ok) {
        // Revert on error
        setNotifications(notifications);
        setMessage({ type: 'error', text: 'Failed to update notification settings' });
      } else {
        setMessage({ type: 'success', text: 'Notification settings updated!' });
      }
    } catch (error) {
      setNotifications(notifications);
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const testDesktopNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('CFO Dashboard', {
        body: 'This is a test notification from your CFO Dashboard!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else {
      setMessage({ type: 'error', text: 'Desktop notifications are not available or not permitted' });
    }
  };

  // OTP verification functions
  const sendEmailOTP = async (newEmail: string) => {
    try {
      setOtpVerification(prev => ({
        ...prev,
        email: { ...prev.email, isChanging: true, newEmail }
      }));

      const response = await fetch('/api/dashboard/profile/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail })
      });

      if (response.ok) {
        setOtpVerification(prev => ({
          ...prev,
          email: { ...prev.email, otpSent: true, timer: 60 }
        }));
        setMessage({ type: 'success', text: 'OTP sent to your new email address!' });
        startTimer('email');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const sendPhoneOTP = async (newPhone: string) => {
    try {
      setOtpVerification(prev => ({
        ...prev,
        phone: { ...prev.phone, isChanging: true, newPhone }
      }));

      const response = await fetch('/api/dashboard/profile/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPhone })
      });

      if (response.ok) {
        setOtpVerification(prev => ({
          ...prev,
          phone: { ...prev.phone, otpSent: true, timer: 60 }
        }));
        setMessage({ type: 'success', text: 'OTP sent to your new phone number!' });
        startTimer('phone');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const verifyEmailOTP = async () => {
    try {
      const response = await fetch('/api/dashboard/profile/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newEmail: otpVerification.email.newEmail,
          otp: otpVerification.email.otp 
        })
      });

      if (response.ok) {
        setOtpVerification(prev => ({
          ...prev,
          email: { ...prev.email, verified: true }
        }));
        setProfileData(prev => ({ ...prev, email: otpVerification.email.newEmail }));
        setMessage({ type: 'success', text: 'Email updated successfully!' });
        
        // Reset OTP state after success
        setTimeout(() => {
          setOtpVerification(prev => ({
            ...prev,
            email: { isChanging: false, newEmail: '', otpSent: false, otp: '', verified: false, timer: 0 }
          }));
        }, 2000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const verifyPhoneOTP = async () => {
    try {
      const response = await fetch('/api/dashboard/profile/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newPhone: otpVerification.phone.newPhone,
          otp: otpVerification.phone.otp 
        })
      });

      if (response.ok) {
        setOtpVerification(prev => ({
          ...prev,
          phone: { ...prev.phone, verified: true }
        }));
        setProfileData(prev => ({ ...prev, phone: otpVerification.phone.newPhone }));
        setMessage({ type: 'success', text: 'Phone number updated successfully!' });
        
        // Reset OTP state after success
        setTimeout(() => {
          setOtpVerification(prev => ({
            ...prev,
            phone: { isChanging: false, newPhone: '', otpSent: false, otp: '', verified: false, timer: 0 }
          }));
        }, 2000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const startTimer = (type: 'email' | 'phone') => {
    const interval = setInterval(() => {
      setOtpVerification(prev => {
        const currentTimer = prev[type].timer;
        if (currentTimer <= 1) {
          clearInterval(interval);
          return {
            ...prev,
            [type]: { ...prev[type], timer: 0 }
          };
        }
        return {
          ...prev,
          [type]: { ...prev[type], timer: currentTimer - 1 }
        };
      });
    }, 1000);
  };

  const cancelOTPVerification = (type: 'email' | 'phone') => {
    setOtpVerification(prev => ({
      ...prev,
      [type]: { isChanging: false, newEmail: '', newPhone: '', otpSent: false, otp: '', verified: false, timer: 0 }
    }));
    setMessage({ type: 'success', text: `${type === 'email' ? 'Email' : 'Phone'} verification cancelled` });
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: 'fas fa-user' },
    { id: 'security', label: 'Security & Password', icon: 'fas fa-shield-alt' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' }
  ];

  return (
    <div className="profile-page">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account settings and preferences"
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile Settings' }
        ]}
      />

      {message && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <div className="profile-layout">
        <div className="profile-sidebar">
          <Card>
            <div className="user-info-card">
              <div className="user-avatar-large">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email}</p>
              <Badge variant="info" size="sm">{user?.role || 'User'}</Badge>
            </div>
            
            <nav className="profile-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="profile-content">
          <Card>
            {activeTab === 'profile' && (
              <div className="tab-content">
                <h3>Profile Information</h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-grid">
                    {/* Name Field */}
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                        disabled={saving}
                        className="form-input"
                      />
                    </div>

                    {/* Email Field with OTP Verification */}
                    <div className="form-group">
                      <label>Email Address</label>
                      {!otpVerification.email.isChanging ? (
                        <div className="input-with-action">
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="form-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newEmail = prompt('Enter new email address:');
                              if (newEmail && newEmail !== profileData.email) {
                                sendEmailOTP(newEmail);
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            disabled={saving}
                          >
                            <i className="fas fa-edit"></i> Change Email
                          </button>
                        </div>
                      ) : (
                        <div className="otp-verification-container">
                          <div className="otp-header">
                            <span>Verifying: {otpVerification.email.newEmail}</span>
                            <button
                              type="button"
                              onClick={() => cancelOTPVerification('email')}
                              className="btn btn-ghost btn-sm"
                            >
                              <i className="fas fa-times"></i> Cancel
                            </button>
                          </div>
                          
                          {otpVerification.email.otpSent && (
                            <div className="otp-input-section">
                              <div className="otp-input-group">
                                <input
                                  type="text"
                                  value={otpVerification.email.otp}
                                  onChange={(e) => setOtpVerification(prev => ({
                                    ...prev,
                                    email: { ...prev.email, otp: e.target.value }
                                  }))}
                                  placeholder="Enter 6-digit OTP"
                                  maxLength={6}
                                  className="form-input otp-input"
                                />
                                <button
                                  type="button"
                                  onClick={verifyEmailOTP}
                                  disabled={otpVerification.email.otp.length !== 6}
                                  className="btn btn-primary btn-sm"
                                >
                                  Verify
                                </button>
                              </div>
                              
                              <div className="otp-footer">
                                {otpVerification.email.timer > 0 ? (
                                  <span className="timer">Resend OTP in {otpVerification.email.timer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => sendEmailOTP(otpVerification.email.newEmail)}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    <i className="fas fa-redo"></i> Resend OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Phone Field with OTP Verification */}
                    <div className="form-group">
                      <label>Phone Number</label>
                      {!otpVerification.phone.isChanging ? (
                        <div className="input-with-action">
                          <input
                            type="tel"
                            value={profileData.phone}
                            disabled
                            className="form-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newPhone = prompt('Enter new phone number (with country code):');
                              if (newPhone && newPhone !== profileData.phone) {
                                sendPhoneOTP(newPhone);
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            disabled={saving}
                          >
                            <i className="fas fa-edit"></i> Change Phone
                          </button>
                        </div>
                      ) : (
                        <div className="otp-verification-container">
                          <div className="otp-header">
                            <span>Verifying: {otpVerification.phone.newPhone}</span>
                            <button
                              type="button"
                              onClick={() => cancelOTPVerification('phone')}
                              className="btn btn-ghost btn-sm"
                            >
                              <i className="fas fa-times"></i> Cancel
                            </button>
                          </div>
                          
                          {otpVerification.phone.otpSent && (
                            <div className="otp-input-section">
                              <div className="otp-input-group">
                                <input
                                  type="text"
                                  value={otpVerification.phone.otp}
                                  onChange={(e) => setOtpVerification(prev => ({
                                    ...prev,
                                    phone: { ...prev.phone, otp: e.target.value }
                                  }))}
                                  placeholder="Enter 6-digit OTP"
                                  maxLength={6}
                                  className="form-input otp-input"
                                />
                                <button
                                  type="button"
                                  onClick={verifyPhoneOTP}
                                  disabled={otpVerification.phone.otp.length !== 6}
                                  className="btn btn-primary btn-sm"
                                >
                                  Verify
                                </button>
                              </div>
                              
                              <div className="otp-footer">
                                {otpVerification.phone.timer > 0 ? (
                                  <span className="timer">Resend OTP in {otpVerification.phone.timer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => sendPhoneOTP(otpVerification.phone.newPhone)}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    <i className="fas fa-redo"></i> Resend OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Location Field */}
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={saving}
                        className="form-input"
                      />
                    </div>

                    {/* Bio Field */}
                    <div className="form-group full-width">
                      <label>Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        disabled={saving}
                        className="form-textarea"
                      />
                    </div>

                    {/* Timezone Field */}
                    <div className="form-group">
                      <label>Timezone</label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                        disabled={saving}
                        className="form-select"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={saving}
                      icon={saving ? "fas fa-spinner fa-spin" : "fas fa-save"}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-content">
                <h3>Security & Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-grid">
                    <FormField
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      error={passwordErrors.currentPassword}
                      required
                      disabled={saving}
                    />
                    <FormField
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      error={passwordErrors.newPassword}
                      required
                      disabled={saving}
                    />
                    <FormField
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      error={passwordErrors.confirmPassword}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="form-actions">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={saving}
                      icon={saving ? "fas fa-spinner fa-spin" : "fas fa-key"}
                    >
                      {saving ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>

                <div className="security-options">
                  <h4>Security Settings</h4>
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Two-Factor Authentication</strong>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="secondary" size="sm" disabled>
                      Coming Soon
                    </Button>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Login Alerts</strong>
                      <p>Get notified when someone signs into your account</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={security.login_alerts}
                        onChange={(e) => setSecurity({ ...security, login_alerts: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h3>Notification Preferences</h3>
                
                <div className="notification-section">
                  <h4>Communication</h4>
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Email Notifications</strong>
                      <p>Receive important updates via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.email_notifications}
                        onChange={(e) => handleNotificationUpdate('email_notifications', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Desktop Notifications</strong>
                      <p>Get browser notifications for important events</p>
                    </div>
                    <div className="setting-controls">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications.desktop_notifications}
                          onChange={(e) => handleNotificationUpdate('desktop_notifications', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                      {notifications.desktop_notifications && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={testDesktopNotification}
                          icon="fas fa-bell"
                        >
                          Test
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Push Notifications</strong>
                      <p>Receive notifications on your mobile device</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push_notifications}
                        onChange={(e) => handleNotificationUpdate('push_notifications', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-section">
                  <h4>Business Alerts</h4>
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Invoice Reminders</strong>
                      <p>Get notified about upcoming invoice due dates</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.invoice_reminders}
                        onChange={(e) => handleNotificationUpdate('invoice_reminders', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Consultation Alerts</strong>
                      <p>Receive alerts for upcoming consultations</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.consultation_alerts}
                        onChange={(e) => handleNotificationUpdate('consultation_alerts', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-section">
                  <h4>Marketing</h4>
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Marketing Emails</strong>
                      <p>Receive newsletters and promotional content</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.marketing_emails}
                        onChange={(e) => handleNotificationUpdate('marketing_emails', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-content">
                <h3>Preferences</h3>
                <div className="preferences-section">
                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Dashboard Theme</strong>
                      <p>Choose your preferred dashboard appearance</p>
                    </div>
                    <select className="theme-select">
                      <option value="dark">Dark Theme</option>
                      <option value="light" disabled>Light Theme (Coming Soon)</option>
                      <option value="auto" disabled>Auto (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Language</strong>
                      <p>Select your preferred language</p>
                    </div>
                    <select className="language-select">
                      <option value="en">English</option>
                      <option value="hi" disabled>Hindi (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <strong>Currency Display</strong>
                      <p>Default currency for financial data</p>
                    </div>
                    <select className="currency-select">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD" disabled>US Dollar ($) (Coming Soon)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .profile-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .user-info-card {
          text-align: center;
          padding: 2rem 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin: 0 auto 1rem;
          border: 3px solid rgba(14, 165, 233, 0.3);
        }

        .user-info-card h3 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 1.25rem;
        }

        .user-info-card p {
          margin: 0 0 1rem 0;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .profile-nav {
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
          margin-bottom: 0.25rem;
        }

        .nav-item:hover {
          background: rgba(14, 165, 233, 0.1);
          color: #0ea5e9;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #0ea5e9;
          border-left: 3px solid #0ea5e9;
        }

        .nav-item i {
          font-size: 1rem;
          width: 20px;
        }

        .tab-content {
          padding: 2rem;
        }

        .tab-content h3 {
          margin: 0 0 2rem 0;
          color: #f8fafc;
          font-size: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .tab-content h4 {
          margin: 2rem 0 1rem 0;
          color: #e2e8f0;
          font-size: 1.125rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
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

        .form-group textarea {
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          resize: vertical;
          font-family: inherit;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .security-options {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .notification-section {
          margin-bottom: 2rem;
        }

        .preferences-section {
          margin-top: 1rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .setting-info {
          flex: 1;
        }

        .setting-info strong {
          color: #f8fafc;
          font-size: 0.875rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .setting-info p {
          color: #94a3b8;
          font-size: 0.75rem;
          margin: 0;
        }

        .setting-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
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

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #374151;
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #0ea5e9;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .theme-select,
        .language-select,
        .currency-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 0.875rem;
          min-width: 180px;
        }

        .theme-select option,
        .language-select option,
        .currency-select option {
          background: #1e293b;
          color: #f8fafc;
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem;
          }

          .profile-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .profile-sidebar {
            position: static;
          }

          .tab-content {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .setting-controls {
            justify-content: flex-end;
          }
        }

        /* OTP Verification Styles */
        .input-with-action {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .input-with-action .form-input {
          flex: 1;
          background: rgba(30, 41, 59, 0.5);
          color: #94a3b8;
        }

        .otp-verification-container {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.5rem;
        }

        .otp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: #3b82f6;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .otp-input-section {
          margin-top: 1rem;
        }

        .otp-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .otp-input {
          width: 140px !important;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          letter-spacing: 0.2rem;
        }

        .otp-footer {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .timer {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          min-width: auto;
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }

        .btn-ghost:hover {
          background: rgba(148, 163, 184, 0.1);
          border-color: rgba(148, 163, 184, 0.5);
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 6px;
          background: rgba(30, 41, 59, 0.3);
          color: #f1f5f9;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled {
          background: rgba(30, 41, 59, 0.5);
          color: #64748b;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #e2e8f0;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
}
