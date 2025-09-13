# Troubleshooting Reports Generation

## Masalah: Generate Laporan Tidak Berfungsi

### Gejala
- Klik tombol "Generate Laporan" tidak menghasilkan apa-apa
- Tidak ada error yang muncul di console
- Laporan tidak terbuat di database

### Langkah Troubleshooting

#### 1. **Periksa Console Browser**
Buka Developer Tools (F12) dan periksa tab Console untuk error messages.

**Expected logs saat generate laporan:**
```
🚀 Starting report generation...
Template: {title: "Laporan Audit", ...}
✅ reportService is available
📝 Report data prepared: {...}
🔍 Testing Firestore connection...
✅ Firestore connection OK, found X existing reports
💾 Creating report in Firestore...
✅ Report created successfully: {...}
🔄 Refreshing report data...
✅ Report data refreshed
🎉 Report generation completed successfully!
```

#### 2. **Test Koneksi Firestore**
Jalankan di browser console:
```javascript
// Test koneksi
await window.debugReports.testConnection();

// Test membuat report
await window.debugReports.createTestReport();

// Refresh data
await window.debugReports.refreshReports();
```

#### 3. **Periksa Authentication**
Pastikan user sudah login:
```javascript
// Cek status login
console.log('Auth state:', firebase.auth().currentUser);
```

#### 4. **Periksa Firestore Rules**
Pastikan rules untuk collection `reports` mengizinkan write:
```javascript
// Rules yang benar:
match /reports/{reportId} {
  allow read, write: if isAuthenticated();
}
```

#### 5. **Periksa Environment Variables**
Pastikan konfigurasi Firebase sudah benar di `.env.local`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

### Solusi Umum

#### **Solusi 1: Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Start ulang
npm start
```

#### **Solusi 2: Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Restart browser

#### **Solusi 3: Check Network Connection**
- Pastikan koneksi internet stabil
- Periksa apakah Firebase dapat diakses

#### **Solusi 4: Add Sample Data**
Jalankan script untuk menambahkan sample data:
```javascript
// Di browser console
await window.addSampleReports();
```

### Error Codes dan Solusi

#### **Error: "reportService is not available"**
- **Penyebab**: Import service gagal
- **Solusi**: Restart development server

#### **Error: "Firestore connection failed"**
- **Penyebab**: Koneksi ke Firebase bermasalah
- **Solusi**: 
  - Periksa internet connection
  - Periksa Firebase config
  - Periksa Firestore rules

#### **Error: "Permission denied"**
- **Penyebab**: Firestore rules tidak mengizinkan write
- **Solusi**: Update Firestore rules atau pastikan user sudah login

#### **Error: "Missing or insufficient permissions"**
- **Penyebab**: User tidak memiliki permission
- **Solusi**: Pastikan user sudah login dan memiliki role yang tepat

### Debug Commands

#### **Test Complete Flow**
```javascript
// Test lengkap generate laporan
async function testCompleteFlow() {
  console.log('🧪 Testing complete report generation flow...');
  
  // 1. Test connection
  const reports = await window.debugReports.testConnection();
  console.log('Connection test:', reports ? 'PASS' : 'FAIL');
  
  // 2. Test create report
  const newReport = await window.debugReports.createTestReport();
  console.log('Create test:', newReport ? 'PASS' : 'FAIL');
  
  // 3. Test refresh
  await window.debugReports.refreshReports();
  console.log('Refresh test: PASS');
  
  console.log('🎉 All tests completed!');
}

// Jalankan test
testCompleteFlow();
```

#### **Check Database State**
```javascript
// Cek state database
async function checkDatabaseState() {
  const reports = await window.debugReports.testConnection();
  console.log('Current reports in database:', reports);
  console.log('Total reports:', reports ? reports.length : 0);
}

checkDatabaseState();
```

### Contact Support

Jika masalah masih berlanjut:
1. Screenshot error message di console
2. Screenshot network tab di Developer Tools
3. Informasikan langkah-langkah yang sudah dicoba
4. Informasikan browser dan versi yang digunakan
