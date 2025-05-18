import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call the login API
      const res = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save the JWT token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('teacherName', data.teacher.teacherName);

      // Redirect to dashboard
      router.push('/dashboard/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="text-center">
          <h2 className="heading">Teacher Login</h2>
          <p className="subheading">Sign in to access your dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <div className="input-field">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c;
          padding: 3rem 1rem;
        }
        
        .login-box {
          max-width: 28rem;
          width: 100%;
          background-color: #2d3748;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          margin: 0 auto;
        }
        
        .text-center {
          text-align: center;
        }
        
        .heading {
          font-size: 1.875rem;
          font-weight: 700;
          color: #a78bfa;
          margin: 0;
        }
        
        .subheading {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #a0aec0;
        }
        
        .login-form {
          margin-top: 2rem;
        }
        
        .input-container {
          margin-bottom: 1.5rem;
        }
        
        .input-field {
          margin-bottom: 1rem;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        
        .form-input {
          appearance: none;
          border-radius: 0.5rem;
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #4a5568;
          border: 1px solid #4b5563;
          color: white;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #8b5cf6;
          border-color: transparent;
        }
        
        .form-input::placeholder {
          color: #a0aec0;
        }
        
        .error-message {
          background-color: rgba(127, 29, 29, 0.4);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .submit-button {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0.75rem 1rem;
          border: 1px solid transparent;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.5rem;
          color: white;
          background-color: #8b5cf6;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .submit-button:hover {
          background-color: #7c3aed;
        }
        
        .submit-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px #8b5cf6, 0 0 0 4px rgba(139, 92, 246, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login;