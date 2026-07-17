import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Activity } from 'lucide-react';
import UserProfileView from '../../components/UserProfileView';

const UserDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReportView, setSelectedReportView] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/user/reports');
        setReports(res.data.data.history);
        setLatestReport(res.data.data.latestReport);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is an overview of your recent health and wellness reports.</p>
      </div>

      {!latestReport ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Activity size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>No Reports Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>We don't have any health reports on file for you yet. Please check back later or contact your administrator.</p>
        </div>
      ) : (
        <UserProfileView user={user} reports={reports} />
      )}
    </div>
  );
};

export default UserDashboard;
