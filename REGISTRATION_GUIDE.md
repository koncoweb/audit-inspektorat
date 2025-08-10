# Panduan Registrasi Si-MAIL

## Fitur Registrasi

Aplikasi Si-MAIL sekarang memiliki fitur registrasi yang memungkinkan pengguna untuk membuat akun baru menggunakan Firebase Authentication.

## Cara Menggunakan

### 1. Akses Halaman Registrasi
- Buka aplikasi Si-MAIL
- Klik link "Daftar di sini" di halaman login
- Atau akses langsung ke `/register`

### 2. Form Registrasi
Form registrasi memerlukan informasi berikut:
- **Nama Lengkap**: Nama lengkap pengguna
- **Email**: Alamat email yang valid (akan digunakan untuk login)
- **Password**: Password minimal 6 karakter
- **Konfirmasi Password**: Ulangi password untuk konfirmasi

### 3. Validasi
Sistem akan memvalidasi:
- Password minimal 6 karakter
- Password dan konfirmasi password harus sama
- Email harus dalam format yang valid
- Email belum terdaftar sebelumnya

### 4. Proses Registrasi
Setelah registrasi berhasil:
- Akun akan dibuat di Firebase Authentication
- Data pengguna akan disimpan di Firestore
- Pengguna akan otomatis login dan diarahkan ke dashboard

## Struktur Data Pengguna

Data pengguna yang disimpan di Firestore:

```javascript
{
  uid: "user_id_from_firebase_auth",
  email: "user@example.com",
  displayName: "Nama Lengkap",
  role: "user",
  status: "active",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Keamanan

- Password di-hash oleh Firebase Authentication
- Validasi email dan password di sisi client dan server
- Pengguna baru mendapat role "user" secara default
- Status akun default adalah "active"

## Error Handling

Sistem menangani berbagai error:
- `auth/email-already-in-use`: Email sudah terdaftar
- `auth/invalid-email`: Format email tidak valid
- `auth/weak-password`: Password terlalu lemah
- Password tidak cocok (validasi client-side)
- Password terlalu pendek (validasi client-side)

## Integrasi dengan Firebase

### Firebase Authentication
- Menggunakan `createUserWithEmailAndPassword`
- Update profile dengan display name
- Otomatis login setelah registrasi

### Firestore Database
- Menyimpan data pengguna di collection `users`
- Menggunakan `userService.createUser()`
- Timestamp otomatis untuk `createdAt` dan `updatedAt`

## Pengembangan Selanjutnya

Fitur yang bisa ditambahkan:
- Verifikasi email
- Reset password
- Role-based access control
- Profile management
- User activation/deactivation
- Audit trail untuk registrasi

## Troubleshooting

### Masalah Umum

1. **Email sudah terdaftar**
   - Gunakan email yang berbeda
   - Atau gunakan fitur reset password

2. **Password terlalu lemah**
   - Gunakan password minimal 6 karakter
   - Kombinasikan huruf, angka, dan simbol

3. **Format email tidak valid**
   - Pastikan format email benar (contoh: user@domain.com)

4. **Password tidak cocok**
   - Pastikan password dan konfirmasi password sama

### Debug Mode

Untuk debugging, cek console browser untuk error detail dari Firebase.
