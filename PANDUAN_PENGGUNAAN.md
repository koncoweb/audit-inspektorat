# Panduan Penggunaan Si-MAIL Sistem Manajemen Audit Internal

## Daftar Isi
1. [Instalasi dan Setup](#instalasi-dan-setup)
2. [Login dan Autentikasi](#login-dan-autentikasi)
3. [Dashboard](#dashboard)
4. [Menu Navigasi](#menu-navigasi)
5. [Fitur Utama](#fitur-utama)
6. [Troubleshooting](#troubleshooting)

## Instalasi dan Setup

### Prerequisites
- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- Akun Firebase

### Langkah Instalasi

1. **Clone atau download project**
   ```bash
   git clone <repository-url>
   cd si-mail-audit-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Ikuti panduan di `FIREBASE_SETUP.md`
   - Pastikan Authentication, Firestore, dan Storage sudah diaktifkan
   - Update konfigurasi di `src/firebase/config.js` jika diperlukan

4. **Jalankan aplikasi**
   ```bash
   npm start
   ```

5. **Buka browser**
   - Aplikasi akan berjalan di `http://localhost:3000`

## Login dan Autentikasi

### Membuat User Pertama

1. **Buka Firebase Console**
   - Kunjungi [Firebase Console](https://console.firebase.google.com/)
   - Pilih project Anda

2. **Tambah User**
   - Klik "Authentication" di sidebar
   - Klik tab "Users"
   - Klik "Add user"
   - Masukkan email dan password
   - Klik "Add user"

3. **Login ke Aplikasi**
   - Buka aplikasi di browser
   - Masukkan email dan password yang baru dibuat
   - Klik "Masuk"

### Fitur Login

- **Email/Password Authentication**: Login menggunakan email dan password
- **Remember Me**: Session akan tetap aktif sampai logout
- **Logout**: Klik ikon logout di header untuk keluar

## Dashboard

### Overview
Dashboard menampilkan ringkasan statistik audit dan aktivitas terbaru.

### Komponen Dashboard

#### 1. Summary Cards
- **Total Audit**: Jumlah total audit yang ada
- **Temuan Audit**: Jumlah temuan audit yang ditemukan
- **Selesai**: Jumlah audit yang sudah selesai
- **Dalam Proses**: Jumlah audit yang sedang berlangsung

#### 2. Audit Terbaru
- Daftar audit terbaru dengan progress bar
- Informasi auditor, status, dan deadline
- Progress persentase penyelesaian

#### 3. Aksi Cepat
- **Buat Laporan**: Langsung ke halaman pembuatan laporan
- **Kelola Tim**: Manajemen user dan tim audit
- **Jadwal Audit**: Lihat dan kelola jadwal audit

#### 4. Jadwal Hari Ini
- Menampilkan jadwal audit untuk hari ini
- Saat ini masih kosong (akan diimplementasi)

## Menu Navigasi

### Sidebar Menu

#### 1. Dashboard
- Halaman utama dengan overview statistik

#### 2. Perencanaan Audit
- Membuat dan mengelola rencana audit
- Menjadwalkan timeline audit
- Mengatur scope dan objectives

#### 3. Pelaksanaan Audit
- Tracking progress audit
- Update status audit
- Assign auditor ke audit

#### 4. Temuan Audit
- Dokumentasi temuan audit
- Kategorisasi berdasarkan severity
- Assign tindak lanjut

#### 5. Laporan
- Generate laporan audit
- Export ke berbagai format
- Template laporan yang dapat dikustomisasi

#### 6. Dokumen
- Manajemen dokumen audit
- Upload dan download file
- Kategorisasi dokumen

#### 7. Tindak Lanjut
- Tracking tindak lanjut temuan
- Monitoring progress perbaikan
- Notifikasi deadline

#### 8. Manajemen User
- Pengelolaan pengguna sistem
- Assign role dan permission
- Reset password

#### 9. Panduan
- Dokumentasi panduan penggunaan
- FAQ dan troubleshooting

#### 10. Pengaturan
- Konfigurasi sistem
- Pengaturan notifikasi
- Backup dan restore

### Header

#### User Info
- Nama pengguna yang sedang login
- Role/jabatan pengguna
- Avatar dengan inisial nama

#### Notifikasi
- Ikon bell untuk notifikasi (akan diimplementasi)

#### Logout
- Ikon logout untuk keluar dari sistem

## Fitur Utama

### 1. Manajemen Audit

#### Membuat Audit Baru
1. Klik menu "Pelaksanaan Audit"
2. Klik tombol "Tambah Audit"
3. Isi form dengan informasi audit
4. Klik "Simpan"

#### Update Progress Audit
1. Pilih audit dari daftar
2. Update progress persentase
3. Update status audit
4. Klik "Update"

### 2. Dokumentasi Temuan

#### Menambah Temuan
1. Klik menu "Temuan Audit"
2. Klik "Tambah Temuan"
3. Isi detail temuan
4. Pilih severity level
5. Klik "Simpan"

#### Kategorisasi Temuan
- **Low**: Temuan minor, tidak kritis
- **Medium**: Temuan yang perlu perhatian
- **High**: Temuan serius, perlu tindakan cepat
- **Critical**: Temuan sangat serius, perlu tindakan segera

### 3. Manajemen Dokumen

#### Upload Dokumen
1. Klik menu "Dokumen"
2. Klik "Upload Dokumen"
3. Pilih file yang akan diupload
4. Isi metadata dokumen
5. Klik "Upload"

#### Download Dokumen
1. Cari dokumen di daftar
2. Klik ikon download
3. File akan terdownload otomatis

### 4. Laporan

#### Generate Laporan
1. Klik menu "Laporan"
2. Pilih jenis laporan
3. Pilih periode laporan
4. Klik "Generate"
5. Download laporan dalam format PDF

## Admin Panel

### Akses Admin Panel
- Buka URL: `http://localhost:3000/admin`
- Hanya untuk development/testing

### Fitur Admin Panel

#### 1. Tambah Data Sample
- Klik "Tambah Data Sample"
- Data dummy akan ditambahkan ke database
- Berguna untuk testing dan demo

#### 2. Periksa Data
- Klik "Periksa Data"
- Menampilkan jumlah data di setiap collection
- Monitoring jumlah data di database

## Troubleshooting

### Masalah Umum

#### 1. Aplikasi tidak bisa diakses
**Gejala**: Browser menampilkan error atau blank page
**Solusi**:
- Pastikan server berjalan dengan `npm start`
- Cek console browser untuk error
- Pastikan port 3000 tidak digunakan aplikasi lain

#### 2. Login gagal
**Gejala**: Error "Email atau password salah"
**Solusi**:
- Pastikan email dan password benar
- Cek apakah user sudah dibuat di Firebase
- Coba reset password di Firebase Console

#### 3. Data tidak muncul
**Gejala**: Dashboard kosong atau data tidak ter-load
**Solusi**:
- Pastikan Firebase sudah dikonfigurasi dengan benar
- Cek Firestore Security Rules
- Pastikan user sudah login
- Coba refresh halaman

#### 4. Upload file gagal
**Gejala**: File tidak bisa diupload
**Solusi**:
- Pastikan Firebase Storage sudah diaktifkan
- Cek Storage Security Rules
- Pastikan ukuran file tidak melebihi limit
- Cek koneksi internet

### Error Messages

#### "Firebase: Error (auth/user-not-found)"
- User belum dibuat di Firebase Authentication
- Email yang dimasukkan salah

#### "Firebase: Error (auth/wrong-password)"
- Password yang dimasukkan salah
- Coba reset password

#### "Firebase: Error (permission-denied)"
- Firestore Security Rules terlalu ketat
- User tidak memiliki permission

#### "Firebase: Error (storage/unauthorized)"
- Storage Security Rules terlalu ketat
- User tidak memiliki permission untuk upload

### Logs dan Debugging

#### Browser Console
- Buka Developer Tools (F12)
- Lihat tab Console untuk error messages
- Cek tab Network untuk request yang gagal

#### Firebase Console
- Buka Firebase Console
- Lihat tab "Authentication" untuk user logs
- Lihat tab "Firestore" untuk database logs
- Lihat tab "Storage" untuk file logs

## Tips dan Best Practices

### 1. Keamanan
- Gunakan password yang kuat
- Logout setelah selesai menggunakan aplikasi
- Jangan share kredensial login
- Update password secara berkala

### 2. Backup Data
- Export data secara berkala
- Backup dokumen penting
- Simpan konfigurasi sistem

### 3. Performance
- Upload file dalam ukuran yang reasonable
- Hapus data yang tidak diperlukan
- Monitor penggunaan storage

### 4. Maintenance
- Update aplikasi secara berkala
- Monitor error logs
- Backup database secara regular

## Support dan Kontak

### Dokumentasi
- README.md: Dokumentasi umum
- FIREBASE_SETUP.md: Panduan setup Firebase
- PANDUAN_PENGGUNAAN.md: Panduan penggunaan (dokumen ini)

### Kontak
- Inspektorat Kabupaten Morowali Utara
- Email: inspektorat@morowaliutarakab.go.id
- Website: https://morowaliutarakab.go.id

### Development
- Repository: [Link ke repository]
- Issues: [Link ke issues tracker]
- Wiki: [Link ke wiki]

---

**Versi**: 1.0.0  
**Terakhir Update**: Januari 2024  
**Penulis**: Tim Development Si-MAIL
