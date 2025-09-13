import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiRefreshCw } from 'react-icons/fi';
import { userService } from '../services/firebaseService';
import { auth } from '../firebase/config';
import AppSettings from '../components/AppSettings';
import UserProfile from '../components/UserProfile';
import './Pengaturan.css';

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('app-settings');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await userService.getUserById(user.uid);
          setUser(user);
          setUserProfile(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const tabs = [
    {
      id: 'app-settings',
      label: 'Pengaturan Aplikasi',
      icon: FiSettings,
      description: 'Kelola nama aplikasi, logo, dan pengaturan umum'
    },
    {
      id: 'user-profile',
      label: 'Profil Admin',
      icon: FiUser,
      description: 'Kelola informasi profil dan akun admin'
    }
  ];

  if (loading) {
    return (
      <div className="pengaturan-loading">
        <div className="loading-spinner">
          <FiRefreshCw className="spinning" />
        </div>
        <p>Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="pengaturan-container">
      <div className="pengaturan-header">
        <h1>Pengaturan Sistem</h1>
        <p>Kelola pengaturan aplikasi dan profil admin</p>
      </div>

      <div className="pengaturan-content">
        <div className="pengaturan-sidebar">
          <div className="tabs-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="tab-icon" />
                  <div className="tab-content">
                    <span className="tab-label">{tab.label}</span>
                    <span className="tab-description">{tab.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pengaturan-main">
          <div className="tab-panel">
            {activeTab === 'app-settings' && (
              <AppSettings />
            )}
            {activeTab === 'user-profile' && (
              <UserProfile 
                user={user} 
                userProfile={userProfile} 
                onProfileUpdate={setUserProfile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
