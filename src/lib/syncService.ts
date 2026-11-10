import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  StudentTaskSubmission, 
  AbsenceJustification, 
  TeacherAnnouncement, 
  LiveTask, 
  LiveClassroomSession,
  ClassroomChatMessage 
} from '../types/instructor';
import {
  INITIAL_STUDENT_SUBMISSIONS,
  INITIAL_ABSENCE_JUSTIFICATIONS,
  INITIAL_TEACHER_ANNOUNCEMENTS
} from '../data/instructorData';

// Initial tasks seed - Real tasks are created by teachers from their studio
export const INITIAL_TASKS: LiveTask[] = [];

export const INITIAL_CLASSROOM_SESSION: LiveClassroomSession = {
  id: 'live_session_current',
  courseId: '',
  courseTitle: '',
  teacherName: 'Prof. Nardo Zorrilla',
  isLive: false,
  topicTitle: 'Clase Virtual en Vivo',
  viewerCount: 1,
  chatMessages: []
};

// Cross-tab communication channel
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('pca_live_sync');
  }
} catch {
  // BroadcastChannel not available
}

// Local storage helpers with fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`pca_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      if (key === 'tasks' && Array.isArray(parsed)) {
        return parsed.filter((t: any) => t && t.id !== 'task_001' && t.id !== 'task_002' && t.teacherName !== 'Lic. Adeyri Zorrilla' && !t.id?.startsWith('mock_')) as unknown as T;
      }
      if (key === 'submissions' && Array.isArray(parsed)) {
        return parsed.filter((s: any) => s && s.id !== 'sub_001' && s.id !== 'sub_002' && !s.id?.startsWith('mock_')) as unknown as T;
      }
      if (key === 'justifications' && Array.isArray(parsed)) {
        return parsed.filter((j: any) => j && j.id !== 'just_001' && j.id !== 'just_002' && !j.id?.startsWith('mock_')) as unknown as T;
      }
      if (key === 'announcements' && Array.isArray(parsed)) {
        return parsed.filter((a: any) => a && a.id !== 'anc_001' && a.id !== 'anc_002' && !a.id?.startsWith('mock_')) as unknown as T;
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`pca_${key}`, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Global in-memory subscribers
type Listener<T> = (data: T) => void;
const subscribers = {
  tasks: new Set<Listener<LiveTask[]>>(),
  submissions: new Set<Listener<StudentTaskSubmission[]>>(),
  justifications: new Set<Listener<AbsenceJustification[]>>(),
  announcements: new Set<Listener<TeacherAnnouncement[]>>(),
  classroom: new Set<Listener<LiveClassroomSession>>()
};

// Broadcast local event
function notifyChannel(type: string, payload: any) {
  if (channel) {
    try {
      channel.postMessage({ type, payload, timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
}

// Listen to cross-tab messages
if (channel) {
  channel.onmessage = (event) => {
    const { type, payload } = event.data || {};
    if (type === 'tasks' && Array.isArray(payload)) {
      setLocal('tasks', payload);
      subscribers.tasks.forEach(cb => cb(payload));
    } else if (type === 'submissions' && Array.isArray(payload)) {
      setLocal('submissions', payload);
      subscribers.submissions.forEach(cb => cb(payload));
    } else if (type === 'justifications' && Array.isArray(payload)) {
      setLocal('justifications', payload);
      subscribers.justifications.forEach(cb => cb(payload));
    } else if (type === 'announcements' && Array.isArray(payload)) {
      setLocal('announcements', payload);
      subscribers.announcements.forEach(cb => cb(payload));
    } else if (type === 'classroom' && payload) {
      setLocal('classroom', payload);
      subscribers.classroom.forEach(cb => cb(payload));
    }
  };
}

// ==========================================
// 1. TASKS SYNC
// ==========================================
export function subscribeToTasks(callback: (tasks: LiveTask[]) => void): () => void {
  subscribers.tasks.add(callback);
  
  // Deliver current local state immediately
  const current = getLocal<LiveTask[]>('tasks', INITIAL_TASKS);
  callback(current);

  // Bind Firestore real-time listener
  let unsubscribeFirestore = () => {};
  try {
    const colRef = collection(db, 'tasks');
    unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreTasks: LiveTask[] = [];
        snapshot.forEach(docSnap => {
          firestoreTasks.push({ id: docSnap.id, ...docSnap.data() } as LiveTask);
        });
        setLocal('tasks', firestoreTasks);
        callback(firestoreTasks);
      } else {
        // No default tasks seeded in production
      }
    }, (err) => {
      console.warn('Firestore tasks snapshot warning:', err.message);
    });
  } catch (e) {
    console.warn('Firestore tasks init warning:', e);
  }

  return () => {
    subscribers.tasks.delete(callback);
    unsubscribeFirestore();
  };
}

export async function createLiveTask(taskData: Omit<LiveTask, 'id' | 'createdAt'>): Promise<LiveTask> {
  const newTask: LiveTask = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: 'Recién asignada'
  };

  const tasks = getLocal<LiveTask[]>('tasks', INITIAL_TASKS);
  const updated = [newTask, ...tasks];
  setLocal('tasks', updated);
  subscribers.tasks.forEach(cb => cb(updated));
  notifyChannel('tasks', updated);

  // Firestore background write
  try {
    await setDoc(doc(db, 'tasks', newTask.id), {
      ...newTask,
      createdAtIso: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore createLiveTask error:', err);
  }

  return newTask;
}

// ==========================================
// 2. SUBMISSIONS SYNC
// ==========================================
export function subscribeToSubmissions(callback: (subs: StudentTaskSubmission[]) => void): () => void {
  subscribers.submissions.add(callback);

  const current = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  callback(current);

  let unsubscribeFirestore = () => {};
  try {
    const colRef = collection(db, 'submissions');
    unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreSubs: StudentTaskSubmission[] = [];
        snapshot.forEach(docSnap => {
          firestoreSubs.push({ id: docSnap.id, ...docSnap.data() } as StudentTaskSubmission);
        });
        setLocal('submissions', firestoreSubs);
        callback(firestoreSubs);
      } else {
        INITIAL_STUDENT_SUBMISSIONS.forEach(async (s) => {
          try {
            await setDoc(doc(db, 'submissions', s.id), s, { merge: true });
          } catch {
            // ignore
          }
        });
      }
    }, (err) => {
      console.warn('Firestore submissions snapshot warning:', err.message);
    });
  } catch (e) {
    console.warn('Firestore submissions init warning:', e);
  }

  return () => {
    subscribers.submissions.delete(callback);
    unsubscribeFirestore();
  };
}

