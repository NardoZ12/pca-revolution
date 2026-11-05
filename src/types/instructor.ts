/**
 * Types and models for Punta Cana Academy Instructors Hub
 */

export interface InstructorProfile {
  uid: string;
  email: string;
  displayName: string;
  specialty: string;
  bio: string;
  avatarUrl?: string;
  phone?: string;
  rating: number;
  totalStudents: number;
  activeCoursesCount: number;
  payoutMethod: 'bank_transfer' | 'paypal';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    idNumber: string;
  };
  paypalEmail?: string;
  balanceAvailable: number;
  totalEarningsAllTime: number;
  proCaribeRoyaltiesThisMonth: number;
}

export interface TeacherCourse {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'published' | 'under_review' | 'draft';
  enrolledStudentsCount: number;
  rating: number;
  thumbnail: string;
  description: string;
  subtitle?: string;
  duration?: string;
  modality?: 'Virtual 100%' | 'Presencial en Friusa' | 'Semipresencial (Híbrida)' | 'Virtual' | 'Semipresencial';
  schedule?: string;
  graduateProfile?: string;
  methodology?: string;
  explanatoryVideoUrl?: string;
  certification?: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  proCaribeEligible: boolean;
  units: TeacherCurriculumUnit[];
}

export interface TeacherCurriculumUnit {
  id: string;
  title: string;
  description?: string;
  topics: TeacherTopic[];
}

export interface TeacherTopic {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  slidesUrl?: string;
  slidesCount?: number;
  pdfUrl?: string;
  hasQuiz: boolean;
  hasPractice: boolean;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  practiceInstructions?: string;
  practiceRubric?: string;
}

export interface StudentTaskSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  courseId: string;
  courseTitle: string;
  topicId: string;
  topicTitle: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'needs_revision';
  submissionText: string;
  attachmentName?: string;
  attachmentUrl?: string;
  grade?: number;
  teacherFeedback?: string;
  gradedAt?: string;
}

export interface AbsenceJustification {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  classDate: string;
  reason: string;
  documentProofName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  teacherNotes?: string;
}

export interface TeacherAnnouncement {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  content: string;
  createdAt: string;
  priority: 'normal' | 'urgent';
  viewsCount: number;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'course_sale_65' | 'pro_caribe_pool' | 'withdrawal';
  description: string;
  status: 'completed' | 'processing' | 'pending';
  receiptReference?: string;
}

export interface LiveTask {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  rubric?: string;
  points: number;
  createdAt: string;
  teacherId: string;
  teacherName: string;
}

export interface ClassroomChatMessage {
  id: string;
  sender: string;
  role: 'teacher' | 'student';
  text: string;
  time: string;
}

export interface LiveClassroomSession {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  isLive: boolean;
  topicTitle: string;
  startedAt?: string;
  viewerCount: number;
  chatMessages: ClassroomChatMessage[];
}
