import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Sample data untuk seeding database
const sampleUsers = [
  {
    name: 'Dr. Ahmad Rahman',
    email: 'ahmad.rahman@inspektorat.go.id',
    role: 'Administrator',
    department: 'Inspektorat',
    phone: '+6281234567890',
    position: 'Kepala Inspektorat'
  },
  {
    name: 'Sri Wahyuni',
    email: 'sri.wahyuni@inspektorat.go.id',
    role: 'Auditor',
    department: 'Inspektorat',
    phone: '+6281234567891',
    position: 'Auditor Senior'
  },
  {
    name: 'Budi Santoso',
    email: 'budi.santoso@inspektorat.go.id',
    role: 'Auditor',
    department: 'Inspektorat',
    phone: '+6281234567892',
    position: 'Auditor'
  },
  {
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@inspektorat.go.id',
    role: 'Supervisor',
    department: 'Inspektorat',
    phone: '+6281234567893',
    position: 'Supervisor Audit'
  }
];

const sampleAudits = [
  {
    title: 'Audit Keuangan Dinas Pendidikan',
    description: 'Audit keuangan tahunan Dinas Pendidikan Kabupaten Morowali Utara untuk tahun anggaran 2024',
    department: 'Dinas Pendidikan',
    status: 'Dalam Proses',
    progress: 75,
    startDate: new Date('2024-01-01'),
    deadline: new Date('2024-01-15'),
    scope: 'Pengelolaan keuangan dan aset Dinas Pendidikan',
    objectives: 'Memastikan pengelolaan keuangan sesuai dengan peraturan yang berlaku',
    riskLevel: 'Medium',
    budget: 50000000
  },
  {
    title: 'Audit Kinerja Dinas Kesehatan',
    description: 'Audit kinerja program kesehatan masyarakat Dinas Kesehatan',
    department: 'Dinas Kesehatan',
    status: 'Review',
    progress: 90,
    startDate: new Date('2024-01-05'),
    deadline: new Date('2024-01-20'),
    scope: 'Program kesehatan masyarakat dan pelayanan kesehatan',
    objectives: 'Menilai efektivitas dan efisiensi program kesehatan',
    riskLevel: 'High',
    budget: 75000000
  },
  {
    title: 'Audit Kepatuhan Dinas Lingkungan',
    description: 'Audit kepatuhan terhadap peraturan lingkungan hidup',
    department: 'Dinas Lingkungan Hidup',
    status: 'Selesai',
    progress: 100,
    startDate: new Date('2023-12-01'),
    deadline: new Date('2023-12-31'),
    scope: 'Kepatuhan terhadap peraturan lingkungan hidup',
    objectives: 'Memastikan kepatuhan terhadap peraturan lingkungan',
    riskLevel: 'Low',
    budget: 30000000
  },
  {
    title: 'Audit Keuangan Dinas Perhubungan',
    description: 'Audit keuangan dan pengelolaan aset Dinas Perhubungan',
    department: 'Dinas Perhubungan',
    status: 'Dalam Proses',
    progress: 45,
    startDate: new Date('2024-01-10'),
    deadline: new Date('2024-01-25'),
    scope: 'Pengelolaan keuangan dan aset transportasi',
    objectives: 'Memastikan pengelolaan keuangan dan aset yang efektif',
    riskLevel: 'Medium',
    budget: 60000000
  }
];

const sampleFindings = [
  {
    title: 'Dokumentasi tidak lengkap',
    description: 'Beberapa dokumen pendukung tidak tersedia atau tidak lengkap',
    severity: 'Medium',
    category: 'Dokumentasi',
    recommendation: 'Perbaiki sistem dokumentasi dan pastikan semua dokumen tersimpan dengan baik',
    status: 'Open',
    dueDate: new Date('2024-02-15')
  },
  {
    title: 'Penyimpangan prosedur pengadaan',
    description: 'Proses pengadaan tidak mengikuti prosedur yang telah ditetapkan',
    severity: 'High',
    category: 'Pengadaan',
    recommendation: 'Lakukan pengadaan ulang sesuai dengan prosedur yang berlaku',
    status: 'In Progress',
    dueDate: new Date('2024-02-01')
  },
  {
    title: 'Keterlambatan pelaporan',
    description: 'Laporan keuangan tidak disampaikan tepat waktu',
    severity: 'Low',
    category: 'Pelaporan',
    recommendation: 'Buat sistem reminder untuk pelaporan tepat waktu',
    status: 'Resolved',
    dueDate: new Date('2024-01-30')
  }
];

const sampleDocuments = [
  {
    title: 'Laporan Audit Keuangan Dinas Pendidikan',
    fileName: 'laporan_audit_pendidikan_2024.pdf',
    fileType: 'pdf',
    fileSize: 2048576,
    category: 'Laporan Audit'
  },
  {
    title: 'Dokumen Pendukung Audit',
    fileName: 'dokumen_pendukung.zip',
    fileType: 'zip',
    fileSize: 10485760,
    category: 'Dokumen Pendukung'
  },
  {
    title: 'Foto Bukti Temuan',
    fileName: 'foto_temuan.jpg',
    fileType: 'jpg',
    fileSize: 512000,
    category: 'Bukti Audit'
  }
];

// Fungsi untuk mengecek apakah data sudah ada
const checkIfDataExists = async (collectionName, field, value) => {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Fungsi untuk seeding users
export const seedUsers = async () => {
  console.log('Seeding users...');
  
  for (const user of sampleUsers) {
    const exists = await checkIfDataExists('users', 'email', user.email);
    if (!exists) {
      try {
        await addDoc(collection(db, 'users'), {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`User ${user.name} added successfully`);
      } catch (error) {
        console.error(`Error adding user ${user.name}:`, error);
      }
    } else {
      console.log(`User ${user.name} already exists`);
    }
  }
};

// Fungsi untuk seeding audits
export const seedAudits = async () => {
  console.log('Seeding audits...');
  
  for (const audit of sampleAudits) {
    const exists = await checkIfDataExists('audits', 'title', audit.title);
    if (!exists) {
      try {
        await addDoc(collection(db, 'audits'), {
          ...audit,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Audit ${audit.title} added successfully`);
      } catch (error) {
        console.error(`Error adding audit ${audit.title}:`, error);
      }
    } else {
      console.log(`Audit ${audit.title} already exists`);
    }
  }
};

// Fungsi untuk seeding findings
export const seedFindings = async () => {
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

// Fungsi untuk seeding documents
export const seedDocuments = async () => {
  console.log('Seeding documents...');
  
  for (const document of sampleDocuments) {
    const exists = await checkIfDataExists('documents', 'title', document.title);
    if (!exists) {
      try {
        await addDoc(collection(db, 'documents'), {
          ...document,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Document ${document.title} added successfully`);
      } catch (error) {
        console.error(`Error adding document ${document.title}:`, error);
      }
    } else {
      console.log(`Document ${document.title} already exists`);
    }
  }
};

// Fungsi utama untuk seeding semua data
export const seedAllData = async () => {
  try {
    console.log('Starting data seeding...');
    
    await seedUsers();
    await seedAudits();
    await seedFindings();
    await seedDocuments();
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  }
};

// Fungsi untuk mengecek jumlah data di setiap collection
export const checkDataCount = async () => {
  try {
    const collections = ['users', 'audits', 'audit_findings', 'documents'];
    const counts = {};
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      counts[collectionName] = querySnapshot.size;
    }
    
    console.log('Data counts:', counts);
    return counts;
  } catch (error) {
    console.error('Error checking data count:', error);
    return {};
  }
};
