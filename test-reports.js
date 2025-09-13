// Test script for reports functionality
import { reportService } from './src/services/firebaseService.js';
import { seedReportData } from './src/utils/seedReportData.js';

async function testReports() {
  try {
    console.log('Testing reports functionality...');
    
    // Test 1: Seed sample data
    console.log('\n1. Seeding sample reports...');
    await seedReportData();
    
    // Test 2: Get all reports
    console.log('\n2. Fetching all reports...');
    const allReports = await reportService.getAllReports();
    console.log(`Found ${allReports.length} reports:`, allReports.map(r => r.title));
    
    // Test 3: Get reports by type
    console.log('\n3. Fetching reports by type (Laporan Audit)...');
    const auditReports = await reportService.getReportsByType('Laporan Audit');
    console.log(`Found ${auditReports.length} audit reports:`, auditReports.map(r => r.title));
    
    // Test 4: Get reports by status
    console.log('\n4. Fetching reports by status (Published)...');
    const publishedReports = await reportService.getReportsByStatus('Published');
    console.log(`Found ${publishedReports.length} published reports:`, publishedReports.map(r => r.title));
    
    // Test 5: Get reports by year
    console.log('\n5. Fetching reports by year (2024)...');
    const reports2024 = await reportService.getReportsByYear(2024);
    console.log(`Found ${reports2024.length} reports from 2024:`, reports2024.map(r => r.title));
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testReports();
