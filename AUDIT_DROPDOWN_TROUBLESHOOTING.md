# Troubleshooting Dropdown Audit

## Masalah: Dropdown "Pilih Audit" Tidak Memuat Data

### 1. Periksa Console Browser
Buka Developer Tools (F12) dan periksa console untuk error messages terkait loading audits.

### 2. Test Loading Audits Manual
Jalankan di browser console:
```javascript
// Import dan test load audits
import('./src/utils/seedAuditData.js').then(module => {
  console.log('Testing audit loading...');
  module.seedAuditData().then(() => {
    console.log('Audit data added successfully');
  });
});
```

### 3. Periksa Data Audit di Firestore
Pastikan ada data audit di collection `audits` dengan status yang sesuai.

### 4. Test Load Audits Function
```javascript
// Di console browser
console.log('Testing loadAudits function...');
// Pastikan fungsi loadAudits dipanggil ketika modal dibuka
```

## Debugging Steps

### Step 1: Periksa Collection Name
```javascript
// Di console browser
console.log('Collection name:', 'audits');
```

### Step 2: Periksa Audit Status
```javascript
// Di console browser
// Status yang valid untuk audit selesai:
// - 'Selesai'
// - 'selesai' 
// - 'COMPLETED'
// - 'completed'
```

### Step 3: Periksa Firestore Rules
Pastikan Firestore rules mengizinkan read untuk collection `audits`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audits/{document} {
      allow read: if request.auth != null;
    }
  }
}
```

## Common Issues

### 1. Tidak Ada Data Audit
**Gejala**: Dropdown kosong atau menampilkan "Tidak ada audit tersedia"
**Solusi**: Jalankan seed audit data

### 2. Status Audit Tidak Sesuai
**Gejala**: Data audit ada tapi tidak muncul di dropdown
**Solusi**: Periksa status audit, harus salah satu dari: 'Selesai', 'selesai', 'COMPLETED', 'completed'

### 3. Firestore Rules Error
**Gejala**: Error permission denied di console
**Solusi**: Periksa dan update Firestore rules

### 4. Collection Name Error
**Gejala**: Error collection not found
**Solusi**: Pastikan collection name adalah 'audits'

## Quick Fixes

### Fix 1: Add Sample Audit Data
```javascript
// Di console browser
import('./src/utils/runSeed.js').then(module => {
  module.runAuditSeedData().then(() => {
    console.log('Audit data added');
    // Reload modal untuk refresh dropdown
    window.location.reload();
  });
});
```

### Fix 2: Check Existing Audits
```javascript
// Di console browser
// Periksa data audit yang ada
import('./src/firebase/config.js').then(config => {
  import('firebase/firestore').then(firestore => {
    const q = firestore.query(firestore.collection(config.db, 'audits'));
    firestore.getDocs(q).then(snapshot => {
      console.log('Existing audits:', snapshot.docs.map(doc => doc.data()));
    });
  });
});
```

### Fix 3: Force Load All Audits
```javascript
// Di console browser
// Buka modal dan force reload audits
document.querySelector('.add-button').click();
setTimeout(() => {
  // Force reload audits
  console.log('Forcing audit reload...');
}, 1000);
```

## Testing Checklist

- [ ] Console tidak menampilkan error saat loading audits
- [ ] Fungsi `loadAudits` dipanggil ketika modal dibuka
- [ ] Data audit berhasil di-load dari Firestore
- [ ] Dropdown menampilkan opsi audit yang tersedia
- [ ] Jika tidak ada data, menampilkan pesan "Tidak ada audit tersedia"
- [ ] Link "tambah data audit contoh" berfungsi
- [ ] Setelah menambah data audit, dropdown ter-refresh

## Environment Setup

### Required Data Structure
```javascript
{
  title: 'Judul Audit',
  status: 'Selesai', // atau 'COMPLETED', 'completed', 'selesai'
  description: 'Deskripsi audit',
  type: 'Audit Keuangan',
  priority: 'Tinggi',
  startDate: '2024-01-01',
  endDate: '2024-03-01',
  auditor: 'Tim Audit',
  department: 'Keuangan',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-03-01T00:00:00.000Z'
}
```

### Firestore Collection
- **Collection Name**: `audits`
- **Required Fields**: `title`, `status`
- **Optional Fields**: `description`, `type`, `priority`, `startDate`, `endDate`, `auditor`, `department`

## Support

Jika masih mengalami masalah:
1. Periksa browser console untuk error messages
2. Pastikan Firestore rules mengizinkan read
3. Periksa apakah ada data audit di Firestore
4. Test dengan menambahkan data audit contoh
5. Periksa network tab untuk failed requests
