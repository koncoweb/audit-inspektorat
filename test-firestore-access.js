// Test script untuk memverifikasi akses Firestore
// Jalankan di browser console setelah login

// Test 1: Check if user exists in Firestore
async function testUserAccess() {
  try {
    const { userService } = await import('./src/services/firebaseService.js');
    const { auth } = await import('./src/firebase/config.js');
    
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser);
    
    if (currentUser) {
      const userData = await userService.ensureUserExists(currentUser);
      console.log('User data in Firestore:', userData);
      return userData;
    } else {
      console.log('No user logged in');
      return null;
    }
  } catch (error) {
    console.error('Error testing user access:', error);
    return null;
  }
}

// Test 2: Check audit plans access
async function testAuditPlansAccess() {
  try {
    const { auditPlanService } = await import('./src/services/firebaseService.js');
    
    console.log('Testing audit plans access...');
    const plans = await auditPlanService.getAllPlans();
    console.log('Audit plans:', plans);
    
    const stats = await auditPlanService.getPlanStats();
    console.log('Audit plan stats:', stats);
    
    return { plans, stats };
  } catch (error) {
    console.error('Error testing audit plans access:', error);
    return null;
  }
}

// Test 3: Create a test audit plan
async function testCreateAuditPlan() {
  try {
    const { auditPlanService } = await import('./src/services/firebaseService.js');
    
    const testPlan = {
      title: 'Test Audit Plan',
      department: 'Test Department',
      type: 'Audit Keuangan',
      priority: 'Sedang',
      status: 'Draft',
      auditor: 'Test Auditor',
      period: '2024-01-01 s/d 2024-01-31',
      description: 'Test audit plan for testing purposes',
      scope: 'Test scope',
      objectives: 'Test objectives',
      budget: 1000000,
      riskLevel: 'Medium'
    };
    
    console.log('Creating test audit plan...');
    const result = await auditPlanService.createPlan(testPlan);
    console.log('Test audit plan created:', result);
    
    return result;
  } catch (error) {
    console.error('Error creating test audit plan:', error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Firestore Access Tests ===');
  
  console.log('\n1. Testing user access...');
  const userData = await testUserAccess();
  
  console.log('\n2. Testing audit plans access...');
  const auditData = await testAuditPlansAccess();
  
  console.log('\n3. Testing audit plan creation...');
  const createResult = await testCreateAuditPlan();
  
  console.log('\n=== Test Results ===');
  console.log('User access:', userData ? 'SUCCESS' : 'FAILED');
  console.log('Audit plans access:', auditData ? 'SUCCESS' : 'FAILED');
  console.log('Audit plan creation:', createResult ? 'SUCCESS' : 'FAILED');
  
  return {
    userData,
    auditData,
    createResult
  };
}

// Export for use in browser console
window.testFirestoreAccess = {
  testUserAccess,
  testAuditPlansAccess,
  testCreateAuditPlan,
  runAllTests
};

console.log('Firestore test functions loaded. Use:');
console.log('- testFirestoreAccess.runAllTests() to run all tests');
console.log('- testFirestoreAccess.testUserAccess() to test user access');
console.log('- testFirestoreAccess.testAuditPlansAccess() to test audit plans access');
console.log('- testFirestoreAccess.testCreateAuditPlan() to test creating audit plans');
