# Update Firestore Rules untuk App Settings

## Masalah
Error permission saat mengakses collection `app_settings`:
```
Error getting app settings: FirebaseError: Missing or insufficient permissions.
```

## Solusi
Menambahkan rules untuk collection `app_settings` di `firestore.rules` dengan permission yang sesuai.

## Perubahan yang Dibuat

### 1. **Helper Function Baru**
```javascript
function isAdmin() {
  return isAuthenticated() && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
}
```

### 2. **Rules untuk App Settings**
```javascript
// App Settings collection - Only admins can read/write
match /app_settings/{settingId} {
  allow read, write: if isAdmin();
  // Allow read for authenticated users to display app info
  allow read: if isAuthenticated();
}
```

## Penjelasan Rules

### **Permission Structure:**
- **Write**: Hanya admin yang bisa mengubah pengaturan aplikasi
- **Read**: 
  - Admin: Bisa read dan write
  - User terauthentikasi: Bisa read untuk menampilkan info aplikasi (logo, nama, dll)

### **Security Logic:**
1. **isAuthenticated()**: Memastikan user sudah login
2. **isAdmin()**: Memastikan user memiliki role 'Admin' di Firestore
3. **exists()**: Memastikan document user ada
4. **get().data.role**: Mengecek role dari document user

## File yang Diupdate

### **firestore.rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // ... existing rules ...

    // App Settings collection - Only admins can read/write
    match /app_settings/{settingId} {
      allow read, write: if isAdmin();
      // Allow read for authenticated users to display app info
      allow read: if isAuthenticated();
    }
  }
}
```

## Cara Deploy Rules

### **Method 1: Firebase Console (Recommended)**
1. Buka Firebase Console
2. Pilih project Anda
3. Buka Firestore Database
4. Klik tab "Rules"
5. Copy paste rules dari file `firestore.rules`
6. Klik "Publish"

### **Method 2: Firebase CLI**
```bash
firebase deploy --only firestore:rules
```

## Testing Rules

### **1. Test Admin Access**
- Login sebagai user dengan role 'Admin'
- Buka halaman `/pengaturan`
- Upload logo dan save
- Harus berhasil tanpa error

### **2. Test Non-Admin Access**
- Login sebagai user dengan role 'Auditor'
- Buka halaman `/pengaturan`
- Harus bisa melihat pengaturan (read)
- Tidak bisa mengubah pengaturan (write)

### **3. Test Unauthenticated Access**
- Logout dari aplikasi
- Coba akses app settings
- Harus error atau redirect ke login

## Troubleshooting

### **1. Error "Missing or insufficient permissions"**
- Pastikan user memiliki role 'Admin' di Firestore
- Cek apakah rules sudah di-deploy
- Pastikan user sudah login

### **2. Error "User document not found"**
- Pastikan user document ada di collection `users`
- Pastikan field `role` ada dan bernilai 'Admin'

### **3. Rules tidak ter-update**
- Pastikan rules sudah di-deploy ke Firebase
- Cek Firebase Console untuk memastikan rules ter-update
- Restart aplikasi jika perlu

## Security Considerations

### **1. Role-based Access**
- Hanya admin yang bisa mengubah pengaturan aplikasi
- User biasa hanya bisa melihat pengaturan untuk tampilan

### **2. Data Validation**
- Rules memastikan user terauthentikasi
- Memverifikasi role dari Firestore document
- Mencegah akses tidak sah

### **3. Future Enhancements**
- Bisa ditambahkan permission untuk role lain (Super Admin, etc.)
- Bisa ditambahkan audit log untuk perubahan pengaturan
- Bisa ditambahkan rate limiting untuk perubahan pengaturan

## Contoh User Document Structure

```javascript
// Collection: users
// Document ID: {user.uid}
{
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "Admin",  // ← Field ini yang dicek di rules
  "department": "Inspektorat",
  "position": "Kepala Inspektorat",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Verification Steps

### **1. Deploy Rules**
```bash
# Copy rules dari file firestore.rules ke Firebase Console
# atau gunakan Firebase CLI
firebase deploy --only firestore:rules
```

### **2. Test Upload Logo**
1. Login sebagai admin
2. Buka `/pengaturan`
3. Upload logo
4. Save pengaturan
5. Harus berhasil tanpa error

### **3. Verify in Firebase Console**
1. Buka Firestore Database
2. Cek collection `app_settings`
3. Harus ada document dengan ID `main`
4. Document harus berisi pengaturan aplikasi

## Kesimpulan

✅ **Rules sudah diupdate untuk collection `app_settings`**
✅ **Permission sudah dikonfigurasi dengan benar**
✅ **Security sudah diimplementasikan dengan role-based access**
✅ **Ready untuk testing upload logo**

**Next Step**: Deploy rules ke Firebase Console dan test upload logo.
