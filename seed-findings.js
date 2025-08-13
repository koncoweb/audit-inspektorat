const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "audit-inspektorat.firebaseapp.com",
  projectId: "audit-inspektorat",
  storageBucket: "audit-inspektorat.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample findings data
const sampleFindings = [
  {
    title: 'Ketidaksesuaian Pencatatan Aset',
    description: 'Ditemukan perbedaan nilai aset tetap antara catatan akuntansi dengan kondisi fisik di lapangan',
    severity: 'Tinggi',
    category: 'Keuangan',
    recommendation: 'Melakukan rekonsiliasi dan penyesuaian nilai aset tetap sesuai kondisi riil',
    status: 'Dalam Tindak Lanjut',
    auditContext: 'Audit Keuangan Dinas Pendidikan 2024',
    responsibleParty: 'Kepala Bagian Keuangan',
    findingDate: '2024-01-12',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    title: 'Dokumentasi Pengadaan Tidak Lengkap',
    description: 'Beberapa dokumen kontrak dan berita acara penerimaan barang tidak tersimpan dengan baik',
    severity: 'Sedang',
    category: 'Kepatuhan',
    recommendation: 'Menyusun sistem filing dan dokumentasi yang lebih tertib',
    status: 'Terbuka',
    auditContext: 'Audit Keuangan Dinas Pendidikan 2024',
    responsibleParty: 'Kepala Bagian Umum',
    findingDate: '2024-01-13',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    title: 'Target Cakupan Imunisasi Belum Tercapai',
    description: 'Capaian imunisasi dasar hanya 78% dari target 90% pada tahun 2023',
    severity: 'Tinggi',
    category: 'Kinerja',
    recommendation: 'Meningkatkan sosialisasi dan jangkauan pelayanan imunisasi',
    status: 'Selesai',
    auditContext: 'Audit Kinerja Program Kesehatan',
    responsibleParty: 'Kepala Bidang Kesehatan Masyarakat',
    findingDate: '2024-01-10',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

// Helper function to check if data exists
const checkIfDataExists = async (collectionName, field, value) => {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Function to seed findings
const seedFindings = async () => {
  console.log('Seeding findings...');
  
  for (const finding of sampleFindings) {
    const exists = await checkIfDataExists('audit_findings', 'title', finding.title);
    if (!exists) {
      try {
        await addDoc(collection(db, 'audit_findings'), {
          ...finding,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Finding ${finding.title} added successfully`);
      } catch (error) {
        console.error(`Error adding finding ${finding.title}:`, error);
      }
    } else {
      console.log(`Finding ${finding.title} already exists`);
    }
  }
};

// Run the seeding
seedFindings()
  .then(() => {
    console.log('Findings seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding findings:', error);
    process.exit(1);
  });
