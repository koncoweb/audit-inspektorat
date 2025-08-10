// Test script to verify Firestore rules
// Run this in the browser console to test the rules

const testAuditData = {
  title: 'Test Audit Plan',
  department: 'Test Department',
  type: 'Audit Keuangan',
  priority: 'Sedang',
  status: 'Draft',
  auditor: 'Test Auditor',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  period: '2024-01-01 s/d 2024-01-31',
  description: 'Test description',
  scope: 'Test scope',
  objectives: 'Test objectives',
  budget: 1000000,
  riskLevel: 'Medium',
  progress: 0,
  team: [],
  workPapers: [],
  evidence: [],
  notes: []
};

// Test function
async function testCreateAudit() {
  try {
    console.log('Testing audit creation with data:', testAuditData);
    const result = await addDoc(collection(db, 'audits'), {
      ...testAuditData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Audit created successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Error creating audit:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code
    });
    throw error;
  }
}

// Run the test
testCreateAudit();
