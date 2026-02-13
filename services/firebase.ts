import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAocB-xjAk8-xIIcDLjx72k9I8OK4jHVgE",
  authDomain: "tlord-1ab38.firebaseapp.com",
  databaseURL: "https://tlord-1ab38-default-rtdb.firebaseio.com",
  projectId: "tlord-1ab38",
  storageBucket: "tlord-1ab38.firebasestorage.app",
  messagingSenderId: "750743868519",
  appId: "1:750743868519:web:5a937bc8e75e86a96570c2",
  measurementId: "G-5MDEM4EWHJ"
};

// Singleton initialization to prevent multiple app instances and registry mismatches
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services immediately using the common app instance
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { auth, db, rtdb };