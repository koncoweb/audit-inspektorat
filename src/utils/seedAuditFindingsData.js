import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { COLLECTIONS, FINDING_SEVERITY, FINDING_STATUS, FINDING_CATEGORY } from '../constants/collections';

export const seedAuditFindingsData = async () => {
  try {
    console.log('Starting to seed audit findings data...');
    
    const findingsData = [
      // Temuan untuk Audit Keuangan Tahunan 2023 (sesuai gambar)
      {
        auditId: 'audit_keuangan_2023', // Document ID dari collection audits
        auditTitle: 'Audit Keuangan Tahunan 2023', // Sesuai dengan title di collection audits
        findingNumber: '001/OP/2023',
        title: 'Pencatatan Inventaris Tidak Akurat',
        description: 'Sistem pencatatan inventaris tidak akurat dan tidak terupdate secara rutin',
        category: 'Operasional',
        severity: 'Medium',
        status: 'Belum Selesai',
        recommendation: 'Perbaiki sistem pencatatan inventaris',
        responsiblePerson: 'Budi Santoso',
        priority: 'Tinggi',
        progress: '0',
        createdAt: new Date('2023-08-10T12:00:00.000Z').toISOString(),
        lastUpdated: new Date('2023-08-10T12:00:00.000Z').toISOString()
      },
      {
        auditId: 'audit_keuangan_2023',
        auditTitle: 'Audit Keuangan Tahunan 2023',
        findingNumber: '002/OP/2023',
        title: 'Dokumentasi Transaksi Tidak Lengkap',
        description: 'Beberapa transaksi keuangan tidak memiliki dokumentasi pendukung yang lengkap',
        category: 'Operasional',
        severity: 'Medium',
        status: 'Belum Selesai',
        recommendation: 'Perbaiki sistem dokumentasi dan pengawasan transaksi keuangan',
        responsiblePerson: 'Manager Keuangan',
        priority: 'Sedang',
        progress: '0',
        createdAt: new Date('2023-08-10T12:00:00.000Z').toISOString(),
        lastUpdated: new Date('2023-08-10T12:00:00.000Z').toISOString()
      },
      
      // Temuan untuk Audit Keuangan Tahunan 2024
      {
        auditId: 'audit_keuangan_2024',
        auditTitle: 'Audit Keuangan Tahunan 2024',
        findingNumber: 'F-001',
        title: 'Dokumentasi Transaksi Tidak Lengkap',
        description: 'Beberapa transaksi keuangan tidak memiliki dokumentasi pendukung yang lengkap',
        category: FINDING_CATEGORY.FINANCIAL,
        severity: FINDING_SEVERITY.MEDIUM,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Perbaiki sistem dokumentasi dan pengawasan transaksi keuangan',
        department: 'Keuangan',
        responsiblePerson: 'Manager Keuangan',
        dueDate: '2024-06-30',
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString()
      },
      {
        auditId: 'audit_keuangan_2024',
        auditTitle: 'Audit Keuangan Tahunan 2024',
        findingNumber: 'F-002',
        title: 'Sistem Pengawasan Internal Lemah',
        description: 'Sistem pengawasan internal untuk transaksi besar tidak berjalan efektif',
        category: FINDING_CATEGORY.FINANCIAL,
        severity: FINDING_SEVERITY.HIGH,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Perkuat sistem pengawasan internal dan implementasi approval matrix',
        department: 'Keuangan',
        responsiblePerson: 'Direktur Keuangan',
        dueDate: '2024-07-31',
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString()
      },
      
      // Temuan untuk Audit Kepatuhan SOP 2024
      {
        auditId: 'audit_kepatuhan_2024',
        auditTitle: 'Audit Kepatuhan SOP 2024',
        findingNumber: 'F-003',
        title: 'SOP Tidak Diikuti di Departemen Produksi',
        description: 'Beberapa prosedur standar operasional tidak diikuti dengan benar',
        category: FINDING_CATEGORY.COMPLIANCE,
        severity: FINDING_SEVERITY.MEDIUM,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Lakukan pelatihan dan sosialisasi SOP yang lebih intensif',
        department: 'Produksi',
        responsiblePerson: 'Manager Produksi',
        dueDate: '2024-05-31',
        createdAt: new Date('2024-04-01').toISOString(),
        updatedAt: new Date('2024-04-01').toISOString()
      },
      {
        auditId: 'audit_kepatuhan_2024',
        auditTitle: 'Audit Kepatuhan SOP 2024',
        findingNumber: 'F-004',
        title: 'Dokumentasi SOP Tidak Terupdate',
        description: 'Beberapa SOP sudah tidak sesuai dengan kondisi operasional saat ini',
        category: FINDING_CATEGORY.COMPLIANCE,
        severity: FINDING_SEVERITY.LOW,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Review dan update semua SOP yang sudah tidak relevan',
        department: 'Operasional',
        responsiblePerson: 'Manager Operasional',
        dueDate: '2024-06-30',
        createdAt: new Date('2024-04-01').toISOString(),
        updatedAt: new Date('2024-04-01').toISOString()
      },
      
      // Temuan untuk Audit Sistem IT 2024
      {
        auditId: 'audit_sistem_it_2024',
        auditTitle: 'Audit Sistem IT 2024',
        findingNumber: 'F-005',
        title: 'Celah Keamanan pada Sistem Database',
        description: 'Ditemukan beberapa celah keamanan pada sistem database yang perlu diperbaiki',
        category: FINDING_CATEGORY.SYSTEM,
        severity: FINDING_SEVERITY.HIGH,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Implementasi patch keamanan dan perkuat sistem firewall',
        department: 'IT',
        responsiblePerson: 'IT Security Manager',
        dueDate: '2024-05-15',
        createdAt: new Date('2024-05-01').toISOString(),
        updatedAt: new Date('2024-05-01').toISOString()
      },
      {
        auditId: 'audit_sistem_it_2024',
        auditTitle: 'Audit Sistem IT 2024',
        findingNumber: 'F-006',
        title: 'Backup Data Tidak Rutin',
        description: 'Proses backup data tidak dilakukan secara rutin dan terstruktur',
        category: FINDING_CATEGORY.SYSTEM,
        severity: FINDING_SEVERITY.MEDIUM,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Implementasi jadwal backup otomatis dan monitoring',
        department: 'IT',
        responsiblePerson: 'IT Infrastructure Manager',
        dueDate: '2024-06-30',
        createdAt: new Date('2024-05-01').toISOString(),
        updatedAt: new Date('2024-05-01').toISOString()
      },
      
      // Temuan untuk Audit Kinerja Operasional 2024
      {
        auditId: 'audit_kinerja_2024',
        auditTitle: 'Audit Kinerja Operasional 2024',
        findingNumber: 'F-007',
        title: 'Efisiensi Proses Produksi Rendah',
        description: 'Beberapa proses produksi masih kurang efisien dan memerlukan optimasi',
        category: FINDING_CATEGORY.PERFORMANCE,
        severity: FINDING_SEVERITY.MEDIUM,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Implementasi lean manufacturing dan optimasi proses',
        department: 'Produksi',
        responsiblePerson: 'Manager Produksi',
        dueDate: '2024-08-31',
        createdAt: new Date('2024-06-01').toISOString(),
        updatedAt: new Date('2024-06-01').toISOString()
      },
      
      // Temuan untuk Audit Operasional Gudang 2024
      {
        auditId: 'audit_gudang_2024',
        auditTitle: 'Audit Operasional Gudang 2024',
        findingNumber: 'F-008',
        title: 'Sistem Inventori Tidak Akurat',
        description: 'Sistem pencatatan inventori tidak akurat dan tidak terupdate secara real-time',
        category: FINDING_CATEGORY.OPERATIONAL,
        severity: FINDING_SEVERITY.MEDIUM,
        status: FINDING_STATUS.OPEN,
        recommendation: 'Implementasi sistem inventori yang terintegrasi dan real-time',
        department: 'Logistik',
        responsiblePerson: 'Manager Logistik',
        dueDate: '2024-09-30',
        createdAt: new Date('2024-07-01').toISOString(),
        updatedAt: new Date('2024-07-01').toISOString()
      }
    ];

    const findingsCollection = collection(db, COLLECTIONS.AUDIT_FINDINGS);
    
    for (const finding of findingsData) {
      await addDoc(findingsCollection, finding);
      console.log(`Added finding: ${finding.findingNumber} - ${finding.title}`);
    }
    
    console.log('Audit findings data seeded successfully!');
  } catch (error) {
    console.error('Error seeding audit findings data:', error);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.seedAuditFindingsData = seedAuditFindingsData;
}
