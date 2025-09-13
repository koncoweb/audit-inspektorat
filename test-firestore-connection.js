// Test script to verify Firestore connection and reports functionality
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Firebase config (you'll need to replace with your actual config)
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestoreConnection() {
  try {
    console.log('Testing Firestore connection...');
    
    // Test 1: Try to read from reports collection
    console.log('1. Testing read access to reports collection...');
    const reportsSnapshot = await getDocs(collection(db, 'reports'));
    console.log(`Found ${reportsSnapshot.size} existing reports`);
    
    // Test 2: Try to write to reports collection
    console.log('2. Testing write access to reports collection...');
    const testReport = {
      title: 'Test Report',
      type: 'Test',
      status: 'Draft',
      createdBy: 'Test User',
      totalAudits: 0,
      totalFindings: 0,
      period: 'Test Period',
      summary: 'Test summary',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'reports'), testReport);
    console.log('Test report created with ID:', docRef.id);
    
    // Test 3: Read the created report
    console.log('3. Verifying created report...');
    const newReportsSnapshot = await getDocs(collection(db, 'reports'));
    console.log(`Now found ${newReportsSnapshot.size} reports`);
    
    console.log('✅ All Firestore tests passed!');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

// Run the test
testFirestoreConnection();
