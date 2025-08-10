import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Cloudinary Configuration sesuai settingan Anda
const CLOUDINARY_CONFIG = {
  cloudName: 'kbisnisassets',
  uploadPreset: 'auditmorowali',
  apiKey: '638824498464139',
  apiSecret: 'xLEtFZ-89IjfBLtfgCs0pKYtXno'
};

// Cloudinary service for handling file uploads dengan integrasi Firestore
export const cloudinaryService = {
  // Upload work paper file dengan integrasi Firestore
  async uploadWorkPaper(auditId, file, workPaperData) {
    try {
      console.log('Starting work paper upload to Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `auditmorowaliutara/file/audits/${auditId}/work-papers`);
      
      // Tambahkan metadata untuk tracking
      formData.append('context', `audit_id=${auditId}|file_type=work_paper|uploaded_by=${workPaperData.uploadedBy || 'current-user'}`);
      
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
      
      // Create work paper document dengan referensi Cloudinary
      const workPaperDoc = {
        ...workPaperData,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: workPaperData.uploadedBy || 'current-user',
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        // Metadata tambahan untuk tracking
        storageProvider: 'cloudinary',
        cloudinaryFolder: `auditmorowaliutara/file/audits/${auditId}/work-papers`,
        downloadUrl: result.secure_url,
        canDownload: true,
        canUpdate: true
      };
      
      // Add to Firestore dengan referensi lengkap
      const docRef = await addDoc(collection(db, `audits/${auditId}/workPapers`), {
        ...workPaperDoc,
        uploadedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Track file upload di collection terpisah
      await addDoc(collection(db, 'file-uploads'), {
        auditId,
        workPaperId: docRef.id,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        cloudinaryPublicId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: workPaperData.uploadedBy || 'current-user',
        uploadedAt: serverTimestamp(),
        status: 'completed',
        storageProvider: 'cloudinary',
        folder: `auditmorowaliutara/file/audits/${auditId}/work-papers`,
        canDownload: true,
        canUpdate: true,
        lastAccessed: serverTimestamp()
      });
      
      // Update audit document dengan referensi file
      const auditRef = doc(db, 'audits', auditId);
      const auditDoc = await getDoc(auditRef);
      if (auditDoc.exists()) {
        await updateDoc(auditRef, {
          workPapersCount: (auditDoc.data().workPapersCount || 0) + 1,
          lastUpdated: serverTimestamp(),
          hasWorkPapers: true
        });
      }
      
      return {
        id: docRef.id,
        ...workPaperDoc,
        downloadURL: result.secure_url,
        firestoreId: docRef.id
      };
    } catch (error) {
      console.error('Error uploading work paper:', error);
      throw error;
    }
  },

  // Upload audit evidence file dengan integrasi Firestore
  async uploadEvidence(auditId, file, evidenceData) {
    try {
      console.log('Starting evidence upload to Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `auditmorowaliutara/file/audits/${auditId}/evidence`);
      formData.append('context', `audit_id=${auditId}|file_type=evidence|uploaded_by=${evidenceData.uploadedBy || 'current-user'}`);
      
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
      
      const evidenceDoc = {
        ...evidenceData,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: evidenceData.uploadedBy || 'current-user',
        uploadedAt: new Date(),
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        storageProvider: 'cloudinary',
        cloudinaryFolder: `auditmorowaliutara/file/audits/${auditId}/evidence`,
        downloadUrl: result.secure_url,
        canDownload: true,
        canUpdate: true
      };
      
      const docRef = await addDoc(collection(db, `audits/${auditId}/evidence`), {
        ...evidenceDoc,
        uploadedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Track file upload
      await addDoc(collection(db, 'file-uploads'), {
        auditId,
        evidenceId: docRef.id,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        cloudinaryPublicId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: evidenceData.uploadedBy || 'current-user',
        uploadedAt: serverTimestamp(),
        status: 'completed',
        storageProvider: 'cloudinary',
        folder: `auditmorowaliutara/file/audits/${auditId}/evidence`,
        canDownload: true,
        canUpdate: true,
        lastAccessed: serverTimestamp()
      });
      
      // Update audit document
      const auditRef = doc(db, 'audits', auditId);
      const auditDoc = await getDoc(auditRef);
      if (auditDoc.exists()) {
        await updateDoc(auditRef, {
          evidenceCount: (auditDoc.data().evidenceCount || 0) + 1,
          lastUpdated: serverTimestamp(),
          hasEvidence: true
        });
      }
      
      return {
        id: docRef.id,
        ...evidenceDoc,
        downloadURL: result.secure_url,
        firestoreId: docRef.id
      };
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }
  },

  // Upload interview recording
  async uploadInterviewRecording(auditId, file, interviewData) {
    try {
      console.log('Starting interview recording upload to Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `auditmorowaliutara/file/audits/${auditId}/interviews`);
      formData.append('resource_type', 'video');
      formData.append('context', `audit_id=${auditId}|file_type=interview|uploaded_by=${interviewData.uploadedBy || 'current-user'}`);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`, {
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
      
      const interviewDoc = {
        ...interviewData,
        recordingFileName: file.name,
        recordingUrl: result.secure_url,
        recordingId: result.public_id,
        recordingSize: file.size,
        recordingType: file.type,
        cloudinaryId: result.public_id,
        cloudinaryUrl: result.secure_url,
        duration: result.duration,
        uploadedBy: interviewData.uploadedBy || 'current-user',
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, `audits/${auditId}/interviews`), {
        ...interviewDoc,
        uploadedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Track file upload
      await addDoc(collection(db, 'file-uploads'), {
        auditId,
        interviewId: docRef.id,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: interviewData.uploadedBy || 'current-user',
        uploadedAt: serverTimestamp(),
        status: 'completed',
        storageProvider: 'cloudinary',
        folder: `auditmorowaliutara/file/audits/${auditId}/interviews`,
        canDownload: true,
        canUpdate: true,
        lastAccessed: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...interviewDoc,
        downloadURL: result.secure_url,
        firestoreId: docRef.id
      };
    } catch (error) {
      console.error('Error uploading interview recording:', error);
      throw error;
    }
  },

  // Upload note attachment
  async uploadNoteAttachment(auditId, file, noteData) {
    try {
      console.log('Starting note attachment upload to Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `auditmorowaliutara/file/audits/${auditId}/notes`);
      formData.append('context', `audit_id=${auditId}|file_type=note|uploaded_by=${noteData.uploadedBy || 'current-user'}`);
      
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
      
      const noteDoc = {
        ...noteData,
        attachments: [{
          fileName: file.name,
          fileUrl: result.secure_url,
          fileId: result.public_id,
          cloudinaryId: result.public_id,
          cloudinaryUrl: result.secure_url,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, `audits/${auditId}/notes`), {
        ...noteDoc,
        attachments: [{
          ...noteDoc.attachments[0],
          uploadedAt: new Date()
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Track file upload
      await addDoc(collection(db, 'file-uploads'), {
        auditId,
        noteId: docRef.id,
        fileName: file.name,
        fileUrl: result.secure_url,
        fileId: result.public_id,
        cloudinaryId: result.public_id,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: noteData.uploadedBy || 'current-user',
        uploadedAt: serverTimestamp(),
        status: 'completed',
        storageProvider: 'cloudinary',
        folder: `auditmorowaliutara/file/audits/${auditId}/notes`,
        canDownload: true,
        canUpdate: true,
        lastAccessed: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...noteDoc,
        downloadURL: result.secure_url,
        firestoreId: docRef.id
      };
    } catch (error) {
      console.error('Error uploading note attachment:', error);
      throw error;
    }
  },

  // Get file download URL dari Firestore
  async getFileDownloadUrl(auditId, fileType, fileId) {
    try {
      let collectionName;
      switch (fileType) {
        case 'workPaper':
          collectionName = 'workPapers';
          break;
        case 'evidence':
          collectionName = 'evidence';
          break;
        case 'interview':
          collectionName = 'interviews';
          break;
        case 'note':
          collectionName = 'notes';
          break;
        default:
          throw new Error('Invalid file type');
      }
      
      const fileDoc = await getDoc(doc(db, `audits/${auditId}/${collectionName}`, fileId));
      if (!fileDoc.exists()) {
        throw new Error('File not found');
      }
      
      const fileData = fileDoc.data();
      return {
        downloadUrl: fileData.cloudinaryUrl || fileData.fileUrl,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        canDownload: fileData.canDownload !== false,
        cloudinaryId: fileData.cloudinaryId
      };
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },

  // Update file metadata di Firestore
  async updateFileMetadata(auditId, fileType, fileId, updates) {
    try {
      let collectionName;
      switch (fileType) {
        case 'workPaper':
          collectionName = 'workPapers';
          break;
        case 'evidence':
          collectionName = 'evidence';
          break;
        case 'interview':
          collectionName = 'interviews';
          break;
        case 'note':
          collectionName = 'notes';
          break;
        default:
          throw new Error('Invalid file type');
      }
      
      const fileRef = doc(db, `audits/${auditId}/${collectionName}`, fileId);
      await updateDoc(fileRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // Update file-uploads tracking
      const uploadsQuery = query(
        collection(db, 'file-uploads'),
        where('auditId', '==', auditId),
        where(`${fileType}Id`, '==', fileId)
      );
      const uploadsSnapshot = await getDocs(uploadsQuery);
      if (!uploadsSnapshot.empty) {
        const uploadDoc = uploadsSnapshot.docs[0];
        await updateDoc(uploadDoc.ref, {
          lastUpdated: serverTimestamp(),
          ...updates
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
  },

  // Delete file dari Cloudinary dan Firestore
  async deleteFile(auditId, fileType, fileId) {
    try {
      // Get file info from Firestore first
      let collectionName;
      switch (fileType) {
        case 'workPaper':
          collectionName = 'workPapers';
          break;
        case 'evidence':
          collectionName = 'evidence';
          break;
        case 'interview':
          collectionName = 'interviews';
          break;
        case 'note':
          collectionName = 'notes';
          break;
        default:
          throw new Error('Invalid file type');
      }
      
      const fileDoc = await getDoc(doc(db, `audits/${auditId}/${collectionName}`, fileId));
      if (!fileDoc.exists()) {
        throw new Error('File not found in Firestore');
      }
      
      const fileData = fileDoc.data();
      const cloudinaryId = fileData.cloudinaryId;
      
      if (cloudinaryId) {
        // Delete from Cloudinary
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const signature = this.generateSignature(cloudinaryId, timestamp);
        
        const formData = new FormData();
        formData.append('public_id', cloudinaryId);
        formData.append('signature', signature);
        formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
        formData.append('timestamp', timestamp);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          console.warn('Failed to delete from Cloudinary, but continuing with Firestore deletion');
        }
      }
      
      // Delete from Firestore
      await updateDoc(doc(db, `audits/${auditId}/${collectionName}`, fileId), {
        deletedAt: serverTimestamp(),
        isDeleted: true
      });
      
      // Update audit document counts
      const auditRef = doc(db, 'audits', auditId);
      const auditDoc = await getDoc(auditRef);
      if (auditDoc.exists()) {
        const auditData = auditDoc.data();
        const updateData = {};
        
        switch (fileType) {
          case 'workPaper':
            updateData.workPapersCount = Math.max(0, (auditData.workPapersCount || 0) - 1);
            break;
          case 'evidence':
            updateData.evidenceCount = Math.max(0, (auditData.evidenceCount || 0) - 1);
            break;
        }
        
        if (Object.keys(updateData).length > 0) {
          updateData.lastUpdated = serverTimestamp();
          await updateDoc(auditRef, updateData);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get all files for an audit
  async getAuditFiles(auditId) {
    try {
      const files = {
        workPapers: [],
        evidence: [],
        interviews: [],
        notes: []
      };
      
      // Get work papers
      const workPapersQuery = query(
        collection(db, `audits/${auditId}/workPapers`),
        where('isDeleted', '!=', true),
        orderBy('uploadedAt', 'desc')
      );
      const workPapersSnapshot = await getDocs(workPapersQuery);
      files.workPapers = workPapersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get evidence
      const evidenceQuery = query(
        collection(db, `audits/${auditId}/evidence`),
        where('isDeleted', '!=', true),
        orderBy('uploadedAt', 'desc')
      );
      const evidenceSnapshot = await getDocs(evidenceQuery);
      files.evidence = evidenceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get interviews
      const interviewsQuery = query(
        collection(db, `audits/${auditId}/interviews`),
        where('isDeleted', '!=', true),
        orderBy('uploadedAt', 'desc')
      );
      const interviewsSnapshot = await getDocs(interviewsQuery);
      files.interviews = interviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get notes
      const notesQuery = query(
        collection(db, `audits/${auditId}/notes`),
        where('isDeleted', '!=', true),
        orderBy('uploadedAt', 'desc')
      );
      const notesSnapshot = await getDocs(notesQuery);
      files.notes = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return files;
    } catch (error) {
      console.error('Error getting audit files:', error);
      throw error;
    }
  },

  // Generate signature for authenticated requests
  generateSignature(publicId, timestamp) {
    const params = {
      public_id: publicId,
      timestamp: timestamp
    };
    
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
    
    const signatureString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + CLOUDINARY_CONFIG.apiSecret;
    
    return this.sha1(signatureString);
  },

  // Simple SHA-1 implementation
  sha1(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  // Validate file before upload
  validateFile(file, maxSize = 50 * 1024 * 1024) {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'application/zip',
      'application/x-zip-compressed',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'video/mp4',
      'video/webm',
      'video/ogg'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed. Please upload a supported file type.');
    }

    if (file.size > maxSize) {
      throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
    }

    return true;
  },

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file icon based on type
  getFileIcon(fileType) {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('zip')) return '📦';
    return '📎';
  }
};
