import React, { createContext, useContext, useState, useEffect } from 'react';
import { appSettingsService } from '../services/firebaseService';

const AppSettingsContext = createContext();

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export const AppSettingsProvider = ({ children }) => {
  const [appSettings, setAppSettings] = useState({
    appName: 'Si-MAIL',
    appSubtitle: 'Sistem Manajemen Audit Internal',
    organizationName: 'Inspektorat Kabupaten Morowali Utara',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    version: '1.0.0'
  });
  const [loading, setLoading] = useState(true);

  const loadAppSettings = async () => {
    try {
      setLoading(true);
      const settings = await appSettingsService.getAppSettings();
      if (settings) {
        setAppSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppSettings = async (newSettings) => {
    try {
      await appSettingsService.updateAppSettings(newSettings);
      // Update state immediately for real-time UI update
      setAppSettings(prev => ({ ...prev, ...newSettings }));
      console.log('App settings updated successfully:', newSettings);
      return true;
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
  };

  const refreshAppSettings = () => {
    loadAppSettings();
  };

  useEffect(() => {
    loadAppSettings();
  }, []);

  const value = {
    appSettings,
    loading,
    updateAppSettings,
    refreshAppSettings
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};
