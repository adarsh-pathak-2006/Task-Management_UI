'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Team {
  id: number;
  name: string;
  specialization: string;
  description: string;
  members: { id: number }[];
  project: { id: number; name: string }[];
  created_at: string;
}

interface Project {
  id: number;
  name: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    description: '',
    project: [] as number[],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamsData, projectsData] = await Promise.all([
        fetchApi('/teams/'),
        fetchApi('/projects/my-projects/'),
      ]);
      setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results ?? []);
      setMyProjects(Array.isArray(projectsData) ? projectsData : projectsData.results ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/teams/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowCreate(false);
      setFormData({ name: '', specialization: '', description: '', project: [] });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    }
  };

  const toggleProject = (id: number) => {
    setFormData(prev => ({
      ...prev,
      project: prev.project.includes(id)
        ? prev.project.filter(p => p !== id)
        : [...prev.project, id],
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Collaborate and organise your groups.</p>
        <button onClick={() => { setShowCreate(!showCreate); setError(''); }} className="btn btn-primary">
          {showCreate ? 'Cancel' : '+ New Team'}
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
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Team</h3>
          <div className="input-group">
            <label className="input-label">Team Name</label>
            <input required type="text" className="input-field" placeholder="e.g. Frontend Engineers"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Specialization</label>
            <input required type="text" className="input-field" placeholder="e.g. UI/UX Design, Backend Development"
              value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea required className="input-field" style={{ minHeight: '90px', resize: 'vertical' }}
              placeholder="What does this team do?"
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          {myProjects.length > 0 && (
            <div className="input-group">
              <label className="input-label">Assign to Projects (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {myProjects.map(p => (
                  <button key={p.id} type="button" onClick={() => toggleProject(p.id)}
                    style={{
                      padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem',
                      border: '1px solid',
                      borderColor: formData.project.includes(p.id) ? 'var(--primary-color)' : 'var(--border-color)',
                      backgroundColor: formData.project.includes(p.id) ? 'rgba(99,102,241,0.15)' : 'transparent',
                      color: formData.project.includes(p.id) ? 'var(--primary-color)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Team</button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 400 }}>No teams yet. Create one to get started!</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {teams.map(team => (
            <div key={team.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>{team.name}</h3>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem',
                  backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399',
                  borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', flexShrink: 0
                }}>
                  {team.members?.length ?? 0} Member{team.members?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 500 }}>{team.specialization}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{team.description}</p>
              {team.project?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.5rem' }}>
                  {team.project.map((p: any) => (
                    <span key={p.id ?? p} style={{
                      fontSize: '0.72rem', padding: '0.2rem 0.5rem',
                      backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {p.name ?? `Project #${p}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
