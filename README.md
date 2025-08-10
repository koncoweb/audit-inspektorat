# Si-MAIL Sistem Manajemen Audit Internal

Sistem informasi untuk manajemen audit internal yang terintegrasi dengan Firebase.

## Alur Kerja Audit

### 1. Perencanaan Audit (`/perencanaan`)
- **Koleksi:** `audits` (unified)
- **Status yang didukung:** Draft
- **Fitur:** Hanya menampilkan rencana audit yang masih dalam tahap draft
- **Fungsi:** 
  - Membuat rencana audit baru
  - Mengubah status rencana audit dari Draft ke Disetujui
  - Melihat detail rencana audit
  - Menghapus rencana audit

### 2. Pelaksanaan Audit (`/pelaksanaan`)
- **Koleksi:** `audits` (unified)
- **Status yang didukung:** Disetujui, Berlangsung, Dalam Proses, Review, Finalisasi, Selesai
- **Fitur:** Menampilkan audit yang sudah disetujui dan sedang berlangsung
- **Fungsi:**
  - Monitoring progress audit
  - Dokumentasi kertas kerja
  - Pengumpulan bukti audit
  - Catatan audit
  - Update status audit

### 3. Alur Data
```
Unified Audits Collection
     ↓
Status: Draft → Disetujui → Berlangsung → Dalam Proses → Review → Finalisasi → Selesai
```

**Penting:** 
- Sistem menggunakan koleksi `audits` yang terpadu untuk semua tahap audit
- Rencana audit dengan status "Draft" ditampilkan di halaman Perencanaan Audit
- Audit dengan status "Disetujui", "Berlangsung", "Dalam Proses", "Review", "Finalisasi", dan "Selesai" ditampilkan di halaman Pelaksanaan Audit
- Perbedaan hanya berdasarkan status, bukan koleksi terpisah

## Fitur Utama

- **Dashboard** - Ringkasan statistik audit
- **Perencanaan Audit** - Manajemen rencana audit dengan status tracking
- **Pelaksanaan Audit** - Monitoring dan dokumentasi audit yang sedang berlangsung
- **Temuan Audit** - Pencatatan dan tracking temuan audit
- **Laporan** - Pembuatan dan manajemen laporan audit
- **Manajemen Pengguna** - Role-based access control

## Teknologi

- **Frontend:** React.js
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Styling:** CSS3 dengan custom design system
- **Icons:** React Icons (Feather Icons)

## Instalasi

1. Clone repository
2. Install dependencies: `npm install`
3. Setup Firebase configuration
4. Run development server: `npm start`

## Struktur Data

### Unified Audits Collection
```javascript
{
  title: String,
  department: String,
  type: String,
  priority: String,
  status: String, // Draft, Disetujui, Berlangsung, Selesai, Dalam Proses, Review, Finalisasi
  auditor: String,
  startDate: Timestamp,
  endDate: Timestamp,
  period: String,
  description: String,
  scope: String,
  objectives: String,
  budget: Number,
  riskLevel: String,
  progress: Number, // 0-100
  team: Array,
  workPapers: Array,
  evidence: Array,
  notes: Array,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Status Mapping:**
- **Planning Statuses:** Draft
- **Execution Statuses:** Disetujui, Berlangsung, Dalam Proses, Review, Finalisasi, Selesai

## Keamanan

- Role-based access control
- Firestore security rules
- User authentication
- Data validation

## Kontribusi

Silakan berkontribusi dengan membuat pull request atau melaporkan issues.
