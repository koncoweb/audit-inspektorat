import { reportService } from '../services/firebaseService';

// Sample reports data
const sampleReports = [
  {
    title: 'Laporan Audit Semester I 2024',
    type: 'Laporan Audit',
    status: 'Published',
    createdBy: 'Ahmad Rahman',
    totalAudits: 12,
    totalFindings: 45,
    period: 'Januari - Juni 2024',
    summary: '12 audit, 45 temuan',
    createdAt: new Date('2024-07-15')
  },
  {
    title: 'Laporan Kinerja Inspektorat 2024',
    type: 'Laporan Kinerja',
    status: 'Draft',
    createdBy: 'Sri Wahyuni',
    totalAudits: 24,
    totalFindings: 89,
    period: 'Januari - Desember 2024',
    summary: '24 audit, 89 temuan',
    createdAt: new Date('2024-01-10')
  },
  {
    title: 'Laporan Temuan Prioritas Tinggi',
    type: 'Laporan Temuan',
    status: 'Approved',
    createdBy: 'Budi Santoso',
    totalAudits: 8,
    totalFindings: 23,
    period: 'Q4 2023',
    summary: '8 audit, 23 temuan',
    createdAt: new Date('2024-01-05')
  },
  {
    title: 'Laporan Audit Tahunan 2023',
    type: 'Laporan Tahunan',
    status: 'Published',
    createdBy: 'Siti Nurhaliza',
    totalAudits: 18,
    totalFindings: 67,
    period: 'Januari - Desember 2023',
    summary: '18 audit, 67 temuan',
    createdAt: new Date('2023-12-31')
  },
  {
    title: 'Laporan Audit Kepatuhan Q3 2024',
    type: 'Laporan Audit',
    status: 'Draft',
    createdBy: 'Muhammad Yusuf',
    totalAudits: 6,
    totalFindings: 19,
    period: 'Juli - September 2024',
    summary: '6 audit, 19 temuan',
    createdAt: new Date('2024-10-01')
  }
];

export const seedReportData = async () => {
  try {
    console.log('Starting to seed report data...');
    
    for (const reportData of sampleReports) {
      await reportService.createReport(reportData);
      console.log(`Created report: ${reportData.title}`);
    }
    
    console.log('Successfully seeded report data!');
    return true;
  } catch (error) {
    console.error('Error seeding report data:', error);
    return false;
  }
};

// Function to run seeding from console
export const runSeedReports = async () => {
  const success = await seedReportData();
  if (success) {
    console.log('Report seeding completed successfully!');
  } else {
    console.log('Report seeding failed!');
  }
};

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.seedReportData = seedReportData;
  window.runSeedReports = runSeedReports;
}
