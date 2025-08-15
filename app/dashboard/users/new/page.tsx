'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  PageHeader 
} from '@/components/dashboard/DashboardComponents';

interface UserForm {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'consultant' | 'user';
  location: string;
}

export default function NewUserPage() {
  const router = useRouter();
  const [userForm, setUserForm] = useState<UserForm>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userForm.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!userForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userForm.role) {
      newErrors.role = 'Please select a user role';
    }

    if (userForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(userForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dashboard/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message and redirect
        router.push('/dashboard/users?success=user_created');
      } else {
        setErrors({ submit: result.error || 'Failed to create user' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ submit: 'An error occurred while creating the user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/users');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'fas fa-crown';
      case 'consultant': return 'fas fa-user-tie';
      case 'user': return 'fas fa-user';
      default: return 'fas fa-user';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-400';
      case 'consultant': return 'text-blue-400';
      case 'user': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="px-10">
      <PageHeader 
        title="New User" 
        subtitle="Create a new user account for the system"
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/dashboard/users' },
          { label: 'New User' }
        ]}
        actions={
          <Button 
            variant="secondary" 
            size="sm"
            icon="fas fa-arrow-left"
            onClick={handleCancel}
          >
            Back to Users
          </Button>
        }
      />

      <div className="dashboard-container">
        <div className="content-wrapper">
          {/* Main Form Card */}
          <Card gradient>
            <div className="form-container">
              <div className="form-header">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div>
                    <h2>User Information</h2>
                    <p>Fill in the details to create a new user account</p>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="error-banner">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{errors.submit}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="form-grid">
                {/* Full Name */}
                <div className="form-group half-width">
                  <label htmlFor="name">
                    <i className="fas fa-user"></i>
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userForm.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="user@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="fas fa-phone"></i>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userForm.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Role */}
                <div className="form-group">
                  <label htmlFor="role">
                    <i className="fas fa-user-tag"></i>
                    User Role <span className="required">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userForm.role}
                    onChange={handleInputChange}
                    className={errors.role ? 'error' : ''}
                    disabled={isSubmitting}
                  >
                    <option value="user">👤 User - Basic Access</option>
                    <option value="consultant">👔 Consultant - Consultation Management</option>
                    <option value="admin">👑 Admin - Full System Access</option>
                  </select>
                  {errors.role && <span className="error-text">{errors.role}</span>}
                </div>

                {/* Location */}
                <div className="form-group half-width">
                  <label htmlFor="location">
                    <i className="fas fa-map-marker-alt"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={userForm.location}
                    onChange={handleInputChange}
                    placeholder="City, State, Country"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Form Actions */}
                <div className="form-actions full-width">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    icon="fas fa-times"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    icon={isSubmitting ? "fas fa-spinner fa-spin" : "fas fa-user-plus"}
                  >
                    {isSubmitting ? 'Creating User...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Role Information Card */}
          <Card>
            <div className="role-info">
              <div className="role-header">
                <div className="flex items-center gap-3">
                  <i className={`${getRoleIcon(userForm.role)} ${getRoleColor(userForm.role)}`}></i>
                  <h3>Role: {userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)} Permissions</h3>
                </div>
              </div>
              <div className="role-permissions">
                {userForm.role === 'admin' && (
                  <ul>
                    <li><i className="fas fa-check"></i> Full system access and user management</li>
                    <li><i className="fas fa-check"></i> Can create, edit, and delete users</li>
                    <li><i className="fas fa-check"></i> Access to all dashboard features and reports</li>
                    <li><i className="fas fa-check"></i> Financial data and invoice management</li>
                  </ul>
                )}
                {userForm.role === 'consultant' && (
                  <ul>
                    <li><i className="fas fa-check"></i> Can manage consultations and client interactions</li>
                    <li><i className="fas fa-check"></i> Access to consultation dashboard and reports</li>
                    <li><i className="fas fa-check"></i> Can view and update client information</li>
                    <li><i className="fas fa-check"></i> Invoice generation for services</li>
                  </ul>
                )}
                {userForm.role === 'user' && (
                  <ul>
                    <li><i className="fas fa-check"></i> Basic access to user features</li>
                    <li><i className="fas fa-check"></i> Can book consultations and view personal data</li>
                    <li><i className="fas fa-check"></i> Limited dashboard access</li>
                    <li><i className="fas fa-check"></i> View personal invoices and payments</li>
                  </ul>
                )}
              </div>
            </div>
          </Card>

          {/* Help Cards */}
          <div className="help-cards-grid">
            <Card hover>
              <div className="help-card">
                <div className="help-icon">
                  <i className="fas fa-user-cog"></i>
                </div>
                <h3>User Roles</h3>
                <p>Choose the appropriate role based on the user's responsibilities and required access level.</p>
              </div>
            </Card>

            <Card hover>
              <div className="help-card">
                <div className="help-icon">
                  <i className="fas fa-envelope-open"></i>
                </div>
                <h3>Email Verification</h3>
                <p>Users will receive a welcome email with login instructions after account creation.</p>
              </div>
            </Card>

            <Card hover>
              <div className="help-card">
                <div className="help-icon">
                  <i className="fas fa-key"></i>
                </div>
                <h3>Default Password</h3>
                <p>New users are created with a default password that they should change on first login.</p>
              </div>
            </Card>
          </div>
        </div>

        <style jsx>{`
            .dashboard-users {
                padding: 2rem;
                min-height: 100vh;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }
            .dashboard-container {
                margin: 0 auto;
                max-width: 100%;
                min-height: 100vh;
                overflow-x: hidden; /* Prevent horizontal scroll on mobile */
            }

            .content-wrapper {
                max-width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .form-container {
                padding: 3rem;
            }

            .form-header {
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            }

            .form-header h2 {
                color: #e2e8f0;
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
            }

            .form-header p {
                color: #94a3b8;
                margin: 0.5rem 0 0 0;
                font-size: 0.9rem;
            }

            .icon-wrapper {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.25rem;
            }

            .error-banner {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #fca5a5;
            }

            .error-banner i {
                font-size: 1.125rem;
            }

            .form-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .form-group.full-width {
                grid-column: span 3;
            }

            .form-group.half-width {
                grid-column: span 2;
            }

            .form-group label {
                color: #e2e8f0;
                font-weight: 500;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .form-group label i {
                color: #3b82f6;
                width: 16px;
            }

            .required {
                color: #ef4444;
            }

            .form-group input,
            .form-group select {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 8px;
                padding: 0.75rem 1rem;
                color: #e2e8f0;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                min-height: 44px; /* Better touch target for mobile */
                -webkit-appearance: none; /* Remove default styling on iOS */
                -moz-appearance: none; /* Remove default styling on Firefox */
                background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23e2e8f0" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 12px;
                padding-right: 3rem;
            }

            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                transform: scale(1.02); /* Subtle scale on focus for mobile */
            }

            .form-group input::placeholder {
                color: #64748b;
            }

            .form-group input.error,
            .form-group select.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .form-group input:disabled,
            .form-group select:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .error-text {
                color: #fca5a5;
                font-size: 0.8rem;
                margin-top: 0.25rem;
            }

            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(59, 130, 246, 0.2);
            }

            /* Ensure buttons have proper touch targets on mobile */
            .form-actions :global(button) {
                min-height: 44px;
                padding: 0.75rem 1.5rem;
                font-size: 0.9rem;
                font-weight: 500;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            /* Large Desktop (1200px+) */
            @media (min-width: 1200px) {
                .dashboard-container {
                padding: 0 3rem;
                }

                .form-container {
                padding: 4rem;
                }

                .form-grid {
                gap: 3rem;
                }

                .help-cards-grid {
                gap: 3rem;
                }

                .help-card {
                padding: 2.5rem;
                }

                .form-group label {
                font-size: 1rem;
                }

                .form-group input,
                .form-group select {
                padding: 1rem 1.25rem;
                font-size: 1rem;
                }
            }

            /* Desktop (992px - 1199px) */
            @media (min-width: 992px) and (max-width: 1199px) {
                .dashboard-container {
                padding: 0 2.5rem;
                }

                .form-container {
                padding: 3.5rem;
                }

                .form-grid {
                gap: 2.5rem;
                }
            }

            /* Tablet Large (769px - 991px) */
            @media (min-width: 769px) and (max-width: 991px) {
                .dashboard-container {
                padding: 0 2rem;
                }

                .form-container {
                padding: 2.5rem;
                }

                .form-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                }

                .form-group.full-width,
                .form-group.half-width {
                grid-column: span 2;
                }
            }

            .role-info {
                padding: 1.5rem;
            }

            .role-header {
                margin-bottom: 1rem;
            }

            .role-header h3 {
                color: #e2e8f0;
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0;
            }

            .role-permissions ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                gap: 0.75rem;
            }

            .role-permissions li {
                color: #94a3b8;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.9rem;
            }

            .role-permissions li i {
                color: #10b981;
                font-size: 0.8rem;
            }

            .help-cards-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
            }

            .help-card {
                text-align: center;
                padding: 2rem;
            }

            .help-icon {
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem auto;
                color: white;
                font-size: 1.5rem;
            }

            .help-card h3 {
                color: #e2e8f0;
                font-size: 1rem;
                font-weight: 600;
                margin: 0 0 0.75rem 0;
            }

            .help-card p {
                color: #94a3b8;
                font-size: 0.85rem;
                line-height: 1.5;
                margin: 0;
            }

            @media (max-width: 768px) {
                .dashboard-container {
                padding: 0.5rem;
                }

                .form-container {
                padding: 1rem;
                }

                .form-header {
                margin-bottom: 1.5rem;
                text-align: center;
                }

                .form-header h2 {
                font-size: 1.25rem;
                }

                .form-header p {
                font-size: 0.85rem;
                }

                .icon-wrapper {
                width: 40px;
                height: 40px;
                font-size: 1rem;
                }

                .form-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
                }

                .form-group.full-width,
                .form-group.half-width {
                grid-column: span 1;
                }

                .form-group label {
                font-size: 0.85rem;
                }

                .form-group input,
                .form-group select {
                padding: 0.875rem;
                font-size: 0.9rem;
                }

                .form-actions {
                flex-direction: column-reverse;
                gap: 0.75rem;
                margin-top: 1.5rem;
                padding-top: 1rem;
                }

                .form-actions :global(button) {
                width: 100%;
                justify-content: center;
                min-height: 48px;
                font-size: 1rem;
                }

                .role-info {
                padding: 1rem;
                }

                .role-header h3 {
                font-size: 1rem;
                }

                .role-permissions li {
                font-size: 0.85rem;
                }

                .help-card {
                padding: 1rem;
                }

                .help-icon {
                width: 48px;
                height: 48px;
                font-size: 1.25rem;
                }

                .help-card h3 {
                font-size: 0.9rem;
                }

                .help-card p {
                font-size: 0.8rem;
                }

                .error-banner {
                padding: 0.75rem;
                font-size: 0.85rem;
                border-radius: 6px;
                }

                .error-text {
                font-size: 0.75rem;
                margin-top: 0.25rem;
                }
            }

            @media (max-width: 480px) {
                .dashboard-container {
                padding: 0.25rem;
                }

                .form-container {
                padding: 0.75rem;
                }

                .form-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 1rem;
                }

                .form-header h2 {
                font-size: 1.125rem;
                }

                .form-header p {
                font-size: 0.8rem;
                }

                .icon-wrapper {
                width: 36px;
                height: 36px;
                font-size: 0.9rem;
                }

                .form-grid {
                gap: 0.75rem;
                }

                .form-group label {
                font-size: 0.8rem;
                }

                .form-group input,
                .form-group select {
                padding: 0.75rem;
                font-size: 0.85rem;
                }

                .form-actions {
                gap: 0.5rem;
                margin-top: 1rem;
                }

                .form-actions :global(button) {
                width: 100%;
                justify-content: center;
                min-height: 50px;
                font-size: 1rem;
                padding: 1rem;
                }

                .role-info {
                padding: 0.75rem;
                }

                .role-permissions li {
                font-size: 0.8rem;
                }

                .help-card {
                padding: 0.75rem;
                }

                .help-icon {
                width: 40px;
                height: 40px;
                font-size: 1rem;
                margin-bottom: 0.75rem;
                }

                .help-card h3 {
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
                }

                .help-card p {
                font-size: 0.75rem;
                line-height: 1.4;
                }

                .error-banner {
                padding: 0.5rem;
                font-size: 0.8rem;
                flex-direction: column;
                text-align: center;
                gap: 0.5rem;
                }

                .required {
                display: block;
                margin-top: 0.25rem;
                }
            }
        `}</style>
      </div>
    </div>
  );
}
