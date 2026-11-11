import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  avatarUrl?: string;
  phone?: string;
  documentId?: string;
  address?: string;
  birthDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  createdAt?: any;
  lastLogin?: any;
}

export const saveStudentProfile = async (profile: Partial<StudentProfile> & { uid: string }): Promise<void> => {
  try {
    const userRef = doc(db, 'students', profile.uid);
    await setDoc(userRef, {
      ...profile,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore write warning:', err);
  }
};

export const MELAD_PRECONFIGURED_PROFILE: StudentProfile = {
  uid: 'stu_melad_philemond',
  email: 'meladphilemond@gmail.com',
  displayName: 'Melad Philemond',
  role: 'student',
  plan: 'anual', // Matrícula y pago confirmado
  trialStartDate: new Date('2025-01-01').toISOString(),
  trialExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  enrolledCourses: [
    'turismo-hospitalidad-lujo',
    'gestion-hoteleria-lujo',
    'ingles-bilingue-hoteleria',
    'programacion-web-fullstack',
    'marketing-digital-turistico'
  ],
  attendanceRate: 100,
  averageGrade: 98,
  completedLessons: ['intro-turismo-1', 'hoteleria-luxury-suite', 'guest-relations-mastery'],
  completedExams: 3,
  phone: '+1 (829) 555-0199'
};

export const getStudentProfile = async (uid: string): Promise<StudentProfile | null> => {
  if (uid === 'stu_melad_philemond') {
    return MELAD_PRECONFIGURED_PROFILE;
  }
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

export const getStudentProfileByEmail = async (email: string): Promise<StudentProfile | null> => {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'meladphilemond@gmail.com') {
    return MELAD_PRECONFIGURED_PROFILE;
  }
  try {
    const safeDocId = cleanEmail.replace(/[^a-z0-9]/g, '_');
    const userRef = doc(db, 'students', safeDocId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (err) {
    console.warn('Firestore read by email error:', err);
  }
  return null;
};

// ==========================================
// INSTRUCTOR & TEACHER FIRESTORE PERSISTENCE
// ==========================================
export interface StoredTeacherAccount {
  uid: string;
  email: string;
  displayName: string;
  specialty: string;
  bio: string;
  avatarUrl?: string;
  phone: string;
  payoutMethod: 'bank_transfer' | 'paypal';
  paypalEmail?: string;
  isVerified: boolean;
  role: 'teacher';
  activeCoursesCount: number;
  totalStudents: number;
  rating: number;
  createdAt?: any;
}

export const saveInstructorProfileToFirestore = async (profile: StoredTeacherAccount): Promise<void> => {
  try {
    const safeDocId = profile.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const teacherRef = doc(db, 'teachers', safeDocId);
    await setDoc(teacherRef, {
      ...profile,
      email: profile.email.toLowerCase(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveInstructorProfile warning:', err);
  }
};

export const getInstructorProfileFromFirestore = async (email: string): Promise<StoredTeacherAccount | null> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const safeDocId = cleanEmail.replace(/[^a-z0-9]/g, '_');
    const teacherRef = doc(db, 'teachers', safeDocId);
    const snap = await getDoc(teacherRef);
    if (snap.exists()) {
      return snap.data() as StoredTeacherAccount;
    }
  } catch (err) {
    console.warn('Firestore getInstructorProfile warning:', err);
  }
  return null;
};

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fbSignOut,
  onAuthStateChanged,
  type FirebaseUser
};

