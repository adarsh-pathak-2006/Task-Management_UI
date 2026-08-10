'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  owner: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNED'
  });

  const loadProjects = async () => {
    try {
      const data = await fetchApi('/projects/');
      // Assuming DRF paginated response or direct array
      setProjects(data.results || data);
    } catch (error: any) {
      setError(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/projects/my-projects/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowCreate(false);
      setFormData({ name: '', description: '', status: 'PLANNED' });
      loadProjects();
    } catch (error: any) {
      setError(error.message || 'Failed to create project');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your active initiatives.</p>
        <button 
          onClick={() => setShowCreate(!showCreate)} 
          className="btn btn-primary"
        >
          {showCreate ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-panel animate-slide-up" style={{ padding: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Project</h3>
          <div className="input-group">
            <label className="input-label">Project Name</label>
            <input required type="text" className="input-field" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea required className="input-field" style={{ minHeight: '100px', resize: 'vertical' }}
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
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
        <div style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No projects found. Create one to get started!</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <div key={project.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all var(--transition-fast)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.name}</h3>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                  color: 'var(--primary-color)',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>{project.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
