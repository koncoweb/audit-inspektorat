import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiMail, FiImage, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { userService } from '../services/firebaseService';
import { cloudinaryService } from '../services/cloudinaryService';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import './UserProfile.css';

const UserProfile = ({ user, userProfile, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    address: '',
    bio: '',
    photoURL: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        department: userProfile.department || '',
        position: userProfile.position || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
        photoURL: userProfile.photoURL || ''
      });
    }
    setLoading(false);
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const uploadResult = await cloudinaryService.uploadFile(file, 'auditmorowaliutara/profiles');
      
      if (uploadResult && uploadResult.secure_url) {
        // Update local state immediately for real-time UI update
        handleInputChange('photoURL', uploadResult.secure_url);
        showMessage('success', 'Foto profil berhasil diupload');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Gagal mengupload foto profil');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profile.name,
        photoURL: profile.photoURL
      });

      // Update Firestore user document
      await userService.updateUser(user.uid, {
        name: profile.name,
        phone: profile.phone,
        department: profile.department,
        position: profile.position,
        address: profile.address,
        bio: profile.bio,
        photoURL: profile.photoURL
      });

      // Update email if changed
      if (profile.email !== user.email) {
        await updateEmail(user, profile.email);
        await userService.updateUser(user.uid, {
          email: profile.email
        });
      }

      showMessage('success', 'Profil berhasil diperbarui');
      onProfileUpdate({ ...userProfile, ...profile });
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Gagal memperbarui profil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password baru minimal 6 karakter');
      return;
    }

    try {
      setSaving(true);
      await updatePassword(user, passwordForm.newPassword);
      showMessage('success', 'Password berhasil diubah');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', 'Gagal mengubah password: ' + error.message);
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
      <div className="user-profile-loading">
        <FiRefreshCw className="spinning" />
        <p>Memuat profil pengguna...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Profil Admin</h2>
        <p>Kelola informasi profil dan keamanan akun</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <FiCheck /> : <FiX />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser />
          Informasi Profil
        </button>
        <button
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FiMail />
          Keamanan
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-form">
            <div className="form-section">
              <h3>Informasi Pribadi</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Masukkan email"
                  />
                </div>
                <div className="form-group">
                  <label>Nomor Telepon</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div className="form-group">
                  <label>Departemen</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Masukkan departemen"
                  />
                </div>
                <div className="form-group">
                  <label>Posisi/Jabatan</label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Masukkan posisi/jabatan"
                  />
                </div>
                <div className="form-group">
                  <label>Alamat</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Masukkan alamat"
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Bio/Deskripsi</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Masukkan bio atau deskripsi singkat"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Foto Profil</h3>
              <div className="photo-upload-section">
                <div className="current-photo">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt="Current Profile" />
                  ) : (
                    <div className="no-photo">
                      <FiUser />
                      <span>Belum ada foto</span>
                    </div>
                  )}
                </div>
                <div className="photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    disabled={uploading}
                    id="photo-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-button">
                    <FiImage />
                    {uploading ? 'Mengupload...' : 'Pilih Foto'}
                  </label>
                  {profile.photoURL && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('photoURL', '')}
                      className="remove-photo"
                    >
                      <FiX />
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="save-button"
              >
                <FiSave />
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-form">
            <div className="form-section">
              <h3>Ubah Password</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Password Lama</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Masukkan password lama"
                  />
                </div>
                <div className="form-group">
                  <label>Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Masukkan password baru"
                  />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </div>
              <div className="password-requirements">
                <h4>Persyaratan Password:</h4>
                <ul>
                  <li>Minimal 6 karakter</li>
                  <li>Gunakan kombinasi huruf dan angka</li>
                  <li>Hindari password yang mudah ditebak</li>
                </ul>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={saving || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="save-button"
                >
                  <FiSave />
                  {saving ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
