import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'instructor' | 'admin';
  plan: 'free_trial' | 'mensual' | 'anual' | 'corporativo';
  trialStartDate?: string;
  trialExpiresAt?: string;
  enrolledCourses: string[];
  attendanceRate: number;
  averageGrade: number;
  completedLessons: string[];
  completedExams: number;
  createdAt?: any;
  lastLogin?: any;
}

export const saveStudentProfile = async (profile: Partial<StudentProfile> & { uid: string }): Promise<void> => {
  try {
    // Non-blocking write to Firestore with 400ms timeout so UI never hangs
    const writePromise = (async () => {
      try {
        const userRef = doc(db, 'students', profile.uid);
        await setDoc(userRef, {
          ...profile,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore background write skipped:', e);
      }
    })();

    // Allow UI to proceed immediately
    await Promise.race([
      writePromise,
      new Promise((resolve) => setTimeout(resolve, 350))
    ]);
  } catch (err) {
    console.warn('Firestore write warning (local profile preserved):', err);
  }
};

export const getStudentProfile = async (uid: string): Promise<StudentProfile | null> => {
  try {
    const userRef = doc(db, 'students', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (err) {
    console.warn('Firestore read error:', err);
  }
  return null;
};

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  type FirebaseUser
};
