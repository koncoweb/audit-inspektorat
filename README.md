# Si-MAIL - Sistem Manajemen Audit Internal

Sistem Manajemen Audit Internal untuk Inspektorat Kabupaten Morowali Utara.

## 🚀 Deployment di Vercel

### Langkah-langkah Deployment:

1. **Push kode ke GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account
   - Klik "New Project"
   - Import repository dari GitHub
   - Vercel akan otomatis detect sebagai React app
   - Klik "Deploy"

3. **Konfigurasi Environment Variables (Opsional)**
   - Jika menggunakan environment variables, tambahkan di Vercel dashboard
   - Project Settings > Environment Variables

### 🔧 Konfigurasi yang sudah disiapkan:

- ✅ `vercel.json` - Konfigurasi routing untuk React Router
- ✅ `.gitignore` - File yang di-exclude dari deployment
- ✅ Firebase config sudah terintegrasi
- ✅ Build command: `npm run build`
- ✅ Output directory: `build`

### 📝 Catatan Penting:

- Firebase project sudah dikonfigurasi dan siap digunakan
- Aplikasi menggunakan client-side routing dengan React Router
- Semua dependencies sudah terdaftar di `package.json`
- Build akan otomatis dijalankan saat deployment

### 🌐 Setelah Deployment:

- Vercel akan memberikan URL production (contoh: `https://your-app.vercel.app`)
- Setiap push ke branch `main` akan trigger automatic deployment
- Preview deployments tersedia untuk setiap pull request

### 🔍 Troubleshooting:

Jika ada error saat deployment:
1. Cek build logs di Vercel dashboard
2. Pastikan semua dependencies terinstall: `npm install`
3. Test build lokal: `npm run build`
4. Pastikan Firebase config valid

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📱 Fitur

- Dashboard Audit Internal
- Perencanaan Audit
- Pelaksanaan Audit
- Temuan Audit
- Laporan Audit
- Dokumen Management
- Tindak Lanjut
- Admin Panel
- Authentication dengan Firebase
- File upload dengan Cloudinary
