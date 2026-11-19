import {
  StudentTaskSubmission,
  AbsenceJustification,
  TeacherAnnouncement,
  LiveTask,
  LiveClassroomSession,
  ClassroomChatMessage,
} from '../types/instructor';
import {
  INITIAL_STUDENT_SUBMISSIONS,
  INITIAL_ABSENCE_JUSTIFICATIONS,
  INITIAL_TEACHER_ANNOUNCEMENTS,
} from '../data/instructorData';

export const INITIAL_TASKS: LiveTask[] = [];

export const INITIAL_CLASSROOM_SESSION: LiveClassroomSession = {
  id: 'live_session_current',
  courseId: '',
  courseTitle: '',
  teacherName: 'Prof. Nardo Zorrilla',
  isLive: false,
  topicTitle: 'Clase Virtual en Vivo',
  viewerCount: 1,
  chatMessages: [],
};

// Cross-tab communication channel
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('pca_live_sync');
  }
} catch {}

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`pca_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      if (key === 'tasks' && Array.isArray(parsed)) {
        return parsed.filter(
          (t: any) =>
            t &&
            t.id !== 'task_001' &&
            t.id !== 'task_002' &&
            t.teacherName !== 'Lic. Adeyri Zorrilla' &&
            !t.id?.startsWith('mock_')
        ) as unknown as T;
      }
      if (key === 'submissions' && Array.isArray(parsed)) {
        return parsed.filter(
          (s: any) => s && s.id !== 'sub_001' && s.id !== 'sub_002' && !s.id?.startsWith('mock_')
        ) as unknown as T;
      }
      if (key === 'justifications' && Array.isArray(parsed)) {
        return parsed.filter(
          (j: any) => j && j.id !== 'just_001' && j.id !== 'just_002' && !j.id?.startsWith('mock_')
        ) as unknown as T;
      }
      if (key === 'announcements' && Array.isArray(parsed)) {
        return parsed.filter(
          (a: any) => a && a.id !== 'anc_001' && a.id !== 'anc_002' && !a.id?.startsWith('mock_')
        ) as unknown as T;
      }
      return parsed;
    }
  } catch {}
  return fallback;
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`pca_${key}`, JSON.stringify(value));
  } catch {}
}

type Listener<T> = (data: T) => void;
const subscribers = {
  tasks: new Set<Listener<LiveTask[]>>(),
  submissions: new Set<Listener<StudentTaskSubmission[]>>(),
  justifications: new Set<Listener<AbsenceJustification[]>>(),
  announcements: new Set<Listener<TeacherAnnouncement[]>>(),
  classroom: new Set<Listener<LiveClassroomSession>>(),
};

function notifyChannel(type: string, payload: any) {
  if (channel) {
    try {
      channel.postMessage({ type, payload, timestamp: Date.now() });
    } catch {}
  }
}

if (channel) {
  channel.onmessage = (event) => {
    const { type, payload } = event.data || {};
    if (type === 'tasks' && Array.isArray(payload)) {
      setLocal('tasks', payload);
      subscribers.tasks.forEach((cb) => cb(payload));
    } else if (type === 'submissions' && Array.isArray(payload)) {
      setLocal('submissions', payload);
      subscribers.submissions.forEach((cb) => cb(payload));
    } else if (type === 'justifications' && Array.isArray(payload)) {
      setLocal('justifications', payload);
      subscribers.justifications.forEach((cb) => cb(payload));
    } else if (type === 'announcements' && Array.isArray(payload)) {
      setLocal('announcements', payload);
      subscribers.announcements.forEach((cb) => cb(payload));
    } else if (type === 'classroom' && payload) {
      setLocal('classroom', payload);
      subscribers.classroom.forEach((cb) => cb(payload));
    }
  };
}

// Backend PostgreSQL sync helpers
async function pullSyncState<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/sync/${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.exists && json.data !== undefined && json.data !== null) {
        return json.data as T;
      }
    }
  } catch {}
  return null;
}

async function pushSyncState<T>(key: string, data: T): Promise<void> {
  try {
    await fetch(`/api/sync/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
  } catch (err) {
    console.warn(`Sync push warning (${key}):`, err);
  }
}

// Shared lightweight poller so live classroom & tasks stay synced across devices/browsers
let pollTimer: ReturnType<typeof setInterval> | null = null;
const lastJsonHashes: Record<string, string> = {};

