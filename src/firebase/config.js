import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChdKhIw5tBP8F5_AKpIYACU28pCLFSA58",
  authDomain: "rowyfire-e6c44.firebaseapp.com",
  projectId: "rowyfire-e6c44",
  storageBucket: "rowyfire-e6c44.appspot.com",
  messagingSenderId: "885825260324",
  appId: "1:885825260324:web:47f437217578d7633141b1",
  measurementId: "G-H30HXP32T1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
