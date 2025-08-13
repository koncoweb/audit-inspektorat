import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/collections';

// Debug function to check all findings
export const debugFindings = async () => {
  try {
    console.log('=== DEBUG FINDINGS ===');
    
    // Check all findings in collection
    const allFindingsQuery = query(collection(db, COLLECTIONS.AUDIT_FINDINGS));
    const allFindingsSnapshot = await getDocs(allFindingsQuery);
    
    console.log('Total findings in collection:', allFindingsSnapshot.docs.length);
    
    const allFindings = allFindingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    });
    
    console.log('All findings:', allFindings);
    
    // Check findings by audit title
    const auditTitles = [
      'Audit Keuangan Tahunan 2024',
      'Audit Kepatuhan SOP 2024',
      'Audit Sistem IT 2024',
      'Audit Kinerja Operasional 2024',
      'Audit Operasional Gudang 2024'
    ];
    
    for (const auditTitle of auditTitles) {
      console.log(`\n--- Checking findings for: ${auditTitle} ---`);
      
      const findingsQuery = query(
        collection(db, COLLECTIONS.AUDIT_FINDINGS),
        where('auditTitle', '==', auditTitle)
      );
      
      const findingsSnapshot = await getDocs(findingsQuery);
      console.log(`Findings count for "${auditTitle}":`, findingsSnapshot.docs.length);
      
      const findings = findingsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('Findings:', findings);
    }
    
    return allFindings;
  } catch (error) {
    console.error('Error debugging findings:', error);
    return [];
  }
};

