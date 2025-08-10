import React, { useState } from 'react';
import { seedAllData, checkDataCount } from '../utils/seedData';
import { FiDatabase, FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [dataCounts, setDataCounts] = useState({});

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await seedAllData();
      setMessage('Data berhasil ditambahkan ke database!');
      setMessageType('success');
      
      // Refresh data counts
      const counts = await checkDataCount();
      setDataCounts(counts);
    } catch (error) {
      setMessage('Terjadi kesalahan saat menambahkan data: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckData = async () => {
    setLoading(true);
    
    try {
      const counts = await checkDataCount();
      setDataCounts(counts);
      setMessage('Data berhasil diperiksa!');
      setMessageType('success');
    } catch (error) {
      setMessage('Terjadi kesalahan saat memeriksa data: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FiDatabase />
          Admin Panel
        </h1>

        <p style={{
          color: '#64748b',
          marginBottom: '30px'
        }}>
          Panel administrasi untuk mengelola data awal aplikasi Si-MAIL.
        </p>

        {/* Message Display */}
        {message && (
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: messageType === 'success' ? '#d1fae5' : '#fef2f2',
            color: messageType === 'success' ? '#059669' : '#dc2626',
            border: `1px solid ${messageType === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}>
            {messageType === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleSeedData}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FiDatabase />
            {loading ? 'Memproses...' : 'Tambah Data Sample'}
          </button>

          <button
            onClick={handleCheckData}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FiRefreshCw />
            {loading ? 'Memproses...' : 'Periksa Data'}
          </button>
        </div>

        {/* Data Counts Display */}
        {Object.keys(dataCounts).length > 0 && (
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '15px'
            }}>
              Jumlah Data di Database
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {Object.entries(dataCounts).map(([collection, count]) => (
                <div key={collection} style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '5px'
                  }}>
                    {count}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    textTransform: 'capitalize'
                  }}>
                    {collection.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0369a1',
            marginBottom: '10px'
          }}>
            Informasi
          </h4>
          <ul style={{
            color: '#0c4a6e',
            fontSize: '14px',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Data sample akan ditambahkan ke Firebase Firestore</li>
            <li>Data yang sudah ada tidak akan diduplikasi</li>
            <li>Pastikan Firebase sudah dikonfigurasi dengan benar</li>
            <li>Halaman ini hanya untuk development/testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;
