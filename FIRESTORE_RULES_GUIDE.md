# Panduan Firestore Rules untuk Si-MAIL

## Overview
Dokumen ini menjelaskan cara mengatur dan mendeploy Firestore security rules untuk aplikasi Si-MAIL Sistem Manajemen Audit Internal.

## ⚠️ Temporary Testing Rules

**Untuk testing dan development**, gunakan rules yang sudah dimodifikasi di file `firestore.rules`. Rules ini memungkinkan:

- **Any authenticated user** dapat mengakses data (tidak perlu role spesifik)
- **User records** otomatis dibuat saat login pertama kali
- **CRUD operations** tersedia untuk semua user yang terautentikasi

### Deploy Testing Rules
```bash
# Deploy temporary rules untuk testing
firebase deploy --only firestore:rules
```

### Production Rules
Setelah testing selesai, ganti dengan rules yang lebih ketat untuk production.

## Struktur Rules

### 1. Helper Functions
Rules menggunakan beberapa fungsi helper untuk memvalidasi akses:

- `isAuthenticated()`: Memastikan user sudah login
- `isAdmin()`: Memvalidasi role Administrator
- `isAuditor()`: Memvalidasi role Auditor  
- `isSupervisor()`: Memvalidasi role Supervisor
- `isAuthorizedUser()`: Memvalidasi user yang memiliki akses
- `isOwner(userId)`: Memvalidasi kepemilikan data
- `hasValidAuditPlanData()`: Memvalidasi struktur data audit plan
- `hasValidWorkPaperData()`: Memvalidasi struktur data kertas kerja
- `hasValidEvidenceData()`: Memvalidasi struktur data bukti audit
- `hasValidNoteData()`: Memvalidasi struktur data catatan audit

### 2. Collection Rules

#### Users Collection
```javascript
match /users/{userId} {
  allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow create: if isAuthenticated(); // Allow any authenticated user to create their own record
  allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow delete: if isAdmin();
}
```

