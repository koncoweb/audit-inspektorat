import { db } from '../firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { COLLECTIONS, AUDIT_STATUS, AUDIT_PRIORITY, AUDIT_TYPE } from '../constants/collections';

export const seedAuditData = async () => {
  try {
    console.log('Starting to seed audit data...');
    
    const auditData = [
      {
        id: 'audit_keuangan_2023', // Tambah ID yang unik
        title: 'Audit Keuangan Tahunan 2023',
        description: 'Audit keuangan tahunan untuk periode 2023',
        type: AUDIT_TYPE.FINANCIAL,
        priority: AUDIT_PRIORITY.HIGH,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2023-06-01',
        endDate: '2023-08-10',
        auditor: 'Tim Audit Internal',
        department: 'Keuangan',
        objectives: 'Memastikan laporan keuangan disajikan secara wajar',
        scope: 'Seluruh transaksi keuangan tahun 2023',
        findings: 'Ditemukan beberapa temuan terkait pencatatan inventaris dan dokumentasi',
        recommendations: 'Perbaikan sistem pencatatan inventaris dan dokumentasi transaksi',
        createdAt: new Date('2023-06-01').toISOString(),
        updatedAt: new Date('2023-08-10').toISOString()
      },
      {
        id: 'audit_keuangan_2024',
        title: 'Audit Keuangan Tahunan 2024',
        description: 'Audit keuangan tahunan untuk periode 2024',
        type: AUDIT_TYPE.FINANCIAL,
        priority: AUDIT_PRIORITY.HIGH,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        auditor: 'Tim Audit Internal',
        department: 'Keuangan',
        objectives: 'Memastikan laporan keuangan disajikan secara wajar',
        scope: 'Seluruh transaksi keuangan tahun 2024',
        findings: 'Ditemukan beberapa temuan minor terkait dokumentasi',
        recommendations: 'Perbaikan sistem dokumentasi dan pengawasan',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString()
      },
      {
        id: 'audit_kepatuhan_2024',
        title: 'Audit Kepatuhan SOP 2024',
        description: 'Audit kepatuhan terhadap Standard Operating Procedures',
        type: AUDIT_TYPE.COMPLIANCE,
        priority: AUDIT_PRIORITY.MEDIUM,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2024-02-01',
        endDate: '2024-04-01',
        auditor: 'Tim Audit Kepatuhan',
        department: 'Operasional',
        objectives: 'Memastikan kepatuhan terhadap SOP yang berlaku',
        scope: 'SOP di seluruh departemen',
        findings: 'Beberapa departemen belum sepenuhnya mengikuti SOP',
        recommendations: 'Pelatihan dan sosialisasi SOP yang lebih intensif',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-04-01').toISOString()
      },
      {
        id: 'audit_sistem_it_2024',
        title: 'Audit Sistem IT 2024',
        description: 'Audit sistem teknologi informasi dan keamanan data',
        type: AUDIT_TYPE.SYSTEM,
        priority: AUDIT_PRIORITY.HIGH,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2024-03-01',
        endDate: '2024-05-01',
        auditor: 'Tim Audit IT',
        department: 'IT',
        objectives: 'Memastikan keamanan dan efektivitas sistem IT',
        scope: 'Infrastruktur IT dan sistem aplikasi',
        findings: 'Ditemukan beberapa celah keamanan pada sistem',
        recommendations: 'Peningkatan keamanan sistem dan backup data',
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date('2024-05-01').toISOString()
      },
      {
        id: 'audit_kinerja_2024',
        title: 'Audit Kinerja Operasional 2024',
        description: 'Audit kinerja operasional dan efisiensi proses',
        type: AUDIT_TYPE.PERFORMANCE,
        priority: AUDIT_PRIORITY.MEDIUM,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2024-04-01',
        endDate: '2024-06-01',
        auditor: 'Tim Audit Kinerja',
        department: 'Produksi',
        objectives: 'Mengevaluasi efisiensi dan efektivitas operasional',
        scope: 'Proses produksi dan operasional',
        findings: 'Beberapa proses masih kurang efisien',
        recommendations: 'Optimasi proses dan pengurangan waste',
        createdAt: new Date('2024-04-01').toISOString(),
        updatedAt: new Date('2024-06-01').toISOString()
      },
      {
        id: 'audit_gudang_2024',
        title: 'Audit Operasional Gudang 2024',
        description: 'Audit operasional gudang dan manajemen inventori',
        type: AUDIT_TYPE.OPERATIONAL,
        priority: AUDIT_PRIORITY.LOW,
        status: AUDIT_STATUS.COMPLETED,
        startDate: '2024-05-01',
        endDate: '2024-07-01',
        auditor: 'Tim Audit Operasional',
        department: 'Logistik',
        objectives: 'Memastikan efektivitas manajemen gudang',
        scope: 'Operasional gudang dan inventori',
        findings: 'Sistem inventori perlu perbaikan',
        recommendations: 'Implementasi sistem inventori yang lebih baik',
        createdAt: new Date('2024-05-01').toISOString(),
        updatedAt: new Date('2024-07-01').toISOString()
      }
    ];

    const auditCollection = collection(db, COLLECTIONS.AUDITS);
    
    for (const audit of auditData) {
      // Gunakan ID yang sudah didefinisikan sebagai document ID
      if (audit.id) {
        const docRef = doc(db, COLLECTIONS.AUDITS, audit.id);
        // Hapus id dari data karena akan menjadi document ID
        const { id, ...auditDataWithoutId } = audit;
        await setDoc(docRef, auditDataWithoutId);
        console.log(`Added audit with document ID: ${audit.id} - ${audit.title}`);
      } else {
        const docRef = await addDoc(auditCollection, audit);
        console.log(`Added audit with auto-generated ID: ${docRef.id} - ${audit.title}`);
      }
    }
    
    console.log('Audit data seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding audit data:', error);
    return false;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.seedAuditData = seedAuditData;
}
