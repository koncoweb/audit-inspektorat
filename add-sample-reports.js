// Script to add sample reports to Firestore
// Run this in browser console after navigating to /laporan page

async function addSampleReports() {
  try {
    console.log('🚀 Adding sample reports to database...');
    
    // Check if debugReports is available
    if (!window.debugReports) {
      console.error('❌ debugReports not available. Please navigate to /laporan page first.');
      return;
    }
    
    // Test connection first
    console.log('1. Testing connection...');
    const existingReports = await window.debugReports.testConnection();
    if (existingReports === null) {
      console.error('❌ Cannot connect to Firestore');
      return;
    }
    
    console.log(`Found ${existingReports.length} existing reports`);
    
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
        summary: '12 audit, 45 temuan'
      },
      {
        title: 'Laporan Kinerja Inspektorat 2024',
        type: 'Laporan Kinerja',
        status: 'Draft',
        createdBy: 'Sri Wahyuni',
        totalAudits: 24,
        totalFindings: 89,
        period: 'Januari - Desember 2024',
        summary: '24 audit, 89 temuan'
      },
      {
        title: 'Laporan Temuan Prioritas Tinggi',
        type: 'Laporan Temuan',
        status: 'Approved',
        createdBy: 'Budi Santoso',
        totalAudits: 8,
        totalFindings: 23,
        period: 'Q4 2023',
        summary: '8 audit, 23 temuan'
      }
    ];
    
    // Add each sample report
    console.log('2. Adding sample reports...');
    for (let i = 0; i < sampleReports.length; i++) {
      const report = sampleReports[i];
      console.log(`Adding report ${i + 1}/${sampleReports.length}: ${report.title}`);
      
      try {
        const result = await window.debugReports.createTestReport();
        if (result) {
          console.log(`✅ Report ${i + 1} added successfully`);
        } else {
          console.log(`❌ Failed to add report ${i + 1}`);
        }
      } catch (error) {
        console.error(`❌ Error adding report ${i + 1}:`, error);
      }
    }
    
    // Refresh the reports list
    console.log('3. Refreshing reports list...');
    await window.debugReports.refreshReports();
    
    console.log('🎉 Sample reports addition completed!');
    
  } catch (error) {
    console.error('❌ Error adding sample reports:', error);
  }
}

// Make function available globally
window.addSampleReports = addSampleReports;

console.log('📋 Sample reports script loaded! Run addSampleReports() to add sample data.');
