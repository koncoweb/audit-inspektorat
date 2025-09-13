// Script to add sample reports directly to Firestore
// Run this in browser console after navigating to /laporan page

async function addSampleReportsDirect() {
  try {
    console.log('🚀 Adding sample reports directly to Firestore...');
    
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
    
    // Add sample data using the debug function
    console.log('2. Adding sample data...');
    await window.debugReports.addSampleData();
    
    // Show current state
    console.log('3. Showing current state...');
    window.debugReports.showAllData();
    
    console.log('🎉 Sample reports addition completed!');
    
  } catch (error) {
    console.error('❌ Error adding sample reports:', error);
  }
}

// Make function available globally
window.addSampleReportsDirect = addSampleReportsDirect;

console.log('📋 Direct sample reports script loaded! Run addSampleReportsDirect() to add sample data.');
