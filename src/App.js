import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { userService } from './services/firebaseService';
import { initializeAppSettings } from './utils/initializeAppSettings';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PerencanaanAudit from './pages/PerencanaanAudit';
import ManajemenUser from './pages/ManajemenUser';
import PelaksanaanAudit from './pages/PelaksanaanAudit';
import TemuanAudit from './pages/TemuanAudit';
import Laporan from './pages/Laporan';
import Dokumen from './pages/Dokumen';
import TindakLanjut from './pages/TindakLanjut';
import Pengaturan from './pages/Pengaturan';
import Panduan from './pages/Panduan';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { appSettings } = useAppSettings();

  useEffect(() => {
    // Initialize app settings
    initializeAppSettings();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Ensure user exists in Firestore
          const userData = await userService.ensureUserExists(user);
          setUserProfile(userData);
        } catch (error) {
          console.error('Error ensuring user exists:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get page title and subtitle based on current route using dynamic app settings
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Dashboard',
          subtitle: `Selamat datang di ${appSettings.appName || 'Aplikasi'} ${appSettings.appSubtitle || ''}`.trim()
        };
      case '/perencanaan':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/pelaksanaan':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/temuan':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/laporan':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/dokumen':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/tindak-lanjut':
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
      case '/admin':
        return {
          title: 'Admin Panel',
          subtitle: 'Kelola pengaturan sistem'
        };
      case '/panduan':
        return {
          title: 'Panduan Penggunaan',
          subtitle: 'Step-by-step penggunaan aplikasi'
        };
      case '/pengaturan':
        return {
          title: 'Pengaturan',
          subtitle: 'Kelola pengaturan aplikasi dan profil'
        };
      default:
        return {
          title: appSettings.appName || 'Aplikasi',
          subtitle: appSettings.appSubtitle || ''
        };
    }
  };

  const pageInfo = getPageInfo();
  const isAdmin = (userProfile?.role === 'Administrator' || userProfile?.role === 'Admin');

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
          {`Memuat ${appSettings.appName || 'Aplikasi'}...`}
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
            name: userProfile?.name || user.displayName || user.email?.split('@')[0] || 'User',
            role: userProfile?.role || 'Auditor'
          }}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/perencanaan" element={<PerencanaanAudit />} />
          <Route path="/pelaksanaan" element={<PelaksanaanAudit />} />
          <Route path="/temuan" element={<TemuanAudit />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/dokumen" element={<Dokumen />} />
          <Route path="/tindak-lanjut" element={<TindakLanjut />} />
          <Route path="/manajemen-user" element={isAdmin ? <ManajemenUser /> : <Navigate to="/" replace />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
