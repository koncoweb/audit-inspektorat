// Test script to run in browser console
// Copy and paste this code into browser console to test reports functionality

async function testReportsInBrowser() {
  try {
    console.log('🧪 Testing reports functionality in browser...');
    
    // Test 1: Check if reportService is available
    console.log('1. Checking reportService availability...');
    if (typeof window.reportService === 'undefined') {
      console.log('❌ reportService not available on window object');
      console.log('Available services:', Object.keys(window).filter(key => key.includes('Service')));
      return;
    }
    console.log('✅ reportService is available');
    
    // Test 2: Try to create a test report
    console.log('2. Creating test report...');
    const testReportData = {
      title: 'Test Report - Browser Test',
      type: 'Laporan Test',
      status: 'Draft',
      createdBy: 'Browser Test',
      totalAudits: 1,
      totalFindings: 2,
      period: 'Test Period',
      summary: '1 audit, 2 temuan',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating report with data:', testReportData);
    const result = await window.reportService.createReport(testReportData);
    console.log('✅ Report created successfully:', result);
    
    // Test 3: Try to fetch all reports
    console.log('3. Fetching all reports...');
    const allReports = await window.reportService.getAllReports();
    console.log(`✅ Found ${allReports.length} reports:`, allReports.map(r => r.title));
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}

// Make the test function available globally
window.testReportsInBrowser = testReportsInBrowser;

console.log('📋 Test script loaded! Run testReportsInBrowser() to test reports functionality.');
