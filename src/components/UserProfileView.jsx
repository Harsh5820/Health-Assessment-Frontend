import React, { useState } from 'react';
import { Activity, MapPin, Briefcase, Calendar, Target, Heart, X, User as UserIcon, Sparkles } from 'lucide-react';
import api from '../api';
import HealthMetricsTracker from './HealthMetricsTracker';

const UserProfileView = ({ user, reports }) => {
  const [selectedReportView, setSelectedReportView] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiError, setAiError] = useState('');
  
  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    setAiError('');
    try {
      const res = await api.post('/insights/generate', { user, reports });
      setAiInsights(res.data.data);
    } catch (err) {
      console.error(err);
      setAiError(err.response?.data?.message || 'Failed to generate AI insights. Make sure the API key is configured correctly.');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (!latestReport) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Activity size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>No Reports Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>We don't have any health reports on file for you yet. Please check back later or contact your administrator.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
      
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{user.name}</h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.email} &mdash; Patient ID: #{user.client_id || user._id.toString().slice(-6).toUpperCase()}</div>
      </div>

      <HealthMetricsTracker reports={reports} user={user} />
      
      {/* AI Health Insights Section */}
      <div className="card" style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4c1d95', marginBottom: '0.5rem' }}>
              <Sparkles size={20} color="#8b5cf6" /> Personalized AI Insights
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get tailored wellness advice based on your current health attributes and goals.</p>
          </div>
          
          {!aiInsights && (
            <button 
              onClick={handleGenerateInsights} 
              disabled={loadingInsights}
              className="btn"
              style={{ backgroundColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}
            >
              {loadingInsights ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span> : <Sparkles size={16} />}
              {loadingInsights ? 'Generating...' : 'Generate Insights'}
            </button>
          )}
        </div>

        {aiError && (
           <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', color: 'var(--danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
             {aiError}
           </div>
        )}

        {aiInsights && (
           <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', fontSize: '0.95rem', lineHeight: '1.6', color: '#334155' }}>
              {/* Render HTML safely since it's from our own controlled backend prompt */}
              <div dangerouslySetInnerHTML={{ __html: aiInsights }} />
           </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      
        {/* Latest Report Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Latest Health Profile
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: '8px' }}>
                  <Heart size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Condition</div>
                  <div style={{ fontWeight: 500 }}>{user.health_condition || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                  <UserIcon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Profile</div>
                  <div style={{ fontWeight: 500 }}>
                    {user.age ? `${user.age} yrs` : 'Age N/A'} • <span style={{ textTransform: 'capitalize' }}>{user.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: '#f0fdfa', color: '#0d9488', borderRadius: '8px' }}>
                  <Target size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Beauty Goal</div>
                  <div style={{ fontWeight: 500 }}>{user.beauty_goal || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: '#f8fafc', color: '#64748b', borderRadius: '8px' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontWeight: 500 }}>{user.city ? `${user.city}, ${user.state}` : 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: '#fffbeb', color: '#d97706', borderRadius: '8px' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Occupation</div>
                  <div style={{ fontWeight: 500 }}>{user.occupation || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc' }}>
             <div style={{ padding: '1rem', background: '#e2e8f0', borderRadius: '50%', color: 'var(--text-main)' }}>
               <Calendar size={24} />
             </div>
             <div>
               <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last Updated</div>
               <div style={{ fontWeight: 600 }}>{new Date(latestReport.report_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
             </div>
          </div>
        </div>

        {/* Report History */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} /> Test Results History
          </h2>
          
          <div className="table-container" style={{ flex: 1 }}>
            <table>
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Report ID</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...reports]
                  .filter(report => report.report_id)
                  .sort((a, b) => new Date(b.report_date) - new Date(a.report_date))
                  .map((report, index) => (
                  <tr key={report._id}>
                    <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      #{index + 1}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {report.report_id || 'N/A'}
                    </td>
                    <td>{new Date(report.report_date).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => setSelectedReportView(report)}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* View Details Modal */}
      {selectedReportView && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '2rem'
        }}>
          <div className="card hide-scrollbar" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedReportView(null)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', paddingRight: '2rem' }}>
              Report Details <span style={{fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>{selectedReportView.report_id} &mdash; {new Date(selectedReportView.report_date).toLocaleDateString()}</span>
            </h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Hemoglobin', key: 'hemoglobin', unit: 'g/dL' },
                    { label: 'Vitamin D', key: 'vitamin_d', unit: 'ng/mL' },
                    { label: 'Cholesterol', key: 'cholesterol', unit: 'mg/dL' },
                    { label: 'Blood Sugar (Fasting)', key: 'blood_sugar_fasting', unit: 'mg/dL' },
                    { label: 'Creatinine', key: 'creatinine', unit: 'mg/dL' },
                    { label: 'Urine Protein', key: 'urine_protein', unit: '' },
                    { label: 'BMI', key: 'bmi', unit: 'kg/m²' },
                    { label: "Doctor's Notes", key: 'doctor_notes', unit: '' },
                  ].map(({ label, key, unit }) => (
                    selectedReportView[key] !== null && selectedReportView[key] !== undefined && (
                      <tr key={key}>
                        <td style={{ fontWeight: 500 }}>{label}</td>
                        <td>
                          {String(selectedReportView[key])}
                          {unit && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>{unit}</span>}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
