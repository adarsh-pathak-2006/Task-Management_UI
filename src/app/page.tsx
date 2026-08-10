'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function LandingPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const data = await fetchApi('/auth/login/', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        await fetchApi('/auth/register/', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        // Auto login after register
        const data = await fetchApi('/auth/login/', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            Task<span style={{ color: 'var(--primary-color)' }}>Hub</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Welcome back! Log in to continue.' : 'Create an account to get started.'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger-color)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }} className="animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="input-label">First Name</label>
                <input
                  name="first_name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="input-label">Last Name</label>
                <input
                  name="last_name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Username</label>
            <input
              name="username"
              type="text"
              required
              className="input-field"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Email</label>
              <input
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Password</label>
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ 
              background: 'none', 
              color: 'var(--primary-color)', 
              fontWeight: 500,
              textDecoration: 'underline' 
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
