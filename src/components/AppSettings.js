import React, { useState, useEffect } from 'react';
import { FiSave, FiImage, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { cloudinaryService } from '../services/cloudinaryService';
import { useAppSettings } from '../contexts/AppSettingsContext';
import './AppSettings.css';

const AppSettings = () => {
  const { appSettings, loading, updateAppSettings } = useAppSettings();
  const [settings, setSettings] = useState({
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

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (appSettings) {
      setSettings(prev => ({ ...prev, ...appSettings }));
    }
  }, [appSettings]);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    try {
      setUploading(true);
      const folder = type === 'logoUrl' ? 'auditmorowaliutara/app/logo' : 'auditmorowaliutara/app/favicon';
      const uploadResult = await cloudinaryService.uploadFile(file, folder);
      
      if (uploadResult && uploadResult.secure_url) {
        // Update local state immediately for real-time UI update
        handleInputChange(type, uploadResult.secure_url);
        
        // Update global app settings context immediately
        const updatedSettings = { ...settings, [type]: uploadResult.secure_url };
        await updateAppSettings(updatedSettings);
        
        showMessage('success', `${type === 'logoUrl' ? 'Logo' : 'Favicon'} berhasil diupload dan tersimpan`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', `Gagal mengupload ${type === 'logoUrl' ? 'logo' : 'favicon'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAppSettings(settings);
      showMessage('success', 'Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="app-settings-loading">
        <FiRefreshCw className="spinning" />
        <p>Memuat pengaturan aplikasi...</p>
      </div>
    );
  }

  return (
    <div className="app-settings">
      <div className="settings-header">
        <h2>Pengaturan Aplikasi</h2>
        <p>Kelola informasi dan tampilan aplikasi</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <FiCheck /> : <FiX />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="settings-form">
        <div className="form-section">
          <h3>Informasi Aplikasi</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nama Aplikasi</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleInputChange('appName', e.target.value)}
                placeholder="Masukkan nama aplikasi"
              />
            </div>
            <div className="form-group">
              <label>Subtitle Aplikasi</label>
              <input
                type="text"
                value={settings.appSubtitle}
                onChange={(e) => handleInputChange('appSubtitle', e.target.value)}
                placeholder="Masukkan subtitle aplikasi"
              />
            </div>
            <div className="form-group">
              <label>Nama Organisasi</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Masukkan nama organisasi"
              />
            </div>
            <div className="form-group">
              <label>Versi Aplikasi</label>
              <input
                type="text"
                value={settings.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="Masukkan versi aplikasi"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Logo dan Tampilan</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Logo Aplikasi</label>
              <div className="file-upload-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'logoUrl')}
                  disabled={uploading}
                  id="logo-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="logo-upload" className="file-upload-button">
                  <FiImage />
                  {uploading ? 'Mengupload...' : 'Pilih Logo'}
                </label>
                {settings.logoUrl && (
                  <div className="image-preview">
                    <img src={settings.logoUrl} alt="Logo Preview" />
                    <button
                      type="button"
                      onClick={() => handleInputChange('logoUrl', '')}
                      className="remove-image"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Favicon</label>
              <div className="file-upload-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'faviconUrl')}
                  disabled={uploading}
                  id="favicon-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="favicon-upload" className="file-upload-button">
                  <FiImage />
                  {uploading ? 'Mengupload...' : 'Pilih Favicon'}
                </label>
                {settings.faviconUrl && (
                  <div className="image-preview">
                    <img src={settings.faviconUrl} alt="Favicon Preview" />
                    <button
                      type="button"
                      onClick={() => handleInputChange('faviconUrl', '')}
                      className="remove-image"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Warna Primer</label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Warna Sekunder</label>
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Informasi Kontak</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Masukkan email kontak"
              />
            </div>
            <div className="form-group">
              <label>Telepon</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="Masukkan URL website"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Alamat</label>
            <textarea
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>
          <div className="form-group full-width">
            <label>Deskripsi</label>
            <textarea
              value={settings.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Masukkan deskripsi aplikasi"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="save-button"
          >
            <FiSave />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
