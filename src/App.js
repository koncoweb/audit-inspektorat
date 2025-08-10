import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PerencanaanAudit from './pages/PerencanaanAudit';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get page title and subtitle based on current route
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Dashboard',
          subtitle: 'Selamat datang di Si-MAIL Sistem Manajemen Audit Internal'
        };
      case '/perencanaan':
        return {
          title: 'Si-MAIL',
          subtitle: 'Sistem Manajemen Audit Internal'
        };
      case '/admin':
        return {
          title: 'Admin Panel',
          subtitle: 'Kelola pengaturan sistem'
        };
      default:
        return {
          title: 'Si-MAIL',
          subtitle: 'Sistem Manajemen Audit Internal'
        };
    }
  };

  const pageInfo = getPageInfo();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          Memuat Si-MAIL...
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login and register routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show main app layout
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header 
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          user={{
            name: user.displayName || user.email?.split('@')[0] || 'Dr. Ahmad Rahman',
            role: 'Administrator'
          }}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/perencanaan" element={<PerencanaanAudit />} />
          <Route path="/pelaksanaan" element={<div>Pelaksanaan Audit Page</div>} />
          <Route path="/temuan" element={<div>Temuan Audit Page</div>} />
          <Route path="/laporan" element={<div>Laporan Page</div>} />
          <Route path="/dokumen" element={<div>Dokumen Page</div>} />
          <Route path="/tindak-lanjut" element={<div>Tindak Lanjut Page</div>} />
          <Route path="/manajemen-user" element={<div>Manajemen User Page</div>} />
          <Route path="/panduan" element={<div>Panduan Page</div>} />
          <Route path="/pengaturan" element={<div>Pengaturan Page</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
