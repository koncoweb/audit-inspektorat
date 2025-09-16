import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  setDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut as signOutSecondary } from 'firebase/auth';
import { firebaseConfig } from '../firebase/config';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  AUDITS: 'audits',
  AUDIT_FINDINGS: 'audit_findings',
  DOCUMENTS: 'documents',
  FOLLOW_UPS: 'follow_ups',
  REPORTS: 'reports',
  WORK_PAPERS: 'work_papers',
  AUDIT_EVIDENCE: 'audit_evidence',
  AUDIT_NOTES: 'audit_notes',
  APP_SETTINGS: 'app_settings'
};

// User Management
export const userService = {
  // Create Auth user using a secondary Firebase app instance so current admin session remains active
  async createAuthUserWithSecondaryApp(email, password, profile) {
    // Reuse or init secondary app
    let secondaryApp = null;
    try {
      secondaryApp = initializeApp(firebaseConfig, 'secondary');
    } catch (e) {
      // If already exists, get it
      secondaryApp = window.firebaseApps?.secondary || null;
    }
    if (!secondaryApp) {
      // Fallback to grabbing from namespace if available
      try {
        // eslint-disable-next-line no-undef
        secondaryApp = window.firebase?.apps?.find?.(a => a.name === 'secondary');
      } catch (_) {}
    }
    // Ensure we have an app
    if (!secondaryApp) {
      secondaryApp = initializeApp(firebaseConfig, 'secondary');
    }

    const secondaryAuth = getAuth(secondaryApp);
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    if (profile?.name) {
      await updateProfile(cred.user, { displayName: profile.name });
    }

    // Sign out from secondary auth so it doesn't linger; primary admin session unaffected
    try { await signOutSecondary(secondaryAuth); } catch (_) {}
    return cred.user;
  },
  async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getUserById(userId) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async createUser(userData) {
    return await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async createUserWithId(userId, userData) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return await setDoc(docRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateUser(userId, userData) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date()
    });
  },

  async deleteUser(userId) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return await deleteDoc(docRef);
  },

  // Function to ensure user exists in Firestore
  async ensureUserExists(user) {
    if (!user || !user.uid) return null;
    
    try {
      // Check if user already exists
      const existingUser = await this.getUserById(user.uid);
      
      if (!existingUser) {
        // Create new user record
        const userData = {
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          role: 'Auditor', // Default role
          department: 'Inspektorat',
          phone: '',
          position: 'Auditor',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified || false
        };
        
        await this.createUserWithId(user.uid, userData);
        console.log('User record created in Firestore:', user.uid);
        return userData;
      }
      
      return existingUser;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      return null;
    }
  }
};