// Function to check if findings exist for specific audit
export const checkFindingsForAudit = async (auditTitle) => {
  try {
    console.log(`Checking findings for audit: ${auditTitle}`);
    
    const q = query(
      collection(db, COLLECTIONS.AUDIT_FINDINGS),
      where('auditTitle', '==', auditTitle)
    );
    
    const querySnapshot = await getDocs(q);
    const findings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${findings.length} findings for "${auditTitle}"`);
    console.log('Findings:', findings);
    
    return findings;
  } catch (error) {
    console.error('Error checking findings:', error);
    return [];
  }
};

// Function to check all audits
export const debugAudits = async () => {
  try {
    console.log('=== DEBUG AUDITS ===');
    
    const allAuditsQuery = query(collection(db, COLLECTIONS.AUDITS));
    const allAuditsSnapshot = await getDocs(allAuditsQuery);
    
    console.log('Total audits in collection:', allAuditsSnapshot.docs.length);
    
    const allAudits = allAuditsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    });
    
    console.log('All audits:', allAudits);
    
    return allAudits;
  } catch (error) {
    console.error('Error debugging audits:', error);
    return [];
  }
};

// Function to check data consistency between audits and findings
export const checkDataConsistency = async () => {
  try {
    console.log('=== CHECKING DATA CONSISTENCY ===');
    
    // Get all audits
    const audits = await debugAudits();
    
    // Get all findings
    const findings = await debugFindings();
    
    console.log('\n--- AUDIT TITLES ---');
    audits.forEach((audit, index) => {
      console.log(`${index + 1}. "${audit.title}"`);
    });
    
    console.log('\n--- FINDING AUDIT TITLES ---');
    findings.forEach((finding, index) => {
      console.log(`${index + 1}. "${finding.auditTitle}"`);
    });
    
    // Check for mismatches
    const auditTitles = audits.map(audit => audit.title);
    const findingAuditTitles = findings.map(finding => finding.auditTitle);
    
    console.log('\n--- POTENTIAL MISMATCHES ---');
    auditTitles.forEach(auditTitle => {
      const hasFindings = findingAuditTitles.includes(auditTitle);
      console.log(`Audit: "${auditTitle}" - Has findings: ${hasFindings}`);
    });
    
    findingAuditTitles.forEach(findingAuditTitle => {
      const hasAudit = auditTitles.includes(findingAuditTitle);
      console.log(`Finding audit: "${findingAuditTitle}" - Has audit: ${hasAudit}`);
    });
    
  } catch (error) {
    console.error('Error checking data consistency:', error);
  }
};

// Function to run all seed data
export const runAllSeedData = async () => {
  try {
    console.log('=== RUNNING ALL SEED DATA ===');
    
    // Import seed functions
    const { seedAuditData } = await import('./seedAuditData.js');
    const { seedAuditFindingsData } = await import('./seedAuditFindingsData.js');
    
    // Run seed data
    console.log('Seeding audit data...');
    await seedAuditData();
    
    console.log('Seeding findings data...');
    await seedAuditFindingsData();
    
    console.log('All seed data completed successfully!');
    
    // Check consistency after seeding
    await checkDataConsistency();
    
  } catch (error) {
    console.error('Error running seed data:', error);
  }
};

// Function to ensure audit and findings data are properly connected
export const ensureAuditFindingsData = async () => {
  try {
    console.log('=== ENSURING AUDIT FINDINGS DATA ===');
    const audits = await debugAudits();
    const findings = await debugFindings();
    
    if (audits.length === 0) {
      console.log('No audit data found, seeding audit data...');
      const { seedAuditData } = await import('./seedAuditData.js');
      await seedAuditData();
    }
    
    if (findings.length === 0) {
      console.log('No findings data found, seeding findings data...');
      const { seedAuditFindingsData } = await import('./seedAuditFindingsData.js');
      await seedAuditFindingsData();
    }
    
    await checkDataConsistency();
    console.log('Audit and findings data ensured successfully!');
  } catch (error) {
    console.error('Error ensuring audit findings data:', error);
  }
};

// Function to test the complete flow
export const testAuditFindingsFlow = async () => {
  try {
    console.log('=== TESTING AUDIT FINDINGS FLOW ===');
    
    // Ensure data exists
    await ensureAuditFindingsData();
    
    // Test with specific audit title
    const testAuditTitle = 'Audit Keuangan Tahunan 2023';
    console.log(`Testing flow with audit: "${testAuditTitle}"`);
    
    const findings = await checkFindingsForAudit(testAuditTitle);
    console.log(`Found ${findings.length} findings for "${testAuditTitle}"`);
    
    if (findings.length > 0) {
      console.log('Sample finding:', findings[0]);
      console.log('✅ Flow test successful!');
    } else {
      console.log('❌ No findings found for test audit');
    }
    
    return findings;
  } catch (error) {
    console.error('Error testing audit findings flow:', error);
    return [];
  }
};

// Function to manually create test data
export const createTestData = async () => {
  try {
    console.log('=== CREATING FRESH TEST DATA ===');
    
    // Clear existing data (optional - be careful in production)
    console.log('Warning: This will create fresh test data');
    
    // Seed audit data
    const { seedAuditData } = await import('./seedAuditData.js');
    await seedAuditData();
    console.log('✅ Audit data created');
    
    // Seed findings data
    const { seedAuditFindingsData } = await import('./seedAuditFindingsData.js');
    await seedAuditFindingsData();
    console.log('✅ Findings data created');
    
    // Test the flow
    await testAuditFindingsFlow();
    console.log('✅ Test data creation completed');
  } catch (error) {
    console.error('Error creating test data:', error);
  }
};

// Function to verify data structure matches the image
export const verifyDataStructure = async () => {
  try {
    console.log('=== VERIFYING DATA STRUCTURE ===');
    
    const audits = await debugAudits();
    const findings = await debugFindings();
    
    console.log('📋 Audit Structure Check:');
    audits.forEach((audit, index) => {
      console.log(`${index + 1}. Document ID: "${audit.id}" | Title: "${audit.title}" | Status: "${audit.status}"`);
    });
    
    console.log('📋 Findings Structure Check:');
    findings.forEach((finding, index) => {
      console.log(`${index + 1}. AuditId (Document ID): "${finding.auditId}" | AuditTitle: "${finding.auditTitle}" | FindingNumber: "${finding.findingNumber}" | Title: "${finding.title}"`);
    });
    
    // Check for specific audit from image
    const targetAudit = 'Audit Keuangan Tahunan 2023';
    const targetFindings = findings.filter(f => f.auditTitle === targetAudit);
    
    console.log(`\n🎯 Specific Check for "${targetAudit}":`);
    console.log(`Found ${targetFindings.length} findings`);
    targetFindings.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.findingNumber} - ${finding.title} (${finding.severity}) - AuditId (Document ID): ${finding.auditId}`);
    });
    
    // Check data consistency
    console.log('\n🔍 Data Consistency Check:');
    const consistencyIssues = [];
    
    findings.forEach(finding => {
      const matchingAudit = audits.find(audit => audit.id === finding.auditId);
      if (!matchingAudit) {
        consistencyIssues.push(`Finding "${finding.title}" has auditId "${finding.auditId}" but no matching audit found`);
      } else if (matchingAudit.title !== finding.auditTitle) {
        consistencyIssues.push(`Finding "${finding.title}" has auditTitle "${finding.auditTitle}" but audit has title "${matchingAudit.title}"`);
      }
    });
    
    if (consistencyIssues.length === 0) {
      console.log('✅ All findings have consistent auditId and auditTitle');
    } else {
      console.log('❌ Found consistency issues:');
      consistencyIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    return { audits, findings, targetFindings, consistencyIssues };
  } catch (error) {
    console.error('Error verifying data structure:', error);
    return { audits: [], findings: [], targetFindings: [], consistencyIssues: [] };
  }
};

