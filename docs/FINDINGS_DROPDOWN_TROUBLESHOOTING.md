# Troubleshooting Dropdown Temuan Audit

## Masalah: Dropdown Temuan Tidak Memuat Data

### Gejala:
- Setelah memilih audit, dropdown temuan muncul tapi kosong
- Menampilkan "Tidak ada temuan tersedia"
- Padahal audit tersebut seharusnya memiliki temuan

## ⚠️ PENTING: Struktur Data Collection

### Collection Terpisah:
- **Collection `audits`**: Menyimpan data audit
- **Collection `audit_findings`**: Menyimpan data temuan audit
- **Hubungan**: Field `auditTitle` di `audit_findings` harus cocok dengan field `title` di `audits`

### Contoh Data Structure (Berdasarkan Gambar):
```javascript
// Collection: audits
{
  id: 'audit_keuangan_2023', // ← Document ID dari Firestore
  title: "Audit Keuangan Tahunan 2023", // ← Ini yang dipilih di dropdown
  status: "selesai",
  auditor: "Zainal",
  budget: "500000",
  // ... other fields
}

// Collection: audit_findings
{
  auditId: 'audit_keuangan_2023', // ← Harus sama dengan document ID dari audits
  auditTitle: "Audit Keuangan Tahunan 2023", // ← Harus sama dengan title audit
  findingNumber: "001/OP/2023",
  title: "Pencatatan Inventaris Tidak Akurat",
  recommendation: "Perbaiki sistem pencatatan inventaris",
  responsiblePerson: "Budi Santoso",
  severity: "Medium",
  status: "Belum Selesai",
  // ... other fields
}
```

### Field Mapping untuk Auto-fill:
- `finding.title` → `formData.title` (dengan prefix "Tindak Lanjut - ")
- `finding.recommendation` → `formData.recommendation`
- `finding.responsiblePerson` → `formData.assignedTo`

### Keuntungan Menggunakan auditId (Document ID):
- **Lebih Unik**: Document ID lebih unik daripada title yang bisa berubah
- **Search Lebih Akurat**: Query berdasarkan document ID lebih reliable
- **Referensi Konsisten**: Tidak terpengaruh perubahan title audit
- **Fallback**: Jika auditTitle tidak cocok, bisa fallback ke auditId
- **Firestore Best Practice**: Menggunakan document ID untuk referensi antar collection

## Langkah Debugging

### 1. Periksa Console Browser
Buka Developer Tools (F12) dan periksa console untuk:
- Error messages
- Debug logs dari fungsi `loadFindings`
- Data yang di-load

### 2. Test Debug Functions
Jalankan di browser console:

```javascript
// Debug semua temuan
import('./src/utils/debugFindings.js').then(module => {
  module.debugFindings().then(findings => {
    console.log('Debug results:', findings);
  });
});

// Check temuan untuk audit spesifik
import('./src/utils/debugFindings.js').then(module => {
  module.checkFindingsForAudit('Audit Keuangan Tahunan 2024').then(findings => {
    console.log('Findings for audit:', findings);
  });
});

// Check semua audit
import('./src/utils/debugFindings.js').then(module => {
  module.debugAudits().then(audits => {
    console.log('All audits:', audits);
  });
});

// Check konsistensi data
import('./src/utils/debugFindings.js').then(module => {
  module.checkDataConsistency();
});

// Ensure data exists and is properly connected
import('./src/utils/debugFindings.js').then(module => {
  module.ensureAuditFindingsData();
});

// Test complete flow
import('./src/utils/debugFindings.js').then(module => {
  module.testAuditFindingsFlow();
});
```

### 3. Test Seed Data
```javascript
// Load data temuan contoh
import('./src/utils/runSeed.js').then(module => {
  module.runFindingsSeedData().then(() => {
    console.log('Findings data added');
    // Reload modal untuk refresh dropdown
    window.location.reload();
  });
});

// Load semua data (audit + temuan + follow-up)
import('./src/utils/runSeed.js').then(module => {
  module.runAllSeedData().then(() => {
    console.log('All data added');
    window.location.reload();
  });
});

// Run all seed data with new utility
import('./src/utils/debugFindings.js').then(module => {
  module.runAllSeedData();
});

// Create fresh test data
import('./src/utils/debugFindings.js').then(module => {
  module.createTestData();
});
```

