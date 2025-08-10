import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
// Collection names (inline to avoid import issues)
const COLLECTIONS = {
  USERS: 'users',
  AUDITS: 'audits',
  AUDIT_PLANS: 'audit_plans',
  WORK_PAPERS: 'work_papers',
  AUDIT_EVIDENCE: 'audit_evidence',
  AUDIT_NOTES: 'audit_notes',
  AUDIT_FINDINGS: 'audit_findings',
  DOCUMENTS: 'documents',
  FOLLOW_UPS: 'follow_ups',
  REPORTS: 'reports'
};

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
  // Planning audits (Draft, Disetujui, Berlangsung, Selesai)
  {
    title: 'Audit Keuangan Dinas Pendidikan 2024',
    description: 'Audit keuangan tahunan Dinas Pendidikan Kabupaten Morowali Utara untuk tahun anggaran 2024',
    department: 'Dinas Pendidikan',
    type: 'Audit Keuangan',
    priority: 'Tinggi',
    status: 'Berlangsung',
    auditor: 'Sri Wahyuni, S.E., M.Ak.',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    period: '2024-01-15 s/d 2024-02-15',
    scope: 'Pengelolaan keuangan dan aset Dinas Pendidikan',
    objectives: 'Memastikan pengelolaan keuangan sesuai dengan peraturan yang berlaku',
    riskLevel: 'Medium',
    budget: 50000000,
    progress: 75,
    team: [
      {
        id: '1',
        name: 'Sri Wahyuni',
        role: 'Ketua Tim',
        email: 'sri.wahyuni@inspektorat.go.id',
        phone: '+6281234567891'
      },
      {
        id: '2',
        name: 'Ahmad Rahman',
        role: 'Anggota Tim',
        email: 'ahmad.rahman@inspektorat.go.id',
        phone: '+6281234567890'
      },
      {
        id: '3',
        name: 'Budi Santoso',
        role: 'Anggota Tim',
        email: 'budi.santoso@inspektorat.go.id',
        phone: '+6281234567892'
      }
    ],
    workPapers: [],
    evidence: [],
    notes: []
  },
  {
    title: 'Audit Kinerja Program Kesehatan Masyarakat',
    description: 'Audit kinerja program kesehatan masyarakat Dinas Kesehatan',
    department: 'Dinas Kesehatan',
    type: 'Audit Kinerja',
    priority: 'Tinggi',
    status: 'Disetujui',
    auditor: 'Budi Santoso, S.Ak.',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-01'),
    period: '2024-02-01 s/d 2024-03-01',
    scope: 'Program kesehatan masyarakat dan pelayanan kesehatan',
    objectives: 'Menilai efektivitas dan efisiensi program kesehatan',
    riskLevel: 'High',
    budget: 75000000,
    progress: 25,
    team: [
      {
        id: '1',
        name: 'Siti Nurhaliza',
        role: 'Ketua Tim',
        email: 'siti.nurhaliza@inspektorat.go.id',
        phone: '+6281234567893'
      }
    ],
    workPapers: [],
    evidence: [],
    notes: []
  },
  {
    title: 'Audit Kepatuhan Dinas Lingkungan',
    description: 'Audit kepatuhan terhadap peraturan lingkungan hidup',
    department: 'Dinas Lingkungan Hidup',
    type: 'Audit Kepatuhan',
    priority: 'Sedang',
    status: 'Review',
    auditor: 'Budi Santoso, S.Ak.',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    period: '2023-12-01 s/d 2023-12-31',
    scope: 'Kepatuhan terhadap peraturan lingkungan hidup',
    objectives: 'Memastikan kepatuhan terhadap peraturan lingkungan',
    riskLevel: 'Low',
    budget: 30000000,
    progress: 90,
    team: [
      {
        id: '1',
        name: 'Budi Santoso',
        role: 'Ketua Tim',
        email: 'budi.santoso@inspektorat.go.id',
        phone: '+6281234567892'
      },
      {
        id: '2',
        name: 'Sri Wahyuni',
        role: 'Anggota Tim',
        email: 'sri.wahyuni@inspektorat.go.id',
        phone: '+6281234567891'
      }
    ],
    workPapers: [],
    evidence: [],
    notes: []
  },
  {
    title: 'Audit Keuangan Dinas Perhubungan',
    description: 'Audit keuangan dan pengelolaan aset Dinas Perhubungan',
    department: 'Dinas Perhubungan',
    type: 'Audit Keuangan',
    priority: 'Sedang',
    status: 'Finalisasi',
    auditor: 'Ahmad Rahman, S.E., M.Ak.',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-25'),
    period: '2024-01-10 s/d 2024-01-25',
    scope: 'Pengelolaan keuangan dan aset transportasi',
    objectives: 'Memastikan pengelolaan keuangan dan aset yang efektif',
    riskLevel: 'Medium',
    budget: 60000000,
    progress: 95,
    team: [
      {
        id: '1',
        name: 'Ahmad Rahman',
        role: 'Ketua Tim',
        email: 'ahmad.rahman@inspektorat.go.id',
        phone: '+6281234567890'
      }
    ],
    workPapers: [],
    evidence: [],
    notes: []
  },
  // Additional planning audits
  {
    title: 'Audit Kepatuhan Pengadaan Barang dan Jasa',
    description: 'Audit kepatuhan terhadap peraturan pengadaan barang dan jasa',
    department: 'Bagian Pengadaan',
    type: 'Audit Kepatuhan',
    priority: 'Sedang',
    status: 'Draft',
    auditor: 'Belum ditentukan',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-30'),
    period: '2024-03-01 s/d 2024-03-30',
    scope: 'Proses pengadaan barang dan jasa',
    objectives: 'Memastikan kepatuhan terhadap peraturan pengadaan',
    riskLevel: 'Low',
    budget: 30000000,
    progress: 0,
    team: [],
    workPapers: [],
    evidence: [],
    notes: []
  },
  {
    title: 'Audit Kinerja Program Pembangunan Infrastruktur',
    description: 'Audit kinerja program pembangunan infrastruktur Dinas PUPR',
    department: 'Dinas PUPR',
    type: 'Audit Kinerja',
    priority: 'Tinggi',
    status: 'Selesai',
    auditor: 'Siti Nurhaliza, S.E., M.Ak.',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-30'),
    period: '2023-11-01 s/d 2023-11-30',
    scope: 'Program pembangunan infrastruktur jalan dan jembatan',
    objectives: 'Menilai efektivitas dan efisiensi program pembangunan',
    riskLevel: 'High',
    budget: 100000000,
    progress: 100,
    team: [
      {
        id: '1',
        name: 'Siti Nurhaliza',
        role: 'Ketua Tim',
        email: 'siti.nurhaliza@inspektorat.go.id',
        phone: '+6281234567893'
      },
      {
        id: '2',
        name: 'Budi Santoso',
        role: 'Anggota Tim',
        email: 'budi.santoso@inspektorat.go.id',
        phone: '+6281234567892'
      }
    ],
    workPapers: [],
    evidence: [],
    notes: []
  }
];

