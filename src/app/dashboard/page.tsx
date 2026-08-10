'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Profile {
  id: number;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  role: string;
}

export default function DashboardOverview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile/me/');
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading your overview...</div>;
  }

  if (!profile) {
    return <div>Could not load profile data.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Welcome back,</h2>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {profile.user.first_name} {profile.user.last_name}
        </h1>
        <p style={{ color: 'var(--primary-color)', fontWeight: 500 }}>@{profile.user.username}</p>
        
        <div style={{ 
          marginTop: '2rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Account Email</p>
            <p style={{ fontWeight: 500 }}>{profile.user.email}</p>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>System Role</p>
            <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
