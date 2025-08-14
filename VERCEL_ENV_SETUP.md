# 🔐 Setup Environment Variables di Vercel

## Firebase Credentials yang Perlu Diisi

### 1. Buka Vercel Dashboard
- Login ke [vercel.com](https://vercel.com)
- Pilih project Anda
- Klik "Settings" > "Environment Variables"

### 2. Tambahkan Environment Variables

#### Firebase Configuration:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyChdKhIw5tBP8F5_AKpIYACU28pCLFSA58
REACT_APP_FIREBASE_AUTH_DOMAIN=rowyfire-e6c44.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=rowyfire-e6c44
REACT_APP_FIREBASE_STORAGE_BUCKET=rowyfire-e6c44.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=885825260324
REACT_APP_FIREBASE_APP_ID=1:885825260324:web:47f437217578d7633141b1
REACT_APP_FIREBASE_MEASUREMENT_ID=G-H30HXP32T1
```

#### Cloudinary Configuration:
```
REACT_APP_CLOUDINARY_CLOUD_NAME=kbisnisassets
REACT_APP_CLOUDINARY_UPLOAD_PRESET=auditmorowali
REACT_APP_CLOUDINARY_API_KEY=638824498464139
REACT_APP_CLOUDINARY_API_SECRET=xLEtFZ-89IjfBLtfgCs0pKYtXno
```

#### App Configuration:
```
REACT_APP_APP_NAME=Si-MAIL
REACT_APP_APP_VERSION=1.0.0
REACT_APP_APP_ENVIRONMENT=production
```

### 3. Environment Settings di Vercel

Untuk setiap environment variable:
- **Name:** Masukkan nama variable (contoh: `REACT_APP_FIREBASE_API_KEY`)
- **Value:** Masukkan nilai yang sesuai
- **Environment:** Pilih "Production" (dan "Preview" jika ingin)

### 4. Redeploy Setelah Setup

Setelah menambahkan environment variables:
1. Klik "Redeploy" di Vercel dashboard
2. Atau push perubahan baru ke GitHub

## 🔒 Keamanan

### ✅ Yang Sudah Diamankan:
- Firebase credentials tidak lagi hard-coded di frontend
- Cloudinary credentials menggunakan environment variables
- Semua sensitive data tersimpan aman di Vercel

### ⚠️ Catatan Penting:
- Environment variables dengan prefix `REACT_APP_` akan ter-expose di browser
- Untuk data yang sangat sensitif, gunakan backend API
- Firebase API key memang designed untuk public, tapi tetap lebih aman menggunakan env vars

## 🚀 Deployment Checklist

- [ ] Environment variables sudah di-set di Vercel
- [ ] Firebase project sudah dikonfigurasi
- [ ] Cloudinary settings sudah benar
- [ ] Redeploy aplikasi
- [ ] Test semua fitur setelah deployment

## 🔍 Troubleshooting

### Error "Firebase config not found"
- Pastikan semua Firebase env vars sudah di-set
- Cek nama variable harus persis sama
- Redeploy setelah menambahkan env vars

### Error "Cloudinary upload failed"
- Pastikan Cloudinary env vars sudah benar
- Cek upload preset permissions
- Verify cloud name dan API credentials