#### Audit Plans Collection
```javascript
match /audit_plans/{planId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser() && hasValidAuditPlanData();
  allow update: if isAuthorizedUser() && hasValidAuditPlanData();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Audits Collection
```javascript
match /audits/{auditId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser();
  allow update: if isAuthorizedUser();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Work Papers Collection
```javascript
match /work_papers/{workPaperId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser() && hasValidWorkPaperData();
  allow update: if isAuthorizedUser() && hasValidWorkPaperData();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Audit Evidence Collection
```javascript
match /audit_evidence/{evidenceId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser() && hasValidEvidenceData();
  allow update: if isAuthorizedUser() && hasValidEvidenceData();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Audit Notes Collection
```javascript
match /audit_notes/{noteId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser() && hasValidNoteData();
  allow update: if isAuthorizedUser() && hasValidNoteData();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Audit Findings Collection
```javascript
match /audit_findings/{findingId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow update: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user
}
```

#### Documents Collection
```javascript
match /documents/{documentId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser();
  allow update: if isAuthorizedUser();
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user to delete
}
```

#### Follow-ups Collection
```javascript
match /follow_ups/{followUpId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow update: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user
}
```

#### Reports Collection
```javascript
match /reports/{reportId} {
  allow read: if isAuthorizedUser();
  allow create: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow update: if isAuthorizedUser(); // Temporary: allow any authorized user
  allow delete: if isAuthorizedUser(); // Temporary: allow any authorized user
}
```

## Validasi Data

### Audit Plan Data
Rules memvalidasi struktur data audit plan dengan ketentuan:

#### Required Fields
- `title`: String (1-200 karakter)
- `department`: String (1-100 karakter)
- `type`: Enum ['Audit Keuangan', 'Audit Kinerja', 'Audit Kepatuhan', 'Audit Operasional', 'Audit Sistem']
- `priority`: Enum ['Tinggi', 'Sedang', 'Rendah']
- `status`: Enum ['Draft', 'Disetujui', 'Berlangsung', 'Selesai']
- `auditor`: String
- `period`: String
- `description`: String
- `scope`: String
- `objectives`: String
- `budget`: Number (>= 0)
- `riskLevel`: Enum ['Low', 'Medium', 'High']
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Work Paper Data
Rules memvalidasi struktur data kertas kerja dengan ketentuan:

#### Required Fields
- `auditId`: String (ID audit yang terkait)
- `title`: String (1-200 karakter)
- `description`: String
- `type`: Enum ['Pengujian Substantif', 'Pengujian Prosedur', 'Analisis', 'Lainnya']
- `status`: Enum ['Draft', 'Dalam Proses', 'Review', 'Selesai']
- `assignedTo`: String (nama auditor yang ditugaskan)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Evidence Data
Rules memvalidasi struktur data bukti audit dengan ketentuan:

#### Required Fields
- `auditId`: String (ID audit yang terkait)
- `title`: String (1-200 karakter)
- `description`: String
- `type`: Enum ['Dokumen', 'Konfirmasi', 'Foto', 'Video', 'Lainnya']
- `uploadedBy`: String (nama yang mengupload)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Note Data
Rules memvalidasi struktur data catatan audit dengan ketentuan:

#### Required Fields
- `auditId`: String (ID audit yang terkait)
- `title`: String (1-200 karakter)
- `content`: String (isi catatan)
- `author`: String (penulis catatan)
- `category`: Enum ['Rapat', 'Pengujian', 'Temuan', 'Rekomendasi', 'Lainnya']
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Cara Deploy Rules

### 1. Menggunakan Firebase CLI

```bash
# Install Firebase CLI (jika belum)
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Initialize project (jika belum)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 2. Menggunakan Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Si-MAIL
3. Navigasi ke Firestore Database
4. Klik tab "Rules"
5. Copy-paste isi file `firestore.rules`
6. Klik "Publish"

### 3. Menggunakan gcloud CLI

```bash
# Set project
gcloud config set project si-mail-audit-system

# Deploy rules
gcloud firestore rules deploy firestore.rules
```

## Testing Rules

### 1. Menggunakan Firebase Emulator

```bash
# Start emulator
firebase emulators:start --only firestore

# Test rules
firebase emulators:exec --only firestore "npm test"
```

### 2. Menggunakan Firebase Console

1. Buka Firestore Database
2. Klik tab "Rules"
3. Klik "Rules Playground"
4. Test berbagai skenario akses

### 3. Menggunakan Test Script

Jalankan test script di browser console setelah login:

```javascript
// Load test functions
import('./test-firestore-access.js').then(() => {
  // Run all tests
  testFirestoreAccess.runAllTests();
  
  // Or run individual tests
  testFirestoreAccess.testUserAccess();
  testFirestoreAccess.testAuditPlansAccess();
  testFirestoreAccess.testCreateAuditPlan();
});
```

## Contoh Test Cases

### Test Case 1: Admin Access
```javascript
// Should allow admin to read all audit plans
const adminUser = { uid: 'admin123', role: 'Administrator' };
const result = await firestore.collection('audit_plans').get();
// Expected: Success
```

### Test Case 2: Auditor Access
```javascript
// Should allow auditor to create audit plan
const auditorUser = { uid: 'auditor123', role: 'Auditor' };
const auditPlanData = {
  title: 'Test Audit',
  department: 'Test Dept',
  type: 'Audit Keuangan',
  priority: 'Tinggi',
  status: 'Draft',
  // ... other required fields
};
const result = await firestore.collection('audit_plans').add(auditPlanData);
// Expected: Success
```

### Test Case 3: Work Paper Creation
```javascript
// Should allow authorized user to create work paper
const workPaperData = {
  auditId: 'audit123',
  title: 'Test Work Paper',
  description: 'Test description',
  type: 'Pengujian Substantif',
  status: 'Draft',
  assignedTo: 'Test Auditor'
};
const result = await firestore.collection('work_papers').add(workPaperData);
// Expected: Success
```

### Test Case 4: Unauthorized Access
```javascript
// Should deny access to unauthenticated user
const result = await firestore.collection('audit_plans').get();
// Expected: Permission denied
```

## Troubleshooting

### Common Issues

1. **Rules not updating**: Pastikan deploy berhasil dan tunggu beberapa menit
2. **Permission denied**: Periksa role user dan struktur data
3. **Validation errors**: Periksa format data sesuai dengan rules
4. **User not in Firestore**: Pastikan user record dibuat saat login pertama kali

### Debug Commands

```bash
# Check rules status
firebase firestore:rules:list

# View current rules
firebase firestore:rules:get

# Test specific rule
firebase firestore:rules:test
```

### Quick Fix for Permission Issues

Jika masih mengalami permission issues:

1. **Deploy temporary rules** yang sudah disediakan
2. **Login ulang** untuk memastikan user record dibuat
3. **Check browser console** untuk error details
4. **Verify user exists** di Firestore Console

## Security Best Practices

1. **Principle of Least Privilege**: Berikan akses minimal yang diperlukan
2. **Input Validation**: Validasi semua input data
3. **Role-based Access**: Gunakan role untuk mengontrol akses
4. **Data Validation**: Validasi struktur dan tipe data
5. **Regular Review**: Review rules secara berkala

## Monitoring

### Firestore Rules Usage
Monitor penggunaan rules melalui Firebase Console:
1. Navigasi ke Firestore Database
2. Klik tab "Usage"
3. Review metrics dan error logs

### Alerts
Set up alerts untuk:
- Failed rule evaluations
- Unusual access patterns
- Data validation errors

## Backup dan Version Control

### Backup Rules
```bash
# Export current rules
firebase firestore:rules:get > backup_rules_$(date +%Y%m%d).rules
```

### Version Control
- Commit rules ke Git repository
- Tag releases dengan version number
- Document changes di changelog

## Support

Untuk bantuan lebih lanjut:
1. [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
2. [Firebase Community](https://firebase.google.com/community)
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-firestore)
