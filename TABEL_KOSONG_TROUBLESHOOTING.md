# Troubleshooting: Tabel Daftar Laporan Kosong

## Masalah: Tabel Daftar Laporan Kosong Setelah Generate

### Gejala
- Generate laporan berhasil (tidak ada error)
- Tabel "Daftar Laporan" tetap kosong
- Tidak ada data yang muncul di tabel

### Langkah Troubleshooting

#### 1. **Periksa Console Browser**
Buka Developer Tools (F12) dan periksa tab Console untuk logs.

**Expected logs saat load halaman:**
```
🔄 Fetching report data...
📊 Fetching dashboard stats...
📈 Fetching trend data...
📋 Fetching reports data...
📋 Raw reports data: [...]
📋 Reports count: X
🔄 Transforming reports data...
📝 Transforming report 1: {...}
✅ Transformed report 1: {...}
📋 Final transformed reports: [...]
📋 Final reports count: X
✅ Report data fetched and set successfully
🏁 Fetch report data completed
```

#### 2. **Test Koneksi dan Data**
Jalankan di browser console:
```javascript
// Test koneksi Firestore
await window.debugReports.testConnection();

// Lihat semua data state
window.debugReports.showAllData();

// Test membuat report
await window.debugReports.createTestReport();

// Refresh data
await window.debugReports.refreshReports();
```

#### 3. **Periksa Filter**
Kemungkinan filter terlalu ketat:
```javascript
// Clear semua filter
window.debugReports.clearFilters();

// Atau set filter manual
setFilterType('Semua Jenis');
setFilterYear('Semua Tahun');
```

#### 4. **Add Sample Data untuk Testing**
```javascript
// Tambahkan sample data
await window.debugReports.addSampleData();

// Atau gunakan script langsung
await window.addSampleReportsDirect();
```

### Debug Commands Lengkap

#### **Test Complete Flow**
```javascript
async function testCompleteFlow() {
  console.log('🧪 Testing complete flow...');
  
  // 1. Test connection
  const reports = await window.debugReports.testConnection();
  console.log('1. Connection test:', reports ? 'PASS' : 'FAIL');
  
  // 2. Show current state
  window.debugReports.showAllData();
  
  // 3. Clear filters
  window.debugReports.clearFilters();
  
  // 4. Add sample data
  await window.debugReports.addSampleData();
  
  // 5. Show final state
  window.debugReports.showAllData();
  
  console.log('🎉 Complete flow test finished!');
}

// Jalankan test
testCompleteFlow();
```

#### **Check Data Flow**
```javascript
async function checkDataFlow() {
  console.log('🔍 Checking data flow...');
  
  // 1. Check raw Firestore data
  const rawData = await window.debugReports.testConnection();
  console.log('Raw Firestore data:', rawData);
  
  // 2. Check current state
  window.debugReports.showAllData();
  
  // 3. Check filtered data
  const filtered = getFilteredReports();
  console.log('Filtered data:', filtered);
  
  // 4. Force refresh
  await window.debugReports.refreshReports();
  
  console.log('🔍 Data flow check completed!');
}

checkDataFlow();
```

### Kemungkinan Penyebab dan Solusi

#### **Penyebab 1: Data Tidak Tersimpan ke Firestore**
**Gejala**: Generate berhasil tapi tidak ada data di database
**Solusi**:
```javascript
// Test create report
await window.debugReports.createTestReport();
```

#### **Penyebab 2: Data Tersimpan Tapi Tidak Ter-load**
**Gejala**: Data ada di Firestore tapi tidak muncul di UI
**Solusi**:
```javascript
// Force refresh
await window.debugReports.refreshReports();
```

#### **Penyebab 3: Filter Terlalu Ketat**
**Gejala**: Data ada tapi ter-filter semua
**Solusi**:
```javascript
// Clear filters
window.debugReports.clearFilters();
```

#### **Penyebab 4: Error dalam Transformasi Data**
**Gejala**: Raw data ada tapi transformed data kosong
**Solusi**: Periksa console untuk error dalam transformasi

#### **Penyebab 5: State Management Issue**
**Gejala**: Data ter-load tapi tidak ter-set ke state
**Solusi**: Periksa console untuk error dalam setState

### Quick Fix Commands

#### **Reset Everything**
```javascript
async function resetEverything() {
  console.log('🔄 Resetting everything...');
  
  // Clear filters
  window.debugReports.clearFilters();
  
  // Refresh data
  await window.debugReports.refreshReports();
  
  // Show state
  window.debugReports.showAllData();
  
  console.log('✅ Reset completed!');
}

resetEverything();
```

#### **Force Add Sample Data**
```javascript
async function forceAddSample() {
  console.log('🚀 Force adding sample data...');
  
  // Add sample data
  await window.debugReports.addSampleData();
  
  // Clear filters
  window.debugReports.clearFilters();
  
  // Show final state
  window.debugReports.showAllData();
  
  console.log('✅ Sample data added!');
}

forceAddSample();
```

### Expected Console Output

#### **Saat Load Halaman (Normal)**
```
🔄 Fetching report data...
📊 Fetching dashboard stats...
📈 Fetching trend data...
📋 Fetching reports data...
📋 Raw reports data: [{id: "...", title: "...", ...}]
📋 Reports count: 2
🔄 Transforming reports data...
📝 Transforming report 1: {id: "...", title: "...", ...}
✅ Transformed report 1: {id: "...", title: "...", ...}
📋 Final transformed reports: [{id: "...", title: "...", ...}]
📋 Final reports count: 2
✅ Report data fetched and set successfully
🏁 Fetch report data completed
```

#### **Saat Generate Report (Normal)**
```
🚀 Starting report generation...
Template: {title: "Laporan Audit", ...}
✅ reportService is available
📝 Report data prepared: {...}
🔍 Testing Firestore connection...
✅ Firestore connection OK, found 2 existing reports
💾 Creating report in Firestore...
✅ Report created successfully: {...}
🔄 Refreshing report data...
🔄 Fetching report data...
📋 Raw reports data: [{...}, {...}, {...}]
📋 Reports count: 3
✅ Report data refreshed
🎉 Report generation completed successfully!
```

### Contact Support

Jika masalah masih berlanjut:
1. Screenshot console logs lengkap
2. Jalankan `window.debugReports.showAllData()` dan screenshot hasilnya
3. Informasikan langkah-langkah yang sudah dicoba
4. Informasikan browser dan versi yang digunakan