export async function submitStudentTask(data: {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  courseId: string;
  courseTitle: string;
  topicId: string;
  topicTitle: string;
  submissionText: string;
  attachmentName?: string;
}): Promise<StudentTaskSubmission> {
  const newSubmission: StudentTaskSubmission = {
    ...data,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    submittedAt: 'Hoy, hace un momento',
    status: 'pending'
  };

  const subs = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  const updated = [newSubmission, ...subs];
  setLocal('submissions', updated);
  subscribers.submissions.forEach(cb => cb(updated));
  notifyChannel('submissions', updated);

  try {
    await setDoc(doc(db, 'submissions', newSubmission.id), {
      ...newSubmission,
      createdAtIso: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore submitStudentTask error:', err);
  }

  return newSubmission;
}

export async function gradeStudentSubmission(submissionId: string, grade: number, feedback: string): Promise<void> {
  const subs = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  const nowStr = 'Hoy a las ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updated = subs.map(s => {
    if (s.id === submissionId) {
      return {
        ...s,
        grade,
        teacherFeedback: feedback,
        gradedAt: nowStr,
        status: (grade < 70 ? 'needs_revision' : 'graded') as 'graded' | 'needs_revision'
      };
    }
    return s;
  });

  setLocal('submissions', updated);
  subscribers.submissions.forEach(cb => cb(updated));
  notifyChannel('submissions', updated);

  try {
    await updateDoc(doc(db, 'submissions', submissionId), {
      grade,
      teacherFeedback: feedback,
      gradedAt: nowStr,
      status: grade < 70 ? 'needs_revision' : 'graded',
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore gradeStudentSubmission error:', err);
  }
}

// ==========================================
// 3. ABSENCE JUSTIFICATIONS SYNC
// ==========================================
export function subscribeToJustifications(callback: (justs: AbsenceJustification[]) => void): () => void {
  subscribers.justifications.add(callback);

  const current = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  callback(current);

  let unsubscribeFirestore = () => {};
  try {
    const colRef = collection(db, 'justifications');
    unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreJusts: AbsenceJustification[] = [];
        snapshot.forEach(docSnap => {
          firestoreJusts.push({ id: docSnap.id, ...docSnap.data() } as AbsenceJustification);
        });
        setLocal('justifications', firestoreJusts);
        callback(firestoreJusts);
      } else {
        INITIAL_ABSENCE_JUSTIFICATIONS.forEach(async (j) => {
          try {
            await setDoc(doc(db, 'justifications', j.id), j, { merge: true });
          } catch {
            // ignore
          }
        });
      }
    }, (err) => {
      console.warn('Firestore justifications snapshot warning:', err.message);
    });
  } catch (e) {
    console.warn('Firestore justifications init warning:', e);
  }

  return () => {
    subscribers.justifications.delete(callback);
    unsubscribeFirestore();
  };
}

