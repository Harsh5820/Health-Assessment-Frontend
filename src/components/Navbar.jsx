import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div style={{
          width: '32px', height: '32px', backgroundColor: 'var(--primary)', 
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
          H
        </div>
        Healthcare Portal
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <UserIcon size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {user?.name} <span style={{ textTransform: 'capitalize', fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>({user?.role})</span>
          </span>
        </div>
        
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
