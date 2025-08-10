# Alur Kerja Audit Si-MAIL

## Overview

Sistem Si-MAIL menggunakan koleksi data yang terpadu untuk mengelola alur kerja audit:

1. **`audits`** - Koleksi terpadu untuk semua tahap audit (perencanaan dan pelaksanaan)
2. **Perbedaan berdasarkan status** - Planning statuses vs Execution statuses

## Alur Kerja Detail

### 1. Perencanaan Audit (`/perencanaan`)

**Koleksi:** `audits` (unified)

**Status yang didukung:**
- `Draft` - Rencana audit masih dalam tahap penyusunan

**Fitur:**
- ✅ Hanya menampilkan rencana audit yang masih dalam tahap draft
- ✅ Filter berdasarkan prioritas dan pencarian
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Modal form dengan calendar UI untuk periode audit
- ✅ Update status dari Draft ke Disetujui

**Penting:** Rencana audit dengan status "Draft" ditampilkan di halaman Perencanaan Audit. Setelah disetujui, audit akan muncul di halaman Pelaksanaan Audit.

### 2. Pelaksanaan Audit (`/pelaksanaan`)

**Koleksi:** `audits` (unified)

**Status yang didukung:**
- `Disetujui` - Rencana audit telah disetujui untuk dilaksanakan
- `Berlangsung` - Audit sedang dalam tahap pelaksanaan
- `Dalam Proses` - Audit sedang dilaksanakan
- `Review` - Audit sedang dalam tahap review
- `Finalisasi` - Audit sedang dalam tahap finalisasi
- `Selesai` - Audit telah selesai

**Fitur:**
- ✅ Monitoring progress audit yang sedang berlangsung
- ✅ Dokumentasi kertas kerja
- ✅ Pengumpulan bukti audit
- ✅ Catatan audit
- ✅ Manajemen tim audit

## Alur Data

```
┌─────────────────────────────────────────────────────────────┐
│                    Unified Audits Collection               │
│                    (audits)                                │
├─────────────────────────────────────────────────────────────┤
│ Planning Statuses:                                         │
│ Draft                                                      │
│   ↓                                                        │
│ [Buat] → [Review] → [Approve]                              │
├─────────────────────────────────────────────────────────────┤
│ Execution Statuses:                                        │
│ Disetujui → Berlangsung → Dalam Proses → Review → Finalisasi → Selesai
│     ↓           ↓           ↓         ↓         ↓         ↓
│ [Approve]   [Start]     [Execute] [Evaluate] [Complete] [Archive]
└─────────────────────────────────────────────────────────────┘
```

## Perbedaan Status

### Planning Statuses (Perencanaan Audit)
- **Tujuan:** Perencanaan dan scheduling audit
- **Fokus:** Planning dan approval
- **Data:** Rencana, scope, objectives, budget, timeline
- **Status:** Draft

### Execution Statuses (Pelaksanaan Audit)
- **Tujuan:** Pelaksanaan dan dokumentasi audit
- **Fokus:** Execution, documentation, dan reporting
- **Data:** Progress, work papers, evidence, notes, team
- **Status:** Disetujui, Berlangsung, Dalam Proses, Review, Finalisasi, Selesai

## Contoh Penggunaan

### Skenario 1: Rencana Audit Baru
1. User membuat rencana audit baru di `/perencanaan`
2. Status awal: `Draft`
3. Setelah review, status diubah menjadi `Disetujui`
4. Audit otomatis muncul di halaman Pelaksanaan Audit
5. User dapat melanjutkan proses audit di halaman Pelaksanaan

### Skenario 2: Pelaksanaan Audit
1. Audit dengan status "Disetujui" muncul di `/pelaksanaan`
2. Status berubah: `Disetujui` → `Berlangsung` → `Dalam Proses` → `Review` → `Finalisasi` → `Selesai`
3. Progress tracking dan dokumentasi dilakukan di setiap tahap
4. Semua tahap pelaksanaan terpusat di halaman Pelaksanaan Audit

### Skenario 3: Monitoring
1. User dapat melihat rencana draft di `/perencanaan`
2. User dapat melihat semua audit yang sudah disetujui dan sedang berlangsung di `/pelaksanaan`
3. Alur kerja yang jelas dari perencanaan ke pelaksanaan

## Keuntungan Desain Ini

1. **Fleksibilitas:** Rencana audit dapat diubah status tanpa kehilangan data
2. **Tracking:** Semua tahap perencanaan tetap terlihat
3. **Separation of Concerns:** Perencanaan dan pelaksanaan terpisah
4. **Scalability:** Mudah untuk menambah fitur baru di masing-masing tahap
5. **User Experience:** User dapat dengan mudah melihat status semua rencana

## Implementasi Teknis

### Service Layer
```javascript
// auditService - unified service untuk semua tahap audit
auditService.getPlanningAudits() // Audit dengan planning statuses
auditService.getExecutionAudits() // Audit dengan execution statuses
auditService.getAuditsByStatus(status) // Filter berdasarkan status spesifik
auditService.getPlanningStats() // Statistik untuk halaman perencanaan
auditService.getExecutionStats() // Statistik untuk halaman pelaksanaan
```

### UI Components
- **PerencanaanAudit.js:** Menampilkan audit dengan planning statuses
- **PelaksanaanAudit.js:** Menampilkan audit dengan execution statuses
- **Filter dan Search:** Memungkinkan user untuk melihat audit berdasarkan status

## Kesimpulan

Desain unified ini memastikan bahwa:
- ✅ Semua audit menggunakan koleksi `audits` yang terpadu
- ✅ Rencana audit dengan status "Disetujui" dan "Berlangsung" tetap berada di halaman Perencanaan Audit
- ✅ User dapat dengan mudah melacak semua tahap audit berdasarkan status
- ✅ Pelaksanaan audit memiliki halaman terpisah untuk dokumentasi
- ✅ Sistem lebih sederhana dengan satu koleksi data
- ✅ Perbedaan hanya berdasarkan status, bukan koleksi terpisah