function ensurePolling() {
  if (pollTimer || typeof window === 'undefined') return;
  pollTimer = setInterval(async () => {
    const hasAny =
      subscribers.classroom.size > 0 ||
      subscribers.tasks.size > 0 ||
      subscribers.submissions.size > 0 ||
      subscribers.justifications.size > 0 ||
      subscribers.announcements.size > 0;

    if (!hasAny) {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      return;
    }

    if (subscribers.classroom.size > 0) {
      const live = await pullSyncState<LiveClassroomSession>('classroom');
      if (live) {
        const serialized = JSON.stringify(live);
        if (lastJsonHashes.classroom !== serialized) {
          lastJsonHashes.classroom = serialized;
          setLocal('classroom', live);
          subscribers.classroom.forEach((cb) => cb(live));
        }
      }
    }

    if (subscribers.tasks.size > 0) {
      const tasks = await pullSyncState<LiveTask[]>('tasks');
      if (Array.isArray(tasks)) {
        const serialized = JSON.stringify(tasks);
        if (lastJsonHashes.tasks !== serialized) {
          lastJsonHashes.tasks = serialized;
          setLocal('tasks', tasks);
          subscribers.tasks.forEach((cb) => cb(tasks));
        }
      }
    }

    if (subscribers.submissions.size > 0) {
      const subs = await pullSyncState<StudentTaskSubmission[]>('submissions');
      if (Array.isArray(subs)) {
        const serialized = JSON.stringify(subs);
        if (lastJsonHashes.submissions !== serialized) {
          lastJsonHashes.submissions = serialized;
          setLocal('submissions', subs);
          subscribers.submissions.forEach((cb) => cb(subs));
        }
      }
    }

    if (subscribers.justifications.size > 0) {
      const justs = await pullSyncState<AbsenceJustification[]>('justifications');
      if (Array.isArray(justs)) {
        const serialized = JSON.stringify(justs);
        if (lastJsonHashes.justifications !== serialized) {
          lastJsonHashes.justifications = serialized;
          setLocal('justifications', justs);
          subscribers.justifications.forEach((cb) => cb(justs));
        }
      }
    }

    if (subscribers.announcements.size > 0) {
      const anns = await pullSyncState<TeacherAnnouncement[]>('announcements');
      if (Array.isArray(anns)) {
        const serialized = JSON.stringify(anns);
        if (lastJsonHashes.announcements !== serialized) {
          lastJsonHashes.announcements = serialized;
          setLocal('announcements', anns);
          subscribers.announcements.forEach((cb) => cb(anns));
        }
      }
    }
  }, 3000);
}

// ==========================================
// 1. TASKS SYNC
// ==========================================
export function subscribeToTasks(callback: (tasks: LiveTask[]) => void): () => void {
  subscribers.tasks.add(callback);
  const current = getLocal<LiveTask[]>('tasks', INITIAL_TASKS);
  callback(current);

  pullSyncState<LiveTask[]>('tasks').then((cloud) => {
    if (Array.isArray(cloud)) {
      lastJsonHashes.tasks = JSON.stringify(cloud);
      setLocal('tasks', cloud);
      callback(cloud);
    }
  });
  ensurePolling();

  return () => {
    subscribers.tasks.delete(callback);
  };
}

export async function createLiveTask(taskData: Omit<LiveTask, 'id' | 'createdAt'>): Promise<LiveTask> {
  const newTask: LiveTask = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: 'Recién asignada',
  };

  const tasks = getLocal<LiveTask[]>('tasks', INITIAL_TASKS);
  const updated = [newTask, ...tasks];
  lastJsonHashes.tasks = JSON.stringify(updated);
  setLocal('tasks', updated);
  subscribers.tasks.forEach((cb) => cb(updated));
  notifyChannel('tasks', updated);
  await pushSyncState('tasks', updated);

  return newTask;
}

// ==========================================
// 2. SUBMISSIONS SYNC
// ==========================================
export function subscribeToSubmissions(callback: (subs: StudentTaskSubmission[]) => void): () => void {
  subscribers.submissions.add(callback);
  const current = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  callback(current);

  pullSyncState<StudentTaskSubmission[]>('submissions').then((cloud) => {
    if (Array.isArray(cloud)) {
      lastJsonHashes.submissions = JSON.stringify(cloud);
      setLocal('submissions', cloud);
      callback(cloud);
    }
  });
  ensurePolling();

  return () => {
    subscribers.submissions.delete(callback);
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
    status: 'pending',
  };

  const subs = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  const updated = [newSubmission, ...subs];
  lastJsonHashes.submissions = JSON.stringify(updated);
  setLocal('submissions', updated);
  subscribers.submissions.forEach((cb) => cb(updated));
  notifyChannel('submissions', updated);
  await pushSyncState('submissions', updated);

  return newSubmission;
}

export async function gradeStudentSubmission(
  submissionId: string,
  grade: number,
  feedback: string
): Promise<void> {
  const subs = getLocal<StudentTaskSubmission[]>('submissions', INITIAL_STUDENT_SUBMISSIONS);
  const nowStr = 'Hoy a las ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updated = subs.map((s) => {
    if (s.id === submissionId) {
      return {
        ...s,
        grade,
        teacherFeedback: feedback,
        gradedAt: nowStr,
        status: (grade < 70 ? 'needs_revision' : 'graded') as 'graded' | 'needs_revision',
      };
    }
    return s;
  });

  lastJsonHashes.submissions = JSON.stringify(updated);
  setLocal('submissions', updated);
  subscribers.submissions.forEach((cb) => cb(updated));
  notifyChannel('submissions', updated);
  await pushSyncState('submissions', updated);
}