## Kemungkinan Penyebab

### 1. Data Temuan Belum Ada
**Gejala**: Collection `audit_findings` kosong
**Solusi**: Jalankan `ensureAuditFindingsData()` atau `createTestData()`

### 2. Mismatch Audit Title
**Gejala**: Data temuan ada tapi `auditTitle` tidak cocok dengan `title` audit
**Solusi**: Periksa apakah `auditTitle` di data temuan sama dengan yang dipilih

### 3. Firestore Rules Error
**Gejala**: Error permission denied di console
**Solusi**: Periksa Firestore rules untuk collection `audit_findings`

### 4. Collection Name Error
**Gejala**: Error collection not found
**Solusi**: Pastikan collection name adalah `audit_findings`

### 5. Data Consistency Issue
**Gejala**: Audit ada tapi temuan tidak terhubung
**Solusi**: Jalankan `checkDataConsistency()` untuk debug

### 6. Collection Terpisah Issue ⚠️ (NEW)
**Gejala**: Data ada di collection yang berbeda
**Solusi**: Pastikan query ke collection `audit_findings` bukan `audits`

## Quick Fixes

### Fix 1: Ensure Complete Data
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  module.ensureAuditFindingsData().then(() => {
    console.log('Data ensured');
    // Buka modal lagi untuk test
    document.querySelector('.add-button').click();
  });
});
```

### Fix 2: Create Fresh Test Data
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  module.createTestData().then(() => {
    console.log('Fresh test data created');
    window.location.reload();
  });
});
```

### Fix 3: Check Data Structure
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  module.checkDataConsistency().then(() => {
    console.log('Data consistency check completed');
  });
});
```

### Fix 4: Force Reload Modal
```javascript
// Di console browser
// Tutup modal jika terbuka
document.querySelector('.modal-close-button')?.click();
// Buka modal lagi
setTimeout(() => {
  document.querySelector('.add-button').click();
}, 500);
```

### Fix 5: Debug Info
Jika dropdown temuan kosong, gunakan debug info yang muncul di modal untuk melihat detail query yang dilakukan.

### Fix 6: Verify Data Structure (NEW)
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  module.verifyDataStructure().then(result => {
    console.log('Data structure verification completed');
    console.log('Target findings:', result.targetFindings);
  });
});
```

## Testing Checklist

### Manual Testing Steps:
1. [ ] Buka modal "Tambah Tindak Lanjut"
2. [ ] Pilih audit dari dropdown
3. [ ] Verifikasi dropdown temuan muncul
4. [ ] Periksa apakah ada opsi temuan
5. [ ] Jika kosong, klik "Muat Data Temuan Contoh"
6. [ ] Pilih temuan dan verifikasi auto-fill
7. [ ] Submit form

### Console Testing:
1. [ ] Jalankan `debugFindings()` - harus menampilkan data temuan
2. [ ] Jalankan `debugAudits()` - harus menampilkan data audit
3. [ ] Jalankan `checkDataConsistency()` - harus menampilkan konsistensi
4. [ ] Jalankan `checkFindingsForAudit('Audit Keuangan Tahunan 2024')` - harus menampilkan temuan
5. [ ] Jalankan `ensureAuditFindingsData()` - harus memastikan data ada
6. [ ] Jalankan `testAuditFindingsFlow()` - harus test flow lengkap
7. [ ] Periksa console logs saat memilih audit
8. [ ] Periksa console logs saat memilih temuan

## Expected Data Structure

### Findings Data Example:
```javascript
{
  id: 'finding_001',
  auditId: 'audit_keuangan_2024',
  auditTitle: 'Audit Keuangan Tahunan 2024', // Harus sama dengan audit yang dipilih
  findingNumber: 'F-001',
  title: 'Dokumentasi Transaksi Tidak Lengkap',
  description: 'Beberapa transaksi keuangan tidak memiliki dokumentasi pendukung yang lengkap',
  category: 'Keuangan',
  severity: 'Sedang',
  status: 'Terbuka',
  recommendation: 'Perbaiki sistem dokumentasi dan pengawasan transaksi keuangan',
  department: 'Keuangan',
  responsiblePerson: 'Manager Keuangan',
  dueDate: '2024-06-30',
  createdAt: '2024-03-15T00:00:00.000Z',
  updatedAt: '2024-03-15T00:00:00.000Z'
}
```

