// Test commands untuk browser console:

// 1. Verify data structure (termasuk auditId)
import('./src/utils/debugFindings.js').then(module => module.verifyDataStructure());

// 2. Test complete flow
import('./src/utils/debugFindings.js').then(module => module.testAuditFindingsFlow());

// 3. Create fresh test data (dengan auditId)
import('./src/utils/debugFindings.js').then(module => module.createTestData());

// 4. Check specific audit findings
import('./src/utils/debugFindings.js').then(module => module.checkFindingsForAudit('Audit Keuangan Tahunan 2023'));

// 5. Check data consistency (auditId vs auditTitle)
import('./src/utils/debugFindings.js').then(module => module.checkDataConsistency());

// 6. Test auditId search (document ID)
import('./src/utils/debugFindings.js').then(module => {
  module.debugFindings().then(findings => {
    const auditIdFindings = findings.filter(f => f.auditId === 'audit_keuangan_2023');
    console.log('Findings by auditId (document ID):', auditIdFindings);
  });
});

// 7. Test auditId vs auditTitle consistency (document ID)
import('./src/utils/debugFindings.js').then(module => {
  Promise.all([module.debugAudits(), module.debugFindings()]).then(([audits, findings]) => {
    findings.forEach(finding => {
      const audit = audits.find(a => a.id === finding.auditId);
      if (audit && audit.title !== finding.auditTitle) {
        console.log(`❌ Inconsistency: Finding "${finding.title}" has auditTitle "${finding.auditTitle}" but audit has title "${audit.title}"`);
      }
    });
  });
});

// 8. Ensure document ID consistency (NEW)
import('./src/utils/debugFindings.js').then(module => module.ensureDocumentIdConsistency());
