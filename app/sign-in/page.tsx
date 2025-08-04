'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      // Navigation will be handled by useEffect
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0d0e1b'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #4f46e5',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #0d0e1b !important;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMGQwZTFiIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxNDE1MjQiPjwvcmVjdD4KPC9zdmc+') !important;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #0d0e1b;
        }

        .login-wrapper {
          display: flex;
          gap: 3rem;
          max-width: 1000px;
          width: 100%;
          align-items: stretch;
        }

        .features-section {
          flex: 1;
          background: rgba(22, 33, 58, 0.5);
          border: 1.5px solid rgba(128, 128, 128, 0.2);
          border-radius: 18px;
          padding: 3rem 2.5rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-card {
          flex: 1;
          background: rgba(22, 33, 58, 0.5);
          border: 1.5px solid rgba(128, 128, 128, 0.2);
          border-radius: 18px;
          padding: 3rem 2.5rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          color: #FFFFFF;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .highlight {
          color: #FFD700;
        }

        .login-header p {
          color: #B0B5C1;
          font-size: 1rem;
          margin: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #b0c4d8;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #E8E8E8;
          border: none;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: #222;
          transition: box-shadow 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 178, 255, 0.2);
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(90deg, #00458a 0%, #0076c6 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 1rem;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 169, 224, 0.2);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .remember-me input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .remember-me label {
          color: #B0B5C1;
          font-size: 0.9rem;
          margin: 0;
          cursor: pointer;
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }

        .alert-error {
          background-color: rgba(220, 53, 69, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .admin-features {
          margin: 0;
          padding: 0;
        }

        .admin-features h3 {
          color: #FFFFFF;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-align: left;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
        }

        .admin-features p {
          color: #B0B5C1;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          color: #B0B5C1;
          font-size: 1rem;
          padding: 0.8rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(176, 181, 193, 0.1);
        }

        .feature-list li:last-child {
          border-bottom: none;
        }

        .feature-list li::before {
          content: "✓";
          color: #FFD700;
          font-weight: bold;
          font-size: 1.2rem;
          min-width: 20px;
        }

        .back-link {
          text-align: center;
          margin-top: 2rem;
        }

        .back-link a {
          color: #B0B5C1;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .back-link a:hover {
          color: #FFFFFF;
        }

        .demo-credentials {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(176, 181, 193, 0.1);
          text-align: center;
        }

        .demo-credentials p {
          color: #B0B5C1;
          font-size: 0.85rem;
          margin: 0.3rem 0;
        }

        .font-medium {
          font-weight: 600;
          color: #FFFFFF;
        }

        .text-warning {
          color: #fbbf24;
        }

        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
            gap: 2rem;
          }

          .features-section {
            order: 2;
            padding: 2rem 1.5rem;
          }

          .login-card {
            order: 1;
            padding: 2rem 1.5rem;
          }

          .login-header h1 {
            font-size: 1.8rem;
          }

          .admin-features h3 {
            font-size: 1.5rem;
            text-align: center;
          }

          .feature-list li {
            font-size: 0.9rem;
            padding: 0.6rem 0;
          }
        }
      `}</style>
      
      <div className="login-container">
        <div className="login-wrapper">
          {/* Dashboard Features Section (Left) */}
          <div className="features-section">
            <div className="admin-features">
              <h3>Employee <span className="highlight">Portal</span></h3>
              <p>Powerful tools to manage your consultations and track your performance efficiently.</p>
              <ul className="feature-list">
                <li>Track your consultation requests</li>
                <li>View consultation history</li>
                <li>Performance analytics</li>
                <li>Client interaction records</li>
                <li>Real-time notifications</li>
                <li>Personal dashboard insights</li>
              </ul>
            </div>
          </div>

          {/* Login Form Section (Right) */}
          <div className="login-card">
            <div className="login-header">
              <h1>Employee <span className="highlight">Login</span></h1>
              <p>Access your Private CFO portal</p>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="loginForm">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>

              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me for 30 days</label>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Portal'}
              </button>
            </form>

            <div className="back-link">
              <Link href="/">← Back to website</Link>
            </div>

            <div className="demo-credentials">
              <p className="font-medium">Demo Credentials:</p>
              <p>Admin: admin@privatecfo.com / admin123</p>
              <p className="text-warning">Change password after first login!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