export async function submitStudentJustification(data: {
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  classDate: string;
  reason: string;
  documentProofName?: string;
}): Promise<AbsenceJustification> {
  const newJust: AbsenceJustification = {
    ...data,
    id: `just_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    status: 'pending',
    submittedAt: 'Hoy, hace un momento'
  };

  const justs = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  const updated = [newJust, ...justs];
  setLocal('justifications', updated);
  subscribers.justifications.forEach(cb => cb(updated));
  notifyChannel('justifications', updated);

  try {
    await setDoc(doc(db, 'justifications', newJust.id), {
      ...newJust,
      createdAtIso: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore submitStudentJustification error:', err);
  }

  return newJust;
}

export async function reviewStudentJustification(
  justificationId: string, 
  status: 'approved' | 'rejected', 
  teacherNotes: string
): Promise<void> {
  const justs = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  const updated = justs.map(j => {
    if (j.id === justificationId) {
      return {
        ...j,
        status,
        teacherNotes: teacherNotes || (status === 'approved' ? 'Justificante aceptado por el docente.' : 'Justificante rechazado por falta de sustento.')
      };
    }
    return j;
  });

  setLocal('justifications', updated);
  subscribers.justifications.forEach(cb => cb(updated));
  notifyChannel('justifications', updated);

  try {
    await updateDoc(doc(db, 'justifications', justificationId), {
      status,
      teacherNotes,
      reviewedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore reviewStudentJustification error:', err);
  }
}

// ==========================================
// 4. ANNOUNCEMENTS SYNC
// ==========================================
export function subscribeToAnnouncements(callback: (anns: TeacherAnnouncement[]) => void): () => void {
  subscribers.announcements.add(callback);

  const current = getLocal<TeacherAnnouncement[]>('announcements', INITIAL_TEACHER_ANNOUNCEMENTS);
  callback(current);

  let unsubscribeFirestore = () => {};
  try {
    const colRef = collection(db, 'announcements');
    unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreAnns: TeacherAnnouncement[] = [];
        snapshot.forEach(docSnap => {
          firestoreAnns.push({ id: docSnap.id, ...docSnap.data() } as TeacherAnnouncement);
        });
        setLocal('announcements', firestoreAnns);
        callback(firestoreAnns);
      } else {
        INITIAL_TEACHER_ANNOUNCEMENTS.forEach(async (a) => {
          try {
            await setDoc(doc(db, 'announcements', a.id), a, { merge: true });
          } catch {
            // ignore
          }
        });
      }
    }, (err) => {
      console.warn('Firestore announcements snapshot warning:', err.message);
    });
  } catch (e) {
    console.warn('Firestore announcements init warning:', e);
  }

  return () => {
    subscribers.announcements.delete(callback);
    unsubscribeFirestore();
  };
}

export async function createTeacherAnnouncement(data: {
  courseId: string;
  courseTitle: string;
  title: string;
  content: string;
  priority: 'normal' | 'urgent';
}): Promise<TeacherAnnouncement> {
  const newAnn: TeacherAnnouncement = {
    ...data,
    id: `anc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: 'Hoy a las ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    viewsCount: 1
  };

  const anns = getLocal<TeacherAnnouncement[]>('announcements', INITIAL_TEACHER_ANNOUNCEMENTS);
  const updated = [newAnn, ...anns];
  setLocal('announcements', updated);
  subscribers.announcements.forEach(cb => cb(updated));
  notifyChannel('announcements', updated);

  try {
    await setDoc(doc(db, 'announcements', newAnn.id), {
      ...newAnn,
      createdAtIso: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore createTeacherAnnouncement error:', err);
  }

  return newAnn;
}

// ==========================================
// 5. LIVE VIRTUAL CLASSROOM SYNC
// ==========================================
export function subscribeToClassroomSession(callback: (session: LiveClassroomSession) => void): () => void {
  subscribers.classroom.add(callback);

  const current = getLocal<LiveClassroomSession>('classroom', INITIAL_CLASSROOM_SESSION);
  callback(current);

  let unsubscribeFirestore = () => {};
  try {
    const sessionDocRef = doc(db, 'classroom_sessions', 'live_session_current');
    unsubscribeFirestore = onSnapshot(sessionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const liveData = { id: docSnap.id, ...docSnap.data() } as LiveClassroomSession;
        setLocal('classroom', liveData);
        callback(liveData);
      } else {
        setDoc(sessionDocRef, INITIAL_CLASSROOM_SESSION, { merge: true }).catch(() => {});
      }
    }, (err) => {
      console.warn('Firestore classroom snapshot warning:', err.message);
    });
  } catch (e) {
    console.warn('Firestore classroom init warning:', e);
  }

  return () => {
    subscribers.classroom.delete(callback);
    unsubscribeFirestore();
  };
}

export async function updateClassroomSession(updates: Partial<LiveClassroomSession>): Promise<void> {
  const current = getLocal<LiveClassroomSession>('classroom', INITIAL_CLASSROOM_SESSION);
  const updated: LiveClassroomSession = {
    ...current,
    ...updates
  };

  setLocal('classroom', updated);
  subscribers.classroom.forEach(cb => cb(updated));
  notifyChannel('classroom', updated);

  try {
    await setDoc(doc(db, 'classroom_sessions', 'live_session_current'), {
      ...updated,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore updateClassroomSession error:', err);
  }
}

export async function sendClassroomChatMessage(data: {
  sender: string;
  role: 'teacher' | 'student';
  text: string;
}): Promise<void> {
  const current = getLocal<LiveClassroomSession>('classroom', INITIAL_CLASSROOM_SESSION);
  const newMsg: ClassroomChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    sender: data.sender,
    role: data.role,
    text: data.text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updatedChat = [...(current.chatMessages || []), newMsg];
  await updateClassroomSession({ chatMessages: updatedChat });
}