// Function to ensure data consistency with document IDs
export const ensureDocumentIdConsistency = async () => {
  try {
    console.log('=== ENSURING DOCUMENT ID CONSISTENCY ===');
    
    const audits = await debugAudits();
    const findings = await debugFindings();
    
    console.log('🔍 Checking audit document IDs:');
    audits.forEach(audit => {
      console.log(`  - Document ID: "${audit.id}" | Title: "${audit.title}"`);
    });
    
    console.log('🔍 Checking findings auditId references:');
    findings.forEach(finding => {
      const matchingAudit = audits.find(audit => audit.id === finding.auditId);
      if (matchingAudit) {
        console.log(`  ✅ Finding "${finding.title}" correctly references audit "${matchingAudit.title}" (ID: ${finding.auditId})`);
      } else {
        console.log(`  ❌ Finding "${finding.title}" has invalid auditId: "${finding.auditId}"`);
      }
    });
    
    // Check for orphaned findings (no matching audit)
    const orphanedFindings = findings.filter(finding => 
      !audits.find(audit => audit.id === finding.auditId)
    );
    
    if (orphanedFindings.length > 0) {
      console.log('⚠️ Orphaned findings (no matching audit):');
      orphanedFindings.forEach(finding => {
        console.log(`  - "${finding.title}" with auditId: "${finding.auditId}"`);
      });
    } else {
      console.log('✅ All findings have valid auditId references');
    }
    
    return { audits, findings, orphanedFindings };
  } catch (error) {
    console.error('Error ensuring document ID consistency:', error);
    return { audits: [], findings: [], orphanedFindings: [] };
  }
};

// Export for browser console
if (typeof window !== 'undefined') {
  window.debugFindings = debugFindings;
  window.checkFindingsForAudit = checkFindingsForAudit;
  window.debugAudits = debugAudits;
  window.checkDataConsistency = checkDataConsistency;
  window.runAllSeedData = runAllSeedData;
  window.ensureAuditFindingsData = ensureAuditFindingsData;
  window.testAuditFindingsFlow = testAuditFindingsFlow;
  window.createTestData = createTestData;
  window.verifyDataStructure = verifyDataStructure;
  window.ensureDocumentIdConsistency = ensureDocumentIdConsistency;
}
