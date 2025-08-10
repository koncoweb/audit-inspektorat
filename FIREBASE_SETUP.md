# Setup Firebase untuk Si-MAIL

## Langkah-langkah Setup Firebase

### 1. Buat Project Firebase

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project" atau "Add project"
3. Masukkan nama project: `si-mail-audit-system`
4. Pilih "Continue"
5. Pilih "Don't set up Google Analytics" (opsional)
6. Klik "Create project"

### 2. Enable Authentication

1. Di sidebar kiri, klik "Authentication"
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Enable "Email/Password"
5. Klik "Save"

### 3. Setup Firestore Database

1. Di sidebar kiri, klik "Firestore Database"
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi database (pilih yang terdekat dengan Indonesia)
5. Klik "Done"

### 4. Setup Storage

1. Di sidebar kiri, klik "Storage"
2. Klik "Get started"
3. Pilih "Start in test mode"
4. Pilih lokasi storage (sama dengan database)
5. Klik "Done"

### 5. Tambahkan Web App

1. Di project overview, klik ikon web (</>)
2. Masukkan nama app: `si-mail-web`
3. Klik "Register app"
4. Copy konfigurasi Firebase yang diberikan

### 6. Update Konfigurasi

Konfigurasi Firebase sudah diset di `src/firebase/config.js` dengan data yang Anda berikan:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyChdKhIw5tBP8F5_AKpIYACU28pCLFSA58",
  authDomain: "rowyfire-e6c44.firebaseapp.com",
  projectId: "rowyfire-e6c44",
  storageBucket: "rowyfire-e6c44.appspot.com",
  messagingSenderId: "885825260324",
  appId: "1:885825260324:web:47f437217578d7633141b1",
  measurementId: "G-H30HXP32T1"
};
```

### 7. Setup Firestore Security Rules

1. Di Firestore Database, klik tab "Rules"
2. Ganti rules dengan yang berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write audit data
    match /audits/{auditId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write audit plans
    match /audit_plans/{planId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write audit findings
    match /audit_findings/{findingId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write documents
    match /documents/{documentId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write follow-ups
    match /follow_ups/{followUpId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write reports
    match /reports/{reportId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Klik "Publish"

### 8. Setup Storage Security Rules

1. Di Storage, klik tab "Rules"
2. Ganti rules dengan yang berikut:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Klik "Publish"

### 9. Buat User Pertama

1. Di Authentication, klik tab "Users"
2. Klik "Add user"
3. Masukkan email dan password untuk admin pertama
4. Klik "Add user"

### 10. Test Aplikasi

1. Jalankan aplikasi dengan `npm start`
2. Buka browser ke `http://localhost:3000`
3. Login dengan email dan password yang baru dibuat
4. Dashboard seharusnya muncul dengan data dummy

## Struktur Data Awal

Setelah setup selesai, Anda bisa menambahkan data awal ke Firestore:

### Users Collection
```javascript
{
  "name": "Dr. Ahmad Rahman",
  "email": "admin@inspektorat.go.id",
  "role": "Administrator",
  "department": "Inspektorat",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Sample Audit Data
```javascript
{
  "title": "Audit Keuangan Dinas Pendidikan",
  "description": "Audit keuangan tahunan Dinas Pendidikan",
  "auditor": "user_id",
  "department": "Dinas Pendidikan",
  "status": "Dalam Proses",
  "progress": 75,
  "startDate": "timestamp",
  "deadline": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Troubleshooting

### Error: "Firebase: Error (auth/user-not-found)"
- Pastikan user sudah dibuat di Firebase Authentication
- Cek email dan password yang digunakan

### Error: "Firebase: Error (auth/wrong-password)"
- Pastikan password yang dimasukkan benar
- Coba reset password di Firebase Console

### Error: "Firebase: Error (permission-denied)"
- Pastikan Firestore Security Rules sudah diset dengan benar
- Pastikan user sudah login

### Error: "Firebase: Error (storage/unauthorized)"
- Pastikan Storage Security Rules sudah diset dengan benar
- Pastikan user sudah login

## Deployment ke Production

### 1. Update Security Rules untuk Production

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // More restrictive rules for production
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /audits/{auditId} {
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'Administrator' || 
         request.auth.token.role == 'Auditor');
    }
    
    // Add similar rules for other collections
  }
}
```

### 2. Setup Custom Claims untuk Role-based Access

```javascript
// Run this in Firebase Functions or Admin SDK
admin.auth().setCustomUserClaims(uid, {
  role: 'Administrator',
  department: 'Inspektorat'
});
```

### 3. Deploy ke Firebase Hosting

```bash
npm run build
firebase deploy
```

## Monitoring dan Analytics

### 1. Enable Firebase Analytics (Opsional)
1. Di project overview, klik "Analytics"
2. Follow setup instructions
3. Update konfigurasi di aplikasi

### 2. Monitor Usage
1. Di Firebase Console, monitor usage di setiap service
2. Set up billing alerts
3. Monitor error logs

## Backup dan Recovery

### 1. Export Data
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Export data
firebase firestore:export ./backup
```

### 2. Import Data
```bash
firebase firestore:import ./backup
```

## Support

Untuk bantuan lebih lanjut:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase
