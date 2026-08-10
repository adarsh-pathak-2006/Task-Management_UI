'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  created_by: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', status: 'PLANNED' });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/projects/my-projects/');
      setProjects(Array.isArray(data) ? data : data.results ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/projects/my-projects/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowCreate(false);
      setFormData({ name: '', description: '', status: 'PLANNED' });
      loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your active initiatives.</p>
        <button onClick={() => { setShowCreate(!showCreate); setError(''); }} className="btn btn-primary">
          {showCreate ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {error && (
        <div className="animate-fade-in" style={{
          padding: '1rem', borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)',
          border: '1px solid rgba(239,68,68,0.3)'
        }}>{error}</div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-panel animate-slide-up" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Project</h3>
          <div className="input-group">
            <label className="input-label">Project Name</label>
            <input required type="text" className="input-field" placeholder="e.g. Marketing Campaign"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea required className="input-field" style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="What is this project about?"
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create Project</button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 400 }}>No projects yet. Create one to get started!</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => {
            const statusColors: Record<string, string> = {
              PLANNED: 'rgba(99,102,241,0.15)',
              ACTIVE: 'rgba(16,185,129,0.15)',
              COMPLETED: 'rgba(59,130,246,0.15)',
              ON_HOLD: 'rgba(245,158,11,0.15)',
            };
            const statusText: Record<string, string> = {
              PLANNED: '#818cf8', ACTIVE: '#34d399', COMPLETED: '#60a5fa', ON_HOLD: '#fbbf24'
            };
            return (
              <div key={project.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.3 }}>{project.name}</h3>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)',
                    backgroundColor: statusColors[project.status] ?? 'rgba(99,102,241,0.15)',
                    color: statusText[project.status] ?? '#818cf8', whiteSpace: 'nowrap', flexShrink: 0
                  }}>{project.status.replace('_', ' ')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1, lineHeight: 1.6 }}>{project.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
