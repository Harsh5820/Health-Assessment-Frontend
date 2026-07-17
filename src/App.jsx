import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch (error) {
        console.error('Auth error', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}><div className="spinner"></div></div>;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {user && <Navbar user={user} setUser={setUser} />}
        
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login setUser={setUser} />} 
            />
            
            <Route 
              path="/admin" 
              element={
                <PrivateRoute user={user} roleRequired="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute user={user} roleRequired="user">
                  <UserDashboard user={user} />
                </PrivateRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
