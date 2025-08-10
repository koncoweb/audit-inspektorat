# Cloudinary Setup Guide untuk Si-MAIL

## 📋 Overview
Dokumen ini menjelaskan setup dan konfigurasi Cloudinary untuk sistem file hosting di aplikasi Si-MAIL (Sistem Manajemen Audit Internal).

## 🔧 Konfigurasi Cloudinary

### 1. Credentials yang Digunakan
```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'kbisnisassets',
  uploadPreset: 'auditmorowali',
  apiKey: '638824498464139',
  apiSecret: 'xLEtFZ-89IjfBLtfgCs0pKYtXno'
};
```

### 2. Upload Preset Settings
- **Nama Preset**: `auditmorowali`
- **Overwrite**: `false`
- **Unique Filename**: `true`
- **Type**: `upload`
- **Folder**: `auditmorowaliutara/file`

## 📁 Struktur Folder Cloudinary

```
auditmorowaliutara/
└── file/
    └── audits/
        └── {auditId}/
            ├── work-papers/
            ├── evidence/
            ├── interviews/
            └── notes/
```

## 🚀 Fitur Upload yang Tersedia

### 1. Work Papers (Kertas Kerja)
- **Endpoint**: `/auto/upload`
- **Folder**: `auditmorowaliutara/file/audits/{auditId}/work-papers`
- **File Types**: PDF, DOC, DOCX, XLS, XLSX, Images
- **Max Size**: 50MB

### 2. Evidence (Bukti Audit)
- **Endpoint**: `/auto/upload`
- **Folder**: `auditmorowaliutara/file/audits/{auditId}/evidence`
- **File Types**: PDF, Images, Videos, Audio
- **Max Size**: 50MB

### 3. Interview Recordings
- **Endpoint**: `/video/upload`
- **Folder**: `auditmorowaliutara/file/audits/{auditId}/interviews`
- **File Types**: MP4, WebM, OGG, Audio files
- **Max Size**: 100MB

### 4. Note Attachments
- **Endpoint**: `/auto/upload`
- **Folder**: `auditmorowaliutara/file/audits/{auditId}/notes`
- **File Types**: All supported types
- **Max Size**: 50MB

## 📊 Integrasi dengan Firestore

### 1. Metadata yang Disimpan di Firestore
```javascript
{
  fileName: "document.pdf",
  fileUrl: "https://res.cloudinary.com/kbisnisassets/...",
  fileId: "auditmorowaliutara/file/audits/123/work-papers/document",
  cloudinaryId: "auditmorowaliutara/file/audits/123/work-papers/document",
  cloudinaryUrl: "https://res.cloudinary.com/kbisnisassets/...",
  cloudinaryPublicId: "auditmorowaliutara/file/audits/123/work-papers/document",
  fileSize: 1024000,
  fileType: "application/pdf",
  uploadedBy: "user@example.com",
  uploadedAt: Timestamp,
  storageProvider: "cloudinary",
  cloudinaryFolder: "auditmorowaliutara/file/audits/123/work-papers",
  downloadUrl: "https://res.cloudinary.com/kbisnisassets/...",
  canDownload: true,
  canUpdate: true
}
```

### 2. Collections yang Diupdate
- **Subcollections**: `audits/{auditId}/workPapers`, `evidence`, `interviews`, `notes`
- **Tracking**: `file-uploads` collection
- **Audit Document**: Update counters (`workPapersCount`, `evidenceCount`)

## 🔒 Security & Permissions

### 1. File Access Control
- Files dapat diakses melalui Cloudinary URL
- Download tracking di Firestore
- User-based access control

### 2. File Validation
```javascript
const allowedTypes = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'text/csv',
  'application/zip', 'application/x-zip-compressed',
  'audio/mpeg', 'audio/wav', 'audio/mp4',
  'video/mp4', 'video/webm', 'video/ogg'
];
```

## 🛠️ Operations yang Tersedia

### 1. Upload Operations
- `uploadWorkPaper(auditId, file, metadata)`
- `uploadEvidence(auditId, file, metadata)`
- `uploadInterviewRecording(auditId, file, metadata)`
- `uploadNoteAttachment(auditId, file, metadata)`

### 2. Download Operations
- `getFileDownloadUrl(auditId, fileType, fileId)`
- Direct Cloudinary URL access

### 3. Update Operations
- `updateFileMetadata(auditId, fileType, fileId, updates)`
- Update Firestore metadata

### 4. Delete Operations
- `deleteFile(auditId, fileType, fileId)`
- Soft delete in Firestore
- Hard delete from Cloudinary (with signature)

## 📈 Monitoring & Analytics

### 1. Upload Tracking
- File uploads tracked in `file-uploads` collection
- Upload status, timestamps, user info
- File access logs

### 2. Audit Counters
- `workPapersCount` in audit documents
- `evidenceCount` in audit documents
- Real-time updates

## 🔧 Troubleshooting

### 1. Common Issues
- **Upload Failed**: Check upload preset permissions
- **File Not Found**: Verify Cloudinary URL
- **Permission Denied**: Check API key/secret

### 2. Error Handling
```javascript
try {
  const result = await cloudinaryService.uploadWorkPaper(auditId, file, data);
} catch (error) {
  console.error('Upload error:', error);
  // Handle error appropriately
}
```

## 📱 Usage Examples

### 1. Upload Work Paper
```javascript
const uploadData = {
  title: "Audit Report 2024",
  description: "Annual audit report",
  type: "Document",
  status: "Draft",
  uploadedBy: "auditor@company.com"
};

const result = await cloudinaryService.uploadWorkPaper(
  "audit123", 
  file, 
  uploadData
);
```

### 2. Download File
```javascript
const fileInfo = await cloudinaryService.getFileDownloadUrl(
  "audit123", 
  "workPaper", 
  "fileId123"
);

// fileInfo.downloadUrl contains the Cloudinary URL
window.open(fileInfo.downloadUrl, '_blank');
```

## 🔄 Migration from Firebase Storage

### 1. Benefits of Cloudinary
- **Better Performance**: Global CDN
- **Image Optimization**: Automatic resizing, compression
- **Video Support**: Streaming, thumbnails
- **Cost Effective**: Pay per usage
- **No Storage Rules**: Simpler configuration

### 2. Data Consistency
- All file references stored in Firestore
- Cloudinary URLs for direct access
- Metadata synchronization
- Audit trail maintained

## 📞 Support

Untuk masalah teknis terkait Cloudinary:
1. Check Cloudinary Dashboard
2. Verify upload preset settings
3. Review API key permissions
4. Check file size and type restrictions

---

**Last Updated**: January 2024
**Version**: 1.0
**Maintainer**: Si-MAIL Development Team
