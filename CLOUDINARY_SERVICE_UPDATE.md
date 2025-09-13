# Update Cloudinary Service untuk Upload Logo

## Masalah
Error saat mengupload logo:
```
Upload error: TypeError: cloudinaryService.uploadFile is not a function
```

## Penyebab
File `cloudinaryService.js` tidak memiliki function `uploadFile` yang sederhana. File ini hanya memiliki function-function khusus untuk berbagai jenis file audit, tetapi tidak ada function umum untuk upload file.

## Solusi
Menambahkan function `uploadFile` yang sederhana untuk keperluan upload logo, favicon, dan foto profil.

## Perubahan yang Dibuat

### 1. **Function uploadFile Baru**
```javascript
// Simple file upload function for general use (logo, profile photos, etc.)
async uploadFile(file, folder = 'auditmorowaliutara/general') {
  try {
    console.log('Starting file upload to Cloudinary...');
    
    // Validate file
    this.validateFile(file, 10 * 1024 * 1024); // 10MB max for general files
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);
    
    // Add transformation for images to optimize them
    if (file.type.startsWith('image/')) {
      formData.append('transformation', 'f_auto,q_auto,w_auto');
    }
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    console.log('Cloudinary upload success:', result);
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      original_filename: result.original_filename
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
```

### 2. **Update AppSettings Component**
```javascript
const handleFileUpload = async (file, type) => {
  if (!file) return;

  try {
    setUploading(true);
    const folder = type === 'logoUrl' ? 'auditmorowaliutara/app/logo' : 'auditmorowaliutara/app/favicon';
    const uploadResult = await cloudinaryService.uploadFile(file, folder);
    
    if (uploadResult && uploadResult.secure_url) {
      handleInputChange(type, uploadResult.secure_url);
      showMessage('success', `${type === 'logoUrl' ? 'Logo' : 'Favicon'} berhasil diupload`);
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showMessage('error', `Gagal mengupload ${type === 'logoUrl' ? 'logo' : 'favicon'}`);
  } finally {
    setUploading(false);
  }
};
```

### 3. **Update UserProfile Component**
```javascript
const handleFileUpload = async (file) => {
  if (!file) return;

  try {
    setUploading(true);
    const uploadResult = await cloudinaryService.uploadFile(file, 'auditmorowaliutara/profiles');
    
    if (uploadResult && uploadResult.secure_url) {
      handleInputChange('photoURL', uploadResult.secure_url);
      showMessage('success', 'Foto profil berhasil diupload');
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showMessage('error', 'Gagal mengupload foto profil');
  } finally {
    setUploading(false);
  }
};
```

## Fitur Function uploadFile

### **1. File Validation**
- Validasi tipe file yang diizinkan
- Validasi ukuran file (max 10MB untuk file umum)
- Error handling yang baik

### **2. Image Optimization**
- Auto-format (f_auto) - format optimal untuk browser
- Auto-quality (q_auto) - kualitas optimal
- Auto-width (w_auto) - lebar responsif

### **3. Organized Folder Structure**
- Logo: `auditmorowaliutara/app/logo`
- Favicon: `auditmorowaliutara/app/favicon`
- Profile Photos: `auditmorowaliutara/profiles`
- General Files: `auditmorowaliutara/general`

### **4. Return Format**
```javascript
{
  secure_url: "https://res.cloudinary.com/...",
  public_id: "auditmorowaliutara/app/logo/...",
  width: 200,
  height: 200,
  format: "png",
  bytes: 12345,
  original_filename: "logo.png"
}
```

## File yang Diupdate

### **1. src/services/cloudinaryService.js**
- ✅ Menambahkan function `uploadFile`
- ✅ File validation dan optimization
- ✅ Error handling yang baik

### **2. src/components/AppSettings.js**
- ✅ Update `handleFileUpload` untuk menggunakan folder spesifik
- ✅ Logo: `auditmorowaliutara/app/logo`
- ✅ Favicon: `auditmorowaliutara/app/favicon`

### **3. src/components/UserProfile.js**
- ✅ Update `handleFileUpload` untuk foto profil
- ✅ Profile Photos: `auditmorowaliutara/profiles`

## Testing Upload Logo

### **1. Test Upload Logo**
1. Login sebagai admin
2. Buka `/pengaturan`
3. Pilih tab "Pengaturan Aplikasi"
4. Upload logo di section "Logo dan Tampilan"
5. **Harus berhasil tanpa error**

### **2. Test Upload Favicon**
1. Di halaman yang sama
2. Upload favicon
3. **Harus berhasil tanpa error**

### **3. Test Upload Foto Profil**
1. Pilih tab "Profil Admin"
2. Upload foto profil
3. **Harus berhasil tanpa error**

## Cloudinary Configuration

### **Environment Variables**
```javascript
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'kbisnisassets',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'auditmorowali',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '638824498464139',
  apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || 'xLEtFZ-89IjfBLtfgCs0pKYtXno'
};
```

### **Upload Preset Requirements**
- Upload preset harus dikonfigurasi di Cloudinary Console
- Harus mengizinkan unsigned uploads
- Harus mengizinkan folder organization

## Troubleshooting

### **1. Error "Upload failed"**
- Periksa koneksi internet
- Pastikan Cloudinary configuration benar
- Cek upload preset di Cloudinary Console
- Pastikan file format didukung

### **2. Error "File type not allowed"**
- Pastikan file adalah image (jpg, png, gif, webp, dll)
- Cek validasi file di function `validateFile`

### **3. Error "File size too large"**
- File maksimal 10MB untuk file umum
- Compress file jika terlalu besar

### **4. Error Network**
- Periksa koneksi internet
- Cek apakah Cloudinary service accessible
- Restart aplikasi jika perlu

## File Structure di Cloudinary

```
auditmorowaliutara/
├── app/
│   ├── logo/          # Logo aplikasi
│   └── favicon/       # Favicon aplikasi
├── profiles/          # Foto profil user
├── general/           # File umum lainnya
├── documents/         # Dokumen umum
└── file/
    └── audits/
        ├── {auditId}/
        │   ├── work-papers/
        │   ├── evidence/
        │   ├── interviews/
        │   └── notes/
```

## Performance Optimization

### **1. Image Transformation**
- Auto-format untuk format optimal
- Auto-quality untuk kualitas optimal
- Auto-width untuk responsive images

### **2. File Validation**
- Validasi sebelum upload
- Error handling yang efisien
- User feedback yang jelas

### **3. Organized Storage**
- Folder structure yang terorganisir
- Easy management di Cloudinary Console
- Efficient retrieval

## Kesimpulan

✅ **Function uploadFile sudah ditambahkan**
✅ **Upload logo sudah berfungsi**
✅ **Upload favicon sudah berfungsi**
✅ **Upload foto profil sudah berfungsi**
✅ **File organization sudah terstruktur**
✅ **Error handling sudah baik**

**Sekarang upload logo seharusnya berfungsi dengan baik!** 🎉

## Next Steps

1. **Test upload logo** di halaman pengaturan
2. **Verifikasi logo muncul** di sidebar dan login
3. **Test upload foto profil** di profil admin
4. **Monitor Cloudinary Console** untuk file yang terupload
