import { appSettingsService } from '../services/firebaseService';

// Default app settings
const defaultAppSettings = {
  appName: 'Si-MAIL',
  appSubtitle: 'Sistem Manajemen Audit Internal',
  organizationName: 'Inspektorat Kabupaten Morowali Utara',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  email: 'inspektorat@morowaliutarakab.go.id',
  phone: '+62-xxx-xxxx-xxxx',
  address: 'Jl. Raya Poso - Tentena, Kabupaten Morowali Utara, Sulawesi Tengah',
  website: 'https://morowaliutarakab.go.id',
  description: 'Sistem Manajemen Audit Internal untuk Inspektorat Kabupaten Morowali Utara',
  version: '1.0.0'
};

// Initialize app settings if they don't exist
export const initializeAppSettings = async () => {
  try {
    const existingSettings = await appSettingsService.getAppSettings();
    
    if (!existingSettings) {
      console.log('Initializing default app settings...');
      await appSettingsService.createAppSettings(defaultAppSettings);
      console.log('Default app settings created successfully');
    } else {
      console.log('App settings already exist');
    }
  } catch (error) {
    console.error('Error initializing app settings:', error);
  }
};

export default initializeAppSettings;