// Unified Audit Service (combines audit_plans and audits)
export const auditService = {
  // Get all audits regardless of status
  async getAllAudits() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.AUDITS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getAuditById(auditId) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async getRecentAudits(limitCount = 5) {
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get audits by status (supports both planning and execution statuses)
  async getAuditsByStatus(status) {
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      where('status', '==', status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get audits for planning page (Draft, Disetujui, Berlangsung, Selesai)
  async getPlanningAudits() {
    const planningStatuses = ['Draft', 'Disetujui', 'Berlangsung', 'Selesai'];
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      where('status', 'in', planningStatuses)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get audits for execution page (Disetujui, Berlangsung, Dalam Proses, Review, Finalisasi, Selesai)
  async getExecutionAudits() {
    const executionStatuses = ['Disetujui', 'Berlangsung', 'Dalam Proses', 'Review', 'Finalisasi', 'Selesai'];
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      where('status', 'in', executionStatuses)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get audits by priority
  async getAuditsByPriority(priority) {
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      where('priority', '==', priority)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get audits by department
  async getAuditsByDepartment(department) {
    const q = query(
      collection(db, COLLECTIONS.AUDITS),
      where('department', '==', department)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createAudit(auditData) {
    console.log('Creating audit with data:', auditData);
    const docData = {
      ...auditData,
      // File references fields
      workPapers: [],
      evidence: [],
      interviews: [],
      notes: [],
      // File counts
      workPapersCount: 0,
      evidenceCount: 0,
      interviewsCount: 0,
      notesCount: 0,
      // File status flags
      hasWorkPapers: false,
      hasEvidence: false,
      hasInterviews: false,
      hasNotes: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Final document data:', docData);
    return await addDoc(collection(db, COLLECTIONS.AUDITS), docData);
  },

  async updateAudit(auditId, auditData) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    return await updateDoc(docRef, {
      ...auditData,
      updatedAt: new Date()
    });
  },

  async deleteAudit(auditId) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    return await deleteDoc(docRef);
  },

  async updateAuditProgress(auditId, progress) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    return await updateDoc(docRef, {
      progress,
      updatedAt: new Date()
    });
  },

  async updateAuditStatus(auditId, status) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    return await updateDoc(docRef, {
      status,
      updatedAt: new Date()
    });
  },

  async addTeamMember(auditId, teamMember) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    const auditDoc = await getDoc(docRef);
    
    if (auditDoc.exists()) {
      const currentTeam = auditDoc.data().team || [];
      const updatedTeam = [...currentTeam, teamMember];
      
      return await updateDoc(docRef, {
        team: updatedTeam,
        updatedAt: new Date()
      });
    }
  },

  async removeTeamMember(auditId, memberId) {
    const docRef = doc(db, COLLECTIONS.AUDITS, auditId);
    const auditDoc = await getDoc(docRef);
    
    if (auditDoc.exists()) {
      const currentTeam = auditDoc.data().team || [];
      const updatedTeam = currentTeam.filter(member => member.id !== memberId);
      
      return await updateDoc(docRef, {
        team: updatedTeam,
        updatedAt: new Date()
      });
    }
  },

  // Get audit statistics for planning page
  async getPlanningStats() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.AUDITS));
    const audits = querySnapshot.docs.map(doc => doc.data());
    
    return {
      total: audits.length,
      draft: audits.filter(audit => audit.status === 'Draft').length,
      approved: audits.filter(audit => audit.status === 'Disetujui').length,
      ongoing: audits.filter(audit => audit.status === 'Berlangsung').length,
      completed: audits.filter(audit => audit.status === 'Selesai').length,
      highPriority: audits.filter(audit => audit.priority === 'Tinggi').length
    };
  },

  // Get audit statistics for execution page
  async getExecutionStats() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.AUDITS));
    const audits = querySnapshot.docs.map(doc => doc.data());
    
    return {
      total: audits.filter(audit => ['Disetujui', 'Berlangsung', 'Dalam Proses', 'Review', 'Finalisasi', 'Selesai'].includes(audit.status)).length,
      approved: audits.filter(audit => audit.status === 'Disetujui').length,
      ongoing: audits.filter(audit => audit.status === 'Berlangsung').length,
      inProgress: audits.filter(audit => audit.status === 'Dalam Proses').length,
      review: audits.filter(audit => audit.status === 'Review').length,
      finalization: audits.filter(audit => audit.status === 'Finalisasi').length,
      completed: audits.filter(audit => audit.status === 'Selesai').length
    };
  }
};