### Audit Data Example:
```javascript
{
  id: 'audit_001',
  title: 'Audit Keuangan Tahunan 2024', // Harus sama dengan auditTitle di findings
  description: 'Audit keuangan tahunan untuk periode 2024',
  type: 'Audit Keuangan',
  priority: 'Tinggi',
  status: 'Selesai',
  startDate: '2024-01-15',
  endDate: '2024-03-15',
  auditor: 'Tim Audit Internal',
  department: 'Keuangan',
  objectives: 'Memastikan laporan keuangan disajikan secara wajar',
  scope: 'Seluruh transaksi keuangan tahun 2024',
  findings: 'Ditemukan beberapa temuan minor terkait dokumentasi',
  recommendations: 'Perbaikan sistem dokumentasi dan pengawasan',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-03-15T00:00:00.000Z'
}
```

## Debug Commands

### Check Collection:
```javascript
// Di console browser
import('./src/firebase/config.js').then(config => {
  import('firebase/firestore').then(firestore => {
    const q = firestore.query(firestore.collection(config.db, 'audit_findings'));
    firestore.getDocs(q).then(snapshot => {
      console.log('All findings:', snapshot.docs.map(doc => doc.data()));
    });
  });
});
```

### Check Specific Audit:
```javascript
// Di console browser
import('./src/firebase/config.js').then(config => {
  import('firebase/firestore').then(firestore => {
    const q = firestore.query(
      firestore.collection(config.db, 'audit_findings'),
      firestore.where('auditTitle', '==', 'Audit Keuangan Tahunan 2024')
    );
    firestore.getDocs(q).then(snapshot => {
      console.log('Findings for audit:', snapshot.docs.map(doc => doc.data()));
    });
  });
});
```

### Check All Collections:
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  Promise.all([
    module.debugAudits(),
    module.debugFindings()
  ]).then(([audits, findings]) => {
    console.log('All data loaded:', { audits, findings });
  });
});
```

### Test Complete Flow:
```javascript
// Di console browser
import('./src/utils/debugFindings.js').then(module => {
  module.testAuditFindingsFlow().then(findings => {
    console.log('Flow test result:', findings);
  });
});
```

## Common Issues & Solutions

### Issue 1: "Tidak ada temuan tersedia"
**Cause**: Data temuan belum ada atau tidak terhubung dengan audit
**Solution**: Jalankan `ensureAuditFindingsData()` atau periksa data di collection `audit_findings`

### Issue 2: Auto-fill tidak bekerja
**Cause**: Data temuan tidak memiliki field yang diperlukan
**Solution**: Periksa struktur data temuan

### Issue 3: Dropdown tidak muncul
**Cause**: Audit belum dipilih
**Solution**: Pilih audit terlebih dahulu

### Issue 4: Error di console
**Cause**: Firestore rules atau network issue
**Solution**: Periksa console dan Firestore rules

### Issue 5: Data tidak konsisten
**Cause**: Audit title tidak cocok dengan finding auditTitle
**Solution**: Jalankan `checkDataConsistency()` untuk debug

### Issue 6: Collection terpisah tidak terhubung ⚠️ (NEW)
**Cause**: Query ke collection yang salah atau data tidak terhubung
**Solution**: Jalankan `testAuditFindingsFlow()` untuk test flow lengkap

## Support

Jika masih mengalami masalah:
1. Jalankan `ensureAuditFindingsData()` dan share hasilnya
2. Jalankan `testAuditFindingsFlow()` untuk test flow lengkap
3. Periksa browser console untuk error messages
4. Pastikan Firestore rules mengizinkan read untuk `audit_findings`
5. Test dengan data yang sudah ada
6. Periksa network tab untuk failed requests
7. Periksa debug info di modal untuk detail query
8. Periksa apakah collection `audit_findings` terpisah dari `audits`
