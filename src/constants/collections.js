// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  AUDITS: 'audits',
  AUDIT_PLANS: 'audit_plans',
  WORK_PAPERS: 'work_papers',
  AUDIT_EVIDENCE: 'audit_evidence',
  AUDIT_NOTES: 'audit_notes',
  AUDIT_FINDINGS: 'audit_findings',
  DOCUMENTS: 'documents',
  FOLLOW_UPS: 'follow_ups',
  REPORTS: 'reports'
};

// Audit Status Constants
export const AUDIT_STATUS = {
  DRAFT: 'Draft',
  APPROVED: 'Disetujui',
  ONGOING: 'Berlangsung',
  IN_PROGRESS: 'Dalam Proses',
  REVIEW: 'Review',
  FINALIZATION: 'Finalisasi',
  COMPLETED: 'Selesai'
};

// Audit Priority Constants
export const AUDIT_PRIORITY = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi'
};

// Audit Risk Level Constants
export const AUDIT_RISK_LEVEL = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi'
};

// Audit Type Constants
export const AUDIT_TYPE = {
  FINANCIAL: 'Audit Keuangan',
  PERFORMANCE: 'Audit Kinerja',
  COMPLIANCE: 'Audit Kepatuhan',
  OPERATIONAL: 'Audit Operasional',
  SYSTEM: 'Audit Sistem'
};

// Work Paper Status Constants
export const WORK_PAPER_STATUS = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'Dalam Proses',
  COMPLETED: 'Selesai',
  REVIEW: 'Review'
};

// Evidence Type Constants
export const EVIDENCE_TYPE = {
  DOCUMENT: 'Dokumen',
  CONFIRMATION: 'Konfirmasi',
  PHOTO: 'Foto',
  VIDEO: 'Video',
  OTHER: 'Lainnya'
};

// Finding Severity Constants
export const FINDING_SEVERITY = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi'
};

// User Role Constants
export const USER_ROLE = {
  ADMINISTRATOR: 'Administrator',
  AUDITOR: 'Auditor',
  SUPERVISOR: 'Supervisor'
};