// Audit Findings
export const findingService = {
  async getAllFindings() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.AUDIT_FINDINGS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getFindingsByAuditId(auditId) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_FINDINGS),
      where('auditId', '==', auditId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getFindingsByStatus(status) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_FINDINGS),
      where('status', '==', status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getFindingsBySeverity(severity) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_FINDINGS),
      where('severity', '==', severity)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getFindingsByCategory(category) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_FINDINGS),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createFinding(findingData) {
    return await addDoc(collection(db, COLLECTIONS.AUDIT_FINDINGS), {
      ...findingData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateFinding(findingId, findingData) {
    const docRef = doc(db, COLLECTIONS.AUDIT_FINDINGS, findingId);
    return await updateDoc(docRef, {
      ...findingData,
      updatedAt: new Date()
    });
  },

  async deleteFinding(findingId) {
    const docRef = doc(db, COLLECTIONS.AUDIT_FINDINGS, findingId);
    return await deleteDoc(docRef);
  },

  async getFindingById(findingId) {
    const docRef = doc(db, COLLECTIONS.AUDIT_FINDINGS, findingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }
};

// Documents
export const documentService = {
  async getAllDocuments() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getDocumentsByAuditId(auditId) {
    const q = query(
      collection(db, COLLECTIONS.DOCUMENTS),
      where('auditId', '==', auditId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createDocument(documentData) {
    return await addDoc(collection(db, COLLECTIONS.DOCUMENTS), {
      ...documentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Follow-ups
export const followUpService = {
  async getAllFollowUps() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.FOLLOW_UPS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getFollowUpsByFindingId(findingId) {
    const q = query(
      collection(db, COLLECTIONS.FOLLOW_UPS),
      where('findingId', '==', findingId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createFollowUp(followUpData) {
    return await addDoc(collection(db, COLLECTIONS.FOLLOW_UPS), {
      ...followUpData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Reports
export const reportService = {
  async getAllReports() {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getReportsByType(type) {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getReportsByStatus(status) {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getReportsByYear(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getReportById(reportId) {
    const docRef = doc(db, COLLECTIONS.REPORTS, reportId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async createReport(reportData) {
    return await addDoc(collection(db, COLLECTIONS.REPORTS), {
      ...reportData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateReport(reportId, reportData) {
    const docRef = doc(db, COLLECTIONS.REPORTS, reportId);
    return await updateDoc(docRef, {
      ...reportData,
      updatedAt: new Date()
    });
  },

  async deleteReport(reportId) {
    const docRef = doc(db, COLLECTIONS.REPORTS, reportId);
    return await deleteDoc(docRef);
  },

  // Generate report from audit data
  async generateReportFromAudits(auditIds, reportType, reportTitle, createdBy) {
    try {
      // Get audit data
      const audits = [];
      for (const auditId of auditIds) {
        const audit = await auditService.getAuditById(auditId);
        if (audit) {
          // Get findings for this audit
          const findings = await findingService.getFindingsByAuditId(auditId);
          audits.push({
            ...audit,
            findings: findings
          });
        }
      }

      // Calculate summary statistics
      const totalAudits = audits.length;
      const totalFindings = audits.reduce((sum, audit) => sum + audit.findings.length, 0);
      const completedAudits = audits.filter(audit => audit.status === 'Selesai').length;
      
      // Create report data
      const reportData = {
        title: reportTitle,
        type: reportType,
        status: 'Draft',
        createdBy: createdBy,
        auditIds: auditIds,
        totalAudits: totalAudits,
        totalFindings: totalFindings,
        completedAudits: completedAudits,
        period: this.generatePeriodString(audits),
        summary: this.generateReportSummary(audits),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.createReport(reportData);
    } catch (error) {
      console.error('Error generating report from audits:', error);
      throw error;
    }
  },

  generatePeriodString(audits) {
    if (audits.length === 0) return '';
    
    const dates = audits.map(audit => new Date(audit.startDate?.seconds * 1000 || audit.createdAt?.seconds * 1000)).filter(date => !isNaN(date));
    if (dates.length === 0) return '';
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    const formatDate = (date) => {
      return date.toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
    };
    
    if (minDate.getFullYear() === maxDate.getFullYear() && minDate.getMonth() === maxDate.getMonth()) {
      return formatDate(minDate);
    }
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  },

  generateReportSummary(audits) {
    const totalAudits = audits.length;
    const totalFindings = audits.reduce((sum, audit) => sum + audit.findings.length, 0);
    const completedAudits = audits.filter(audit => audit.status === 'Selesai').length;
    
    return `${totalAudits} audit, ${totalFindings} temuan`;
  }
};

// Dashboard Statistics
export const dashboardService = {
  async getDashboardStats() {
    try {
      const [audits, findings] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.AUDITS)),
        getDocs(collection(db, COLLECTIONS.AUDIT_FINDINGS))
      ]);

      const totalAudits = audits.size;
      const totalFindings = findings.size;

      // Count audits by status
      const completedAudits = audits.docs.filter(doc => 
        doc.data().status === 'Selesai'
      ).length;

      const inProgressAudits = audits.docs.filter(doc => 
        doc.data().status === 'Dalam Proses'
      ).length;

      return {
        totalAudits: totalAudits,
        totalFindings: totalFindings,
        completedAudits: completedAudits,
        inProgressAudits: inProgressAudits
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalAudits: 0,
        totalFindings: 0,
        completedAudits: 0,
        inProgressAudits: 0
      };
    }
  },

  // Report Statistics
  async getReportStats() {
    try {
      const [audits, findings, followUps] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.AUDITS)),
        getDocs(collection(db, COLLECTIONS.AUDIT_FINDINGS)),
        getDocs(collection(db, COLLECTIONS.FOLLOW_UPS))
      ]);

      const totalAudit = audits.size;
      const selesai = audits.docs.filter(doc => doc.data().status === 'Selesai').length;
      const totalTemuan = findings.size;
      const ditindaklanjuti = followUps.size;
      const prioritasTinggi = findings.docs.filter(doc => doc.data().severity === 'Tinggi').length;

      // Calculate average duration
      const completedAudits = audits.docs.filter(doc => doc.data().status === 'Selesai');
      let totalDuration = 0;
      let validAudits = 0;

      completedAudits.forEach(doc => {
        const audit = doc.data();
        if (audit.startDate && audit.endDate) {
          const start = new Date(audit.startDate.seconds * 1000);
          const end = new Date(audit.endDate.seconds * 1000);
          const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          totalDuration += duration;
          validAudits++;
        }
      });

      const rataRataDurasi = validAudits > 0 ? Math.round(totalDuration / validAudits) : 0;

      return {
        totalAudit,
        selesai,
        totalTemuan,
        ditindaklanjuti,
        prioritasTinggi,
        rataRataDurasi
      };
    } catch (error) {
      console.error('Error fetching report stats:', error);
      return {
        totalAudit: 0,
        selesai: 0,
        totalTemuan: 0,
        ditindaklanjuti: 0,
        prioritasTinggi: 0,
        rataRataDurasi: 0
      };
    }
  },

  // Get trend data for reports
  async getTrendData() {
    try {
      const [audits, findings] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.AUDITS)),
        getDocs(collection(db, COLLECTIONS.AUDIT_FINDINGS))
      ]);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const currentDate = new Date();
      
      return months.map((month, index) => {
        const monthIndex = currentDate.getMonth() - 5 + index;
        const year = currentDate.getFullYear();
        
        // Count audits and findings for this month
        const monthAudits = audits.docs.filter(doc => {
          const audit = doc.data();
          if (audit.createdAt) {
            const auditDate = new Date(audit.createdAt.seconds * 1000);
            return auditDate.getMonth() === monthIndex && auditDate.getFullYear() === year;
          }
          return false;
        }).length;

        const monthFindings = findings.docs.filter(doc => {
          const finding = doc.data();
          if (finding.createdAt) {
            const findingDate = new Date(finding.createdAt.seconds * 1000);
            return findingDate.getMonth() === monthIndex && findingDate.getFullYear() === year;
          }
          return false;
        }).length;

        return {
          month,
          audit: monthAudits,
          temuan: monthFindings
        };
      });
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return [];
    }
  }
};



// Work Papers Management
export const workPaperService = {
  async getWorkPapersByAuditId(auditId) {
    const q = query(
      collection(db, COLLECTIONS.WORK_PAPERS),
      where('auditId', '==', auditId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createWorkPaper(workPaperData) {
    return await addDoc(collection(db, COLLECTIONS.WORK_PAPERS), {
      ...workPaperData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateWorkPaper(workPaperId, workPaperData) {
    const docRef = doc(db, COLLECTIONS.WORK_PAPERS, workPaperId);
    return await updateDoc(docRef, {
      ...workPaperData,
      updatedAt: new Date()
    });
  },

  async deleteWorkPaper(workPaperId) {
    const docRef = doc(db, COLLECTIONS.WORK_PAPERS, workPaperId);
    return await deleteDoc(docRef);
  }
};

// Audit Evidence Management
export const evidenceService = {
  async getEvidenceByAuditId(auditId) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_EVIDENCE),
      where('auditId', '==', auditId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createEvidence(evidenceData) {
    return await addDoc(collection(db, COLLECTIONS.AUDIT_EVIDENCE), {
      ...evidenceData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateEvidence(evidenceId, evidenceData) {
    const docRef = doc(db, COLLECTIONS.AUDIT_EVIDENCE, evidenceId);
    return await updateDoc(docRef, {
      ...evidenceData,
      updatedAt: new Date()
    });
  },

  async deleteEvidence(evidenceId) {
    const docRef = doc(db, COLLECTIONS.AUDIT_EVIDENCE, evidenceId);
    return await deleteDoc(docRef);
  }
};

// Audit Notes Management
export const notesService = {
  async getNotesByAuditId(auditId) {
    const q = query(
      collection(db, COLLECTIONS.AUDIT_NOTES),
      where('auditId', '==', auditId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createNote(noteData) {
    return await addDoc(collection(db, COLLECTIONS.AUDIT_NOTES), {
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateNote(noteId, noteData) {
    const docRef = doc(db, COLLECTIONS.AUDIT_NOTES, noteId);
    return await updateDoc(docRef, {
      ...noteData,
      updatedAt: new Date()
    });
  },

  async deleteNote(noteId) {
    const docRef = doc(db, COLLECTIONS.AUDIT_NOTES, noteId);
    return await deleteDoc(docRef);
  }
};

// Extended audit data methods
export const auditDetailService = {
  // Get audit details with extended information
  async getAuditDetails(auditId) {
    try {
      const auditDoc = await getDoc(doc(db, COLLECTIONS.AUDITS, auditId));
      if (auditDoc.exists()) {
        const auditData = auditDoc.data();
        return {
          id: auditDoc.id,
          ...auditData,
          workPapers: auditData.workPapers || [],
          evidence: auditData.evidence || [],
          interviews: auditData.interviews || [],
          findings: auditData.findings || [],
          overallProgress: auditData.overallProgress || 0,
          currentStage: auditData.currentStage || 'Persiapan',
          stageProgress: auditData.stageProgress || 0
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting audit details:', error);
      throw error;
    }
  },

  // Update audit progress and stage
  async updateAuditProgress(auditId, progress, stage, stageProgress) {
    try {
      await updateDoc(doc(db, COLLECTIONS.AUDITS, auditId), {
        overallProgress: progress,
        currentStage: stage,
        stageProgress: stageProgress,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating audit progress:', error);
      throw error;
    }
  },

  // Add work paper
  async addWorkPaper(auditId, workPaper) {
    try {
      const auditRef = doc(db, COLLECTIONS.AUDITS, auditId);
      await updateDoc(auditRef, {
        workPapers: arrayUnion({
          id: Date.now().toString(),
          ...workPaper,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding work paper:', error);
      throw error;
    }
  },

  // Add evidence
  async addEvidence(auditId, evidence) {
    try {
      const auditRef = doc(db, COLLECTIONS.AUDITS, auditId);
      await updateDoc(auditRef, {
        evidence: arrayUnion({
          id: Date.now().toString(),
          ...evidence,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding evidence:', error);
      throw error;
    }
  },

  // Add interview
  async addInterview(auditId, interview) {
    try {
      const auditRef = doc(db, COLLECTIONS.AUDITS, auditId);
      await updateDoc(auditRef, {
        interviews: arrayUnion({
          id: Date.now().toString(),
          ...interview,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding interview:', error);
      throw error;
    }
  },

  // Add finding
  async addFinding(auditId, finding) {
    try {
      const auditRef = doc(db, COLLECTIONS.AUDITS, auditId);
      await updateDoc(auditRef, {
        findings: arrayUnion({
          id: Date.now().toString(),
          ...finding,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding finding:', error);
      throw error;
    }
  },

  // Get audit statistics
  async getAuditStatistics(auditId) {
    try {
      const auditDoc = await getDoc(doc(db, COLLECTIONS.AUDITS, auditId));
      if (auditDoc.exists()) {
        const auditData = auditDoc.data();
        return {
          workPapers: auditData.workPapers?.length || 0,
          evidence: auditData.evidence?.length || 0,
          interviews: auditData.interviews?.length || 0,
          findings: auditData.findings?.length || 0,
          overallProgress: auditData.overallProgress || 0,
          currentStage: auditData.currentStage || 'Persiapan',
          stageProgress: auditData.stageProgress || 0
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting audit statistics:', error);
      throw error;
    }
  }
};

// App Settings Management
export const appSettingsService = {
  async getAppSettings() {
    try {
      const docRef = doc(db, COLLECTIONS.APP_SETTINGS, 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting app settings:', error);
      throw error;
    }
  },

  async updateAppSettings(settings) {
    try {
      const docRef = doc(db, COLLECTIONS.APP_SETTINGS, 'main');
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
  },

  async createAppSettings(settings) {
    try {
      const docRef = doc(db, COLLECTIONS.APP_SETTINGS, 'main');
      await setDoc(docRef, {
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating app settings:', error);
      throw error;
    }
  }
};

// Unified Firebase Service for easy access
export const firebaseService = {
  // User management
  ...userService,
  
  // Audit management
  ...auditService,
  
  // Finding management
  ...findingService,
  
  // Document management
  ...documentService,
  
  // Follow-up management
  ...followUpService,
  
  // Report management
  ...reportService,
  
  // Dashboard statistics
  ...dashboardService,
  
  // Work paper management
  ...workPaperService,
  
  // Evidence management
  ...evidenceService,
  
  // Notes management
  ...notesService,
  
  // Audit detail management
  ...auditDetailService,
  
  // App settings management
  ...appSettingsService,
  
  // Specific methods for Temuan Audit page
  async getAuditFindings() {
    return await findingService.getAllFindings();
  },
  
  async createAuditFinding(findingData) {
    return await findingService.createFinding(findingData);
  },
  
  async updateAuditFinding(findingId, findingData) {
    return await findingService.updateFinding(findingId, findingData);
  },
  
  async deleteAuditFinding(findingId) {
    return await findingService.deleteFinding(findingId);
  }
};
