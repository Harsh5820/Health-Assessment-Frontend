import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, Users, Search, ChevronLeft, ChevronRight, Activity, X, Download } from 'lucide-react';
import UserProfileView from '../../components/UserProfileView';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [testFile, setTestFile] = useState(null);
  const [uploadingTests, setUploadingTests] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&search=${search}`);
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, [searchTerm]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage('');

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: res.data.message });
      setFile(null);
      // Refresh user list
      fetchUsers(1, searchTerm);
      // Reset input
      document.getElementById('file-upload').value = '';
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload data' });
    } finally {
      setUploading(false);
    }
  };

  const handleTestFileChange = (e) => {
    setTestFile(e.target.files[0]);
  };

  const handleUploadTestResults = async (e) => {
    e.preventDefault();
    if (!testFile) return;

    const formData = new FormData();
    formData.append('file', testFile);

    setUploadingTests(true);
    setTestMessage('');

    try {
      const res = await api.post('/admin/upload-test-results', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTestMessage({ type: 'success', text: res.data.message });
      setTestFile(null);
      fetchUsers(1, searchTerm);
      document.getElementById('test-file-upload').value = '';
    } catch (err) {
      setTestMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload test results' });
    } finally {
      setUploadingTests(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/admin/template', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Report_Upload_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to download template file.' });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  const handleViewDetails = async (userId) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    setSelectedUser(null);
    setUserReports([]);
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data.data.user);
      setUserReports(res.data.data.reports);
    } catch (err) {
      console.error('Failed to fetch user details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserReports([]);
    setSelectedReportView(null);
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        
        {/* Sidebar / Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} /> Upload Data
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Upload an Excel (.xlsx) or CSV file containing user health reports.
            </p>
            
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  id="file-upload"
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.875rem', width: '100%' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!file || uploading}
                style={{ width: '100%' }}
              >
                {uploading ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : 'Upload File'}
              </button>
            </form>

            {message && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                borderRadius: '6px', 
                fontSize: '0.875rem',
                backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {message.text}
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} /> Upload Test Results
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Upload new medical reports (requires client_id)
            </p>
            
            <form onSubmit={handleUploadTestResults}>
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  id="test-file-upload"
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleTestFileChange}
                  style={{ fontSize: '0.875rem', width: '100%' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!testFile || uploadingTests}
                style={{ width: '100%' }}
              >
                {uploadingTests ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : 'Upload Tests'}
              </button>
            </form>
            
            <button 
              type="button"
              onClick={handleDownloadTemplate}
              className="btn" 
              style={{ width: '100%', marginTop: '0.75rem', backgroundColor: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px solid #cbd5e1' }}
            >
              <Download size={16} /> Download Excel Template
            </button>

            {testMessage && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                borderRadius: '6px', 
                fontSize: '0.875rem',
                backgroundColor: testMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: testMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${testMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {testMessage.text}
              </div>
            )}
          </div>

        </div>

        {/* Main Content / Users Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Patient Directory
            </h2>
            
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search by name or email..." 
                style={{ paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="table-container" style={{ flex: 1 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map(user => (
                        <tr key={user._id}>
                          <td style={{ fontWeight: 500 }}>{user.name}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                          <td>
                            <span style={{ 
                              background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px', 
                              fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize' 
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => handleViewDetails(user._id)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Showing page {pagination.page} of {pagination.pages}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '2rem'
        }}>
          <div className="card hide-scrollbar" style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={closeModal}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', paddingRight: '2rem' }}>
              Patient Details
            </h2>

            {loadingDetails ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
              </div>
            ) : selectedUser ? (
              <div style={{ marginTop: '1rem' }}>
                <UserProfileView user={selectedUser} reports={userReports} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--danger)' }}>Failed to load details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
