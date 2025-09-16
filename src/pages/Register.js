import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { userService } from '../services/firebaseService';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { useAppSettings } from '../contexts/AppSettingsContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { appSettings } = useAppSettings();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Save user data to Firestore
      await userService.createUser({
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.name,
        role: 'user',
        status: 'active'
      });

      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email sudah terdaftar');
          break;
        case 'auth/invalid-email':
          setError('Format email tidak valid');
          break;
        case 'auth/weak-password':
          setError('Password terlalu lemah');
          break;
        default:
          setError('Terjadi kesalahan saat registrasi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: '12px',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            {appSettings.logoUrl ? (
              <img 
                src={appSettings.logoUrl} 
                alt="Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <FiShield style={{ color: 'white', fontSize: '24px' }} />
            )}
          </div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a202c'
          }}>
            Registrasi {appSettings.appName || 'Aplikasi'}
          </h1>
          <p style={{
            margin: '0',
            color: '#718096',
            fontSize: '14px'
          }}>
            {appSettings.appSubtitle || 'Sistem'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fed7d7',
            border: '1px solid #feb2b2',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#c53030',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Nama Lengkap
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiUser style={{
                position: 'absolute',
                left: '12px',
                color: '#a0aec0',
                fontSize: '16px'
              }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Email
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiMail style={{
                position: 'absolute',
                left: '12px',
                color: '#a0aec0',
                fontSize: '16px'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Masukkan email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiLock style={{
                position: 'absolute',
                left: '12px',
                color: '#a0aec0',
                fontSize: '16px'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Konfirmasi Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiLock style={{
                position: 'absolute',
                left: '12px',
                color: '#a0aec0',
                fontSize: '16px'
              }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Konfirmasi password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        {/* Login Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{
            margin: '0',
            color: '#718096',
            fontSize: '14px'
          }}>
            Sudah punya akun?{' '}
            <Link
              to="/login"
              style={{
                color: '#1e3c72',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
