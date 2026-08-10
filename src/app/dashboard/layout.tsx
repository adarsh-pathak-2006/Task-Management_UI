'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  if (!mounted) return null;

  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Projects', path: '/dashboard/projects' },
    { name: 'Teams', path: '/dashboard/teams' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Task<span style={{ color: 'var(--primary-color)' }}>Hub</span>
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: '100%', borderColor: 'transparent', justifyContent: 'flex-start' }}
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          marginBottom: '2rem', 
          paddingBottom: '1rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {navItems.find(i => i.path === pathname)?.name || 'Dashboard'}
          </h1>
        </header>

        <div className="animate-fade-in" style={{ flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