// Extended sample audit data with new structure
const sampleAuditsExtended = [
  {
    title: 'Audit Kinerja Program Kesehatan',
    department: 'Dinas Kesehatan',
    type: 'Audit Kinerja',
    priority: 'Tinggi',
    status: 'Berlangsung',
    riskLevel: 'Tinggi',
    budget: 50000000,
    progress: 75,
    overallProgress: 75,
    currentStage: 'Persiapan',
    stageProgress: 25,
    description: 'Audit kinerja program kesehatan masyarakat untuk memastikan efektivitas dan efisiensi pelayanan kesehatan.',
    period: 'Januari - Maret 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    auditor: 'Dr. Sarah Johnson',
    team: [
      { name: 'Dr. Sarah Johnson', role: 'Ketua Tim' },
      { name: 'Ahmad Rahman', role: 'Senior Auditor' },
      { name: 'Siti Nurhaliza', role: 'Auditor' }
    ],
    workPapers: [
      {
        id: 'wp001',
        title: 'Analisis Dokumen Program',
        type: 'Analisis',
        status: 'Selesai',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'wp002',
        title: 'Observasi Lapangan',
        type: 'Observasi',
        status: 'Dalam Proses',
        createdAt: new Date('2024-01-20')
      }
    ],
    evidence: [
      {
        id: 'ev001',
        title: 'Dokumen SOP Program',
        type: 'Dokumen',
        fileUrl: 'https://example.com/sop.pdf',
        uploadedBy: 'Dr. Sarah Johnson',
        createdAt: new Date('2024-01-10')
      },
      {
        id: 'ev002',
        title: 'Foto Observasi Lapangan',
        type: 'Foto',
        fileUrl: 'https://example.com/photo.jpg',
        uploadedBy: 'Ahmad Rahman',
        createdAt: new Date('2024-01-18')
      }
    ],
    interviews: [
      {
        id: 'int001',
        interviewee: 'Kepala Dinas Kesehatan',
        date: new Date('2024-01-12'),
        duration: 120,
        summary: 'Wawancara mengenai implementasi program kesehatan',
        status: 'Selesai'
      },
      {
        id: 'int002',
        interviewee: 'Staff Program Kesehatan',
        date: new Date('2024-01-16'),
        duration: 90,
        summary: 'Wawancara mengenai pelaksanaan harian program',
        status: 'Selesai'
      }
    ],
    findings: [
      {
        id: 'find001',
        title: 'Keterlambatan Pelaporan',
        severity: 'Sedang',
        category: 'Kepatuhan',
        description: 'Terdapat keterlambatan dalam pelaporan bulanan program',
        recommendation: 'Perlu peningkatan sistem monitoring',
        status: 'Open'
      },
      {
        id: 'find002',
        title: 'Kurangnya Dokumentasi',
        severity: 'Rendah',
        category: 'Dokumentasi',
        description: 'Dokumentasi kegiatan tidak lengkap',
        recommendation: 'Perlu standarisasi format dokumentasi',
        status: 'Open'
      }
    ],
    notes: [
      {
        id: 'note001',
        title: 'Observasi Awal',
        content: 'Program kesehatan berjalan dengan baik secara umum',
        author: 'Dr. Sarah Johnson',
        createdAt: new Date('2024-01-15')
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    title: 'Audit Keuangan Unit Pelayanan',
    department: 'Keuangan',
    type: 'Audit Keuangan',
    priority: 'Sedang',
    status: 'Disetujui',
    riskLevel: 'Sedang',
    budget: 30000000,
    progress: 45,
    overallProgress: 45,
    currentStage: 'Pelaksanaan',
    stageProgress: 60,
    description: 'Audit keuangan untuk memastikan akurasi dan kepatuhan pelaporan keuangan unit pelayanan.',
    period: 'Februari - April 2024',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    auditor: 'Budi Santoso',
    team: [
      { name: 'Budi Santoso', role: 'Ketua Tim' },
      { name: 'Dewi Sartika', role: 'Auditor Keuangan' }
    ],
    workPapers: [
      {
        id: 'wp003',
        title: 'Analisis Laporan Keuangan',
        type: 'Analisis',
        status: 'Selesai',
        createdAt: new Date('2024-02-05')
      }
    ],
    evidence: [
      {
        id: 'ev003',
        title: 'Laporan Keuangan Q4 2023',
        type: 'Dokumen',
        fileUrl: 'https://example.com/laporan.pdf',
        uploadedBy: 'Budi Santoso',
        createdAt: new Date('2024-02-03')
      }
    ],
    interviews: [
      {
        id: 'int003',
        interviewee: 'Kepala Unit Keuangan',
        date: new Date('2024-02-08'),
        duration: 60,
        summary: 'Wawancara mengenai sistem keuangan',
        status: 'Selesai'
      }
    ],
    findings: [
      {
        id: 'find003',
        title: 'Pencatatan Transaksi',
        severity: 'Rendah',
        category: 'Akuntansi',
        description: 'Beberapa transaksi tidak dicatat tepat waktu',
        recommendation: 'Perlu peningkatan sistem pencatatan',
        status: 'Open'
      }
    ],
    notes: [
      {
        id: 'note002',
        title: 'Review Dokumen',
        content: 'Dokumen keuangan cukup lengkap dan terorganisir',
        author: 'Budi Santoso',
        createdAt: new Date('2024-02-06')
      }
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  }
];

// Sample work papers data
const sampleWorkPapers = [
  {
    auditId: 'audit1',
    title: 'Kertas Kerja Pengujian Saldo Kas',
    description: 'Pengujian saldo kas dan setara kas Dinas Pendidikan',
    type: 'Pengujian Substantif',
    status: 'Selesai',
    assignedTo: 'Sri Wahyuni',
    dueDate: new Date('2024-01-20'),
    findings: 'Tidak ada temuan signifikan',
    recommendations: 'Saldo kas sudah sesuai dengan catatan akuntansi'
  },
  {
    auditId: 'audit1',
    title: 'Kertas Kerja Pengujian Piutang',
    description: 'Pengujian piutang usaha dan piutang lainnya',
    type: 'Pengujian Substantif',
    status: 'Dalam Proses',
    assignedTo: 'Ahmad Rahman',
    dueDate: new Date('2024-01-25'),
    findings: '',
    recommendations: ''
  }
];

// Sample audit evidence data
const sampleEvidence = [
  {
    auditId: 'audit1',
    title: 'Bukti Saldo Kas',
    description: 'Konfirmasi saldo kas dari bank',
    type: 'Konfirmasi',
    fileUrl: 'https://example.com/evidence1.pdf',
    uploadedBy: 'Sri Wahyuni',
    uploadedAt: new Date('2024-01-15'),
    verified: true
  },
  {
    auditId: 'audit1',
    title: 'Bukti Penerimaan Kas',
    description: 'Bukti penerimaan kas dari berbagai sumber',
    type: 'Dokumen',
    fileUrl: 'https://example.com/evidence2.pdf',
    uploadedBy: 'Ahmad Rahman',
    uploadedAt: new Date('2024-01-16'),
    verified: false
  }
];

// Sample audit notes data
const sampleNotes = [
  {
    auditId: 'audit1',
    title: 'Catatan Rapat Pembukaan',
    content: 'Rapat pembukaan audit dilaksanakan pada tanggal 15 Januari 2024 dengan dihadiri oleh Kepala Dinas Pendidikan dan tim audit.',
    author: 'Sri Wahyuni',
    category: 'Rapat',
    priority: 'Normal'
  },
  {
    auditId: 'audit1',
    title: 'Catatan Pengujian Saldo Kas',
    content: 'Pengujian saldo kas dilakukan dengan membandingkan saldo buku dengan saldo bank. Hasil pengujian menunjukkan saldo sudah sesuai.',
    author: 'Ahmad Rahman',
    category: 'Pengujian',
    priority: 'Tinggi'
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



export const seedWorkPapers = async () => {
  try {
    const existingDocs = await getDocs(collection(db, 'work_papers'));
    if (existingDocs.empty) {
      for (const workPaper of sampleWorkPapers) {
        await addDoc(collection(db, 'work_papers'), {
          ...workPaper,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log('Work papers seeded successfully');
    } else {
      console.log('Work papers already exist, skipping...');
    }
  } catch (error) {
    console.error('Error seeding work papers:', error);
  }
};

export const seedEvidence = async () => {
  try {
    const existingDocs = await getDocs(collection(db, 'audit_evidence'));
    if (existingDocs.empty) {
      for (const evidence of sampleEvidence) {
        await addDoc(collection(db, 'audit_evidence'), {
          ...evidence,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log('Audit evidence seeded successfully');
    } else {
      console.log('Audit evidence already exist, skipping...');
    }
  } catch (error) {
    console.error('Error seeding audit evidence:', error);
  }
};

export const seedNotes = async () => {
  try {
    const existingDocs = await getDocs(collection(db, 'audit_notes'));
    if (existingDocs.empty) {
      for (const note of sampleNotes) {
        await addDoc(collection(db, 'audit_notes'), {
          ...note,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log('Audit notes seeded successfully');
    } else {
      console.log('Audit notes already exist, skipping...');
    }
  } catch (error) {
    console.error('Error seeding audit notes:', error);
  }
};

// Fungsi utama untuk seeding semua data
export const seedAllData = async () => {
  try {
    console.log('Starting data seeding...');
    
    // Seed users
    await seedUsers();
    
    // Seed extended audits
    await seedExtendedAudits();
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// New function to seed extended audit data
export const seedExtendedAudits = async () => {
  try {
    const auditsRef = collection(db, COLLECTIONS.AUDITS);
    
    for (const audit of sampleAuditsExtended) {
      await addDoc(auditsRef, {
        ...audit,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Extended audit data seeded successfully!');
  } catch (error) {
    console.error('Error seeding extended audit data:', error);
  }
};

// Fungsi untuk mengecek jumlah data di setiap collection
export const checkDataCount = async () => {
  try {
    const collections = [
      'users', 
      'audits', 
      'audit_findings', 
      'documents', 
      'work_papers',
      'audit_evidence',
      'audit_notes'
    ];
    
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
