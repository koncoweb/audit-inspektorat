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
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  AUDITS: 'audits',
  AUDIT_PLANS: 'audit_plans',
  AUDIT_FINDINGS: 'audit_findings',
  DOCUMENTS: 'documents',
  FOLLOW_UPS: 'follow_ups',
  REPORTS: 'reports'
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

  async updateUser(userId, userData) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return await updateDoc(docRef, userData);
  },

  async deleteUser(userId) {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return await deleteDoc(docRef);
  }
};

// Audit Management
export const auditService = {
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

  async createAudit(auditData) {
    return await addDoc(collection(db, COLLECTIONS.AUDITS), {
      ...auditData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
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
  }
};

// Audit Plans
export const auditPlanService = {
  async getAllPlans() {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.AUDIT_PLANS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async createPlan(planData) {
    return await addDoc(collection(db, COLLECTIONS.AUDIT_PLANS), {
      ...planData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updatePlan(planId, planData) {
    const docRef = doc(db, COLLECTIONS.AUDIT_PLANS, planId);
    return await updateDoc(docRef, {
      ...planData,
      updatedAt: new Date()
    });
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
