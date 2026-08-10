'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Team {
  id: number;
  name: string;
  leader: number;
  members: any[];
  project_id: number;
  project_name?: string; // If API returns it
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    project: '' // Using project ID string
  });

  const loadTeams = async () => {
    try {
      const data = await fetchApi('/teams/');
      setTeams(data.results || data);
    } catch (error: any) {
      setError(error.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/teams/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          project: parseInt(formData.project)
        })
      });
      setShowCreate(false);
      setFormData({ name: '', project: '' });
      loadTeams();
    } catch (error: any) {
      setError(error.message || 'Failed to create team');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Collaborate and organize your groups.</p>
        <button 
          onClick={() => setShowCreate(!showCreate)} 
          className="btn btn-primary"
        >
          {showCreate ? 'Cancel' : 'New Team'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-panel animate-slide-up" style={{ padding: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Team</h3>
          <div className="input-group">
            <label className="input-label">Team Name</label>
            <input required type="text" className="input-field" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Project ID</label>
            <input required type="number" className="input-field" placeholder="1"
              value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter the ID of the project this team belongs to.</span>
          </div>
          <button type="submit" className="btn btn-primary">Create Team</button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No teams found.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {teams.map(team => (
            <div key={team.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{team.name}</h3>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--success-color)',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {team.members?.length || 0} Members
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Assigned Project ID: <strong style={{ color: 'var(--text-main)' }}>{team.project_id || 'N/A'}</strong>
              </div>
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>Manage Members</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
