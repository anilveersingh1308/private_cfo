'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button 
} from '@/components/admin/AdminComponents';

export default function AdminSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Mock authentication - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      // For demo purposes, accept any valid email/password combination
      if (formData.email === 'admin@privatecfo.com' && formData.password === 'admin123') {
        // Simulate successful login
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin');
      } else {
        throw new Error('Invalid credentials. Try admin@privatecfo.com / admin123');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address.');
  };

  return (
    <div className="admin-signin">
      <div className="signin-container">
        {/* Header */}
        <div className="signin-header">
          <div className="logo">
            <i className="fas fa-shield-alt"></i>
            <span>Admin Portal</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access the Private CFO admin dashboard</p>
        </div>

        {/* Sign In Form */}
        <Card className="signin-card">
          <form onSubmit={handleSubmit} className="signin-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={loading ? "fas fa-spinner fa-spin" : "fas fa-sign-in-alt"}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="demo-credentials">
            <div className="demo-header">
              <i className="fas fa-info-circle"></i>
              <span>Demo Credentials</span>
            </div>
            <div className="demo-info">
              <p><strong>Email:</strong> admin@privatecfo.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="signin-footer">
          <p>© 2024 Private CFO. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/support">Support</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-signin {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .admin-signin::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .signin-container {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }

        .signin-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.3);
          border-radius: 50px;
          color: #0ea5e9;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .logo i {
          font-size: 1.25rem;
        }

        .signin-header h1 {
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
          font-size: 2rem;
          font-weight: 700;
        }

        .signin-header p {
          margin: 0;
          color: #94a3b8;
          font-size: 1rem;
        }

        .signin-form {
          padding: 2rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #f8fafc;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .input-wrapper input::placeholder {
          color: #64748b;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #f8fafc;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkbox-custom {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 3px;
          background: rgba(15, 23, 42, 0.8);
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background: #0ea5e9;
          border-color: #0ea5e9;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .forgot-password {
          background: none;
          border: none;
          color: #0ea5e9;
          font-size: 0.875rem;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #38bdf8;
          text-decoration: underline;
        }

        .demo-credentials {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: #22c55e;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .demo-info p {
          margin: 0.25rem 0;
          color: #94a3b8;
          font-size: 0.875rem;
          font-family: 'Courier New', monospace;
        }

        .demo-info strong {
          color: #f8fafc;
        }

        .signin-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .signin-footer p {
          margin: 0 0 1rem 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .footer-links a {
          color: #94a3b8;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #0ea5e9;
        }

        @media (max-width: 640px) {
          .admin-signin {
            padding: 1rem;
          }

          .signin-container {
            max-width: 100%;
          }

          .signin-form {
            padding: 1.5rem;
          }

          .signin-header h1 {
            font-size: 1.75rem;
          }

          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .footer-links {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
