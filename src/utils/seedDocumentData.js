import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../constants/collections';

export const seedDocumentData = async () => {
  const documents = [
    {
      fileName: 'Kertas Kerja Audit Keuangan Disdik.pdf',
      fileSize: 2516582, // 2.4 MB
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/dummy1.pdf',
      publicId: 'dummy1',
      title: 'Kertas Kerja Audit Keuangan Dinas Pendidikan',
      description: 'Dokumen kertas kerja untuk audit keuangan di Dinas Pendidikan',
      category: 'Kertas Kerja',
      tags: ['audit', 'keuangan', 'disdik'],
      uploadedBy: 'Sri Wahyuni',
      uploadDate: new Date('2024-01-15'),
      auditId: null
    },
    {
      fileName: 'Bukti Transfer Dana BOS.jpg',
      fileSize: 1887436, // 1.8 MB
      fileType: 'image/jpeg',
      fileUrl: 'https://example.com/dummy2.jpg',
      publicId: 'dummy2',
      title: 'Bukti Transfer Dana BOS',
      description: 'Bukti transfer dana BOS untuk audit keuangan',
      category: 'Bukti Audit',
      tags: ['bukti', 'transfer', 'bos'],
      uploadedBy: 'Budi Santoso',
      uploadDate: new Date('2024-01-14'),
      auditId: null
    },
    {
      fileName: 'Template Laporan Audit.docx',
      fileSize: 159744, // 156 KB
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileUrl: 'https://example.com/dummy3.docx',
      publicId: 'dummy3',
      title: 'Template Laporan Audit',
      description: 'Template standar untuk laporan audit',
      category: 'Template',
      tags: ['template', 'laporan', 'audit'],
      uploadedBy: 'Ahmad Rahman',
      uploadDate: new Date('2024-01-10'),
      auditId: null
    },
    {
      fileName: 'Peraturan Pemerintah No. 60 Tahun 2008.pdf',
      fileSize: 1048576, // 1 MB
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/dummy4.pdf',
      publicId: 'dummy4',
      title: 'Peraturan Pemerintah No. 60 Tahun 2008',
      description: 'Peraturan tentang Sistem Pengendalian Intern Pemerintah',
      category: 'Regulasi',
      tags: ['peraturan', 'pemerintah', 'spip'],
      uploadedBy: 'Ahmad Rahman',
      uploadDate: new Date('2024-01-08'),
      auditId: null
    },
    {
      fileName: 'Laporan Audit Semester I 2024.pdf',
      fileSize: 3145728, // 3 MB
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/dummy5.pdf',
      publicId: 'dummy5',
      title: 'Laporan Audit Semester I 2024',
      description: 'Laporan hasil audit semester pertama tahun 2024',
      category: 'Laporan',
      tags: ['laporan', 'semester', '2024'],
      uploadedBy: 'Sri Wahyuni',
      uploadDate: new Date('2024-01-05'),
      auditId: null
    }
  ];

  try {
    console.log('Seeding document data...');
    
    for (const docData of documents) {
      await addDoc(collection(db, COLLECTIONS.DOCUMENTS), {
        ...docData,
        uploadDate: serverTimestamp()
      });
    }
    
    console.log('Document data seeded successfully!');
  } catch (error) {
    console.error('Error seeding document data:', error);
  }
};
