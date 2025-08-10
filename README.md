# Si-MAIL - Sistem Manajemen Audit Internal

Aplikasi pengelolaan audit untuk Inspektorat Kabupaten Morowali Utara yang dibangun dengan React dan Firebase.

## Fitur Utama

- **Dashboard** - Overview statistik audit dan aktivitas terbaru
- **Perencanaan Audit** - Manajemen rencana audit
- **Pelaksanaan Audit** - Tracking progress audit
- **Temuan Audit** - Dokumentasi temuan audit
- **Laporan** - Pembuatan dan pengelolaan laporan
- **Dokumen** - Manajemen dokumen audit
- **Tindak Lanjut** - Tracking tindak lanjut temuan
- **Manajemen User** - Pengelolaan pengguna sistem
- **Panduan** - Dokumentasi panduan penggunaan
- **Pengaturan** - Konfigurasi sistem

## Teknologi yang Digunakan

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3 dengan custom design system
- **Icons**: React Icons (Feather Icons)
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

## Struktur Data Firebase

### Collections

1. **users** - Data pengguna sistem
   ```javascript
   {
     id: "string",
     name: "string",
     email: "string",
     role: "Administrator|Auditor|Supervisor",
     department: "string",
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

2. **audits** - Data audit
   ```javascript
   {
     id: "string",
     title: "string",
     description: "string",
     auditor: "string", // user ID
     department: "string",
     status: "Dalam Proses|Review|Selesai",
     progress: "number", // 0-100
     startDate: "timestamp",
     deadline: "timestamp",
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

3. **audit_plans** - Rencana audit
   ```javascript
   {
     id: "string",
     title: "string",
     description: "string",
     scope: "string",
     objectives: "string",
     startDate: "timestamp",
     endDate: "timestamp",
     status: "Draft|Approved|In Progress|Completed",
     createdBy: "string", // user ID
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

4. **audit_findings** - Temuan audit
   ```javascript
   {
     id: "string",
     auditId: "string",
     title: "string",
     description: "string",
     severity: "Low|Medium|High|Critical",
     category: "string",
     recommendation: "string",
     status: "Open|In Progress|Resolved|Closed",
     assignedTo: "string", // user ID
     dueDate: "timestamp",
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

5. **documents** - Dokumen audit
   ```javascript
   {
     id: "string",
     auditId: "string",
     title: "string",
     fileName: "string",
     fileType: "string",
     fileSize: "number",
     fileUrl: "string",
     uploadedBy: "string", // user ID
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

6. **follow_ups** - Tindak lanjut temuan
   ```javascript
   {
     id: "string",
     findingId: "string",
     action: "string",
     description: "string",
     assignedTo: "string", // user ID
     dueDate: "timestamp",
     completionDate: "timestamp",
     status: "Pending|In Progress|Completed|Overdue",
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

7. **reports** - Laporan audit
   ```javascript
   {
     id: "string",
     auditId: "string",
     title: "string",
     content: "string",
     type: "Draft|Final|Executive Summary",
     generatedBy: "string", // user ID
     createdAt: "timestamp",
     updatedAt: "timestamp"
   }
   ```

## Instalasi dan Setup

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- Firebase project

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd si-mail-audit-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, dan Storage
   - Copy konfigurasi Firebase ke `src/firebase/config.js`

4. **Setup Firestore Security Rules**
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
       
       // Similar rules for other collections
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Run aplikasi**
   ```bash
   npm start
   ```

## Struktur Folder

```
src/
├── components/          # Reusable components
│   ├── Header.js
│   ├── Sidebar.js
│   ├── SummaryCard.js
│   └── AuditItem.js
├── pages/              # Page components
│   └── Dashboard.js
├── services/           # Firebase services
│   └── firebaseService.js
├── styles/             # CSS styles
│   └── global.css
├── firebase/           # Firebase configuration
│   └── config.js
├── App.js              # Main app component
└── index.js            # Entry point
```

## Penggunaan

### Dashboard
- Melihat statistik audit (total, temuan, selesai, dalam proses)
- Melihat audit terbaru dengan progress bar
- Akses cepat ke fitur utama

### Perencanaan Audit
- Membuat rencana audit baru
- Mengatur scope dan objectives
- Menjadwalkan timeline audit

### Pelaksanaan Audit
- Tracking progress audit
- Update status audit
- Assign auditor ke audit

### Temuan Audit
- Dokumentasi temuan audit
- Kategorisasi berdasarkan severity
- Assign tindak lanjut

### Laporan
- Generate laporan audit
- Export ke berbagai format
- Template laporan yang dapat dikustomisasi

## Deployment

### Build untuk Production
```bash
npm run build
```

### Deploy ke Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Kontak

Inspektorat Kabupaten Morowali Utara
- Email: inspektorat@morowaliutarakab.go.id
- Website: https://morowaliutarakab.go.id

## Changelog

### v1.0.0
- Initial release
- Dashboard dengan statistik audit
- Manajemen audit dasar
- Sistem autentikasi Firebase
- UI/UX yang responsif