// ==========================================
// 3. ABSENCE JUSTIFICATIONS SYNC
// ==========================================
export function subscribeToJustifications(callback: (justs: AbsenceJustification[]) => void): () => void {
  subscribers.justifications.add(callback);
  const current = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  callback(current);

  pullSyncState<AbsenceJustification[]>('justifications').then((cloud) => {
    if (Array.isArray(cloud)) {
      lastJsonHashes.justifications = JSON.stringify(cloud);
      setLocal('justifications', cloud);
      callback(cloud);
    }
  });
  ensurePolling();

  return () => {
    subscribers.justifications.delete(callback);
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
    submittedAt: 'Hoy, hace un momento',
  };

  const justs = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  const updated = [newJust, ...justs];
  lastJsonHashes.justifications = JSON.stringify(updated);
  setLocal('justifications', updated);
  subscribers.justifications.forEach((cb) => cb(updated));
  notifyChannel('justifications', updated);
  await pushSyncState('justifications', updated);

  return newJust;
}

export async function reviewStudentJustification(
  justificationId: string,
  status: 'approved' | 'rejected',
  teacherNotes: string
): Promise<void> {
  const justs = getLocal<AbsenceJustification[]>('justifications', INITIAL_ABSENCE_JUSTIFICATIONS);
  const updated = justs.map((j) => {
    if (j.id === justificationId) {
      return {
        ...j,
        status,
        teacherNotes:
          teacherNotes ||
          (status === 'approved'
            ? 'Justificante aceptado por el docente.'
            : 'Justificante rechazado por falta de sustento.'),
      };
    }
    return j;
  });

  lastJsonHashes.justifications = JSON.stringify(updated);
  setLocal('justifications', updated);
  subscribers.justifications.forEach((cb) => cb(updated));
  notifyChannel('justifications', updated);
  await pushSyncState('justifications', updated);
}

// ==========================================
// 4. ANNOUNCEMENTS SYNC
// ==========================================
export function subscribeToAnnouncements(callback: (anns: TeacherAnnouncement[]) => void): () => void {
  subscribers.announcements.add(callback);
  const current = getLocal<TeacherAnnouncement[]>('announcements', INITIAL_TEACHER_ANNOUNCEMENTS);
  callback(current);

  pullSyncState<TeacherAnnouncement[]>('announcements').then((cloud) => {
    if (Array.isArray(cloud)) {
      lastJsonHashes.announcements = JSON.stringify(cloud);
      setLocal('announcements', cloud);
      callback(cloud);
    }
  });
  ensurePolling();

  return () => {
    subscribers.announcements.delete(callback);
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
    viewsCount: 1,
  };

  const anns = getLocal<TeacherAnnouncement[]>('announcements', INITIAL_TEACHER_ANNOUNCEMENTS);
  const updated = [newAnn, ...anns];
  lastJsonHashes.announcements = JSON.stringify(updated);
  setLocal('announcements', updated);
  subscribers.announcements.forEach((cb) => cb(updated));
  notifyChannel('announcements', updated);
  await pushSyncState('announcements', updated);

  return newAnn;
}

// ==========================================
// 5. LIVE VIRTUAL CLASSROOM SYNC
// ==========================================
export function subscribeToClassroomSession(callback: (session: LiveClassroomSession) => void): () => void {
  subscribers.classroom.add(callback);
  const current = getLocal<LiveClassroomSession>('classroom', INITIAL_CLASSROOM_SESSION);
  callback(current);

  pullSyncState<LiveClassroomSession>('classroom').then((cloud) => {
    if (cloud) {
      lastJsonHashes.classroom = JSON.stringify(cloud);
      setLocal('classroom', cloud);
      callback(cloud);
    }
  });
  ensurePolling();

  return () => {
    subscribers.classroom.delete(callback);
  };
}

export async function updateClassroomSession(updates: Partial<LiveClassroomSession>): Promise<void> {
  const current = getLocal<LiveClassroomSession>('classroom', INITIAL_CLASSROOM_SESSION);
  const updated: LiveClassroomSession = {
    ...current,
    ...updates,
  };

  lastJsonHashes.classroom = JSON.stringify(updated);
  setLocal('classroom', updated);
  subscribers.classroom.forEach((cb) => cb(updated));
  notifyChannel('classroom', updated);
  await pushSyncState('classroom', updated);
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
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const updatedChat = [...(current.chatMessages || []), newMsg];
  await updateClassroomSession({ chatMessages: updatedChat });
}
