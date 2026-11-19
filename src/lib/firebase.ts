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
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App (kept for compatibility with any Firebase SDK references)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Helper with strict timeout so network calls NEVER hang the UI
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

export const MELAD_PRECONFIGURED_PROFILE: StudentProfile = {
  uid: 'stu_melad_philemond',
  email: 'meladphilemond@gmail.com',
  displayName: 'Melad Philemond',
  role: 'student',
  plan: 'anual',
  trialStartDate: new Date('2025-01-01').toISOString(),
  trialExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  enrolledCourses: [
    'turismo-hospitalidad-lujo',
    'gestion-hoteleria-lujo',
    'ingles-bilingue-caribe',
    'programacion-web-fullstack',
    'marketing-digital-turistico',
  ],
  attendanceRate: 100,
  averageGrade: 98,
  completedLessons: ['intro-turismo-1', 'hoteleria-luxury-suite', 'guest-relations-mastery'],
  completedExams: 3,
  phone: '+1 (829) 555-0199',
};

export const saveStudentProfile = async (
  profile: Partial<StudentProfile> & { uid: string }
): Promise<void> => {
  try {
    await fetchWithTimeout(
      `/api/students/${encodeURIComponent(profile.uid)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      },
      4000
    );
  } catch (err) {
    console.warn('Student profile sync warning:', err);
  }
};

export const getStudentProfile = async (uid: string): Promise<StudentProfile | null> => {
  if (uid === 'stu_melad_philemond') {
    return MELAD_PRECONFIGURED_PROFILE;
  }
  try {
    const res = await fetchWithTimeout(`/api/students/${encodeURIComponent(uid)}`, {}, 4000);
    if (res.ok) {
      const data = await res.json();
      if (data?.student) return data.student as StudentProfile;
    }
  } catch (err) {
    console.warn('Student profile fetch warning:', err);
  }
  return null;
};

export const getStudentProfileByEmail = async (email: string): Promise<StudentProfile | null> => {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'meladphilemond@gmail.com') {
    return MELAD_PRECONFIGURED_PROFILE;
  }
  try {
    const res = await fetchWithTimeout(`/api/students/${encodeURIComponent(cleanEmail)}`, {}, 4000);
    if (res.ok) {
      const data = await res.json();
      if (data?.student) return data.student as StudentProfile;
    }
  } catch (err) {
    console.warn('Student profile by email fetch warning:', err);
  }
  return null;
};

// ==========================================
// INSTRUCTOR & TEACHER CLOUD SQL PERSISTENCE
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

export const saveInstructorProfileToFirestore = async (
  profile: StoredTeacherAccount
): Promise<void> => {
  try {
    await fetchWithTimeout(
      '/api/teachers',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      },
      4000
    );
  } catch (err) {
    console.warn('Save instructor profile warning:', err);
  }
};

export const getInstructorProfileFromFirestore = async (
  email: string
): Promise<StoredTeacherAccount | null> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const res = await fetchWithTimeout(`/api/teachers/${encodeURIComponent(cleanEmail)}`, {}, 4000);
    if (res.ok) {
      const data = await res.json();
      if (data?.teacher) return data.teacher as StoredTeacherAccount;
    }
  } catch (err) {
    console.warn('Get instructor profile warning:', err);
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
  type FirebaseUser,
};
