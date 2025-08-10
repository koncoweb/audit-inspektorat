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
  AUDIT_NOTES: 'audit_notes'
};

// User Management
export const userService = {
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
    const planningStatuses = ['Draft'];
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
      total: audits.filter(audit => ['Draft'].includes(audit.status)).length,
      draft: audits.filter(audit => audit.status === 'Draft').length,
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
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.REPORTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createReport(reportData) {
    return await addDoc(collection(db, COLLECTIONS.REPORTS), {
      ...reportData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
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
