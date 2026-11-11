import React, { useState, useEffect, useRef } from 'react';
import { 
  LiveTask, 
  AbsenceJustification, 
  StudentTaskSubmission, 
  TeacherAnnouncement, 
  LiveClassroomSession 
} from '../types/instructor';
import {
  subscribeToTasks,
  subscribeToJustifications,
  subscribeToSubmissions,
  subscribeToAnnouncements,
  subscribeToClassroomSession,
  submitStudentJustification,
  submitStudentTask,
  createTeacherAnnouncement
} from '../lib/syncService';
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Award, 
  UserCheck, 
  FileText, 
  Calendar as CalendarIcon, 
  Megaphone, 
  Download, 
  MessageSquare, 
  LogOut, 
  Search, 
  Bell, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Play,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  CreditCard,
  Settings,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Printer,
  Edit3,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
  Check,
  AlertCircle,
  Presentation,
  Upload,
  FileQuestion
} from 'lucide-react';
import { StudentProfile, saveStudentProfile } from '../lib/firebase.ts';
import { COURSES_LIST, Course, getAllCourses } from '../data/coursesData.ts';
import { CourseCurriculumPlayer } from './CourseCurriculumPlayer.tsx';

interface StudentDashboardProps {
  student: StudentProfile;
  onEnterClassroom: (courseTitle: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenPaymentGateway?: (planOrCourse?: string) => void;
  onUpdateStudent?: (updated: StudentProfile) => void;
  onOpenCurriculum?: (courseId?: string, courseTitle?: string) => void;
  onOpenInstructorPortal?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onEnterClassroom,
  onLogout,
  onBackToHome,
  onOpenPaymentGateway,
  onUpdateStudent,
  onOpenCurriculum,
  onOpenInstructorPortal,
}) => {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Responsive & Proportions Controls (Req 2)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(0.85); // 85% default zoom matching user request

  // Modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showExamSimulatorModal, setShowExamSimulatorModal] = useState(false);
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState<Course | null>(null);
  const [viewingCurriculumCourse, setViewingCurriculumCourse] = useState<{ id: string; title: string } | null>(null);

  // Live Academic Synchronization State
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>([]);
  const [liveJustifications, setLiveJustifications] = useState<AbsenceJustification[]>([]);
  const [liveSubmissions, setLiveSubmissions] = useState<StudentTaskSubmission[]>([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState<TeacherAnnouncement[]>([]);
  const [classroomSession, setClassroomSession] = useState<LiveClassroomSession | null>(null);

  // Submit task modal state
  const [showTaskSubmitModal, setShowTaskSubmitModal] = useState(false);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState<LiveTask | null>(null);
  const [taskSubmissionText, setTaskSubmissionText] = useState('');
  const [taskAttachmentName, setTaskAttachmentName] = useState('');

  // Justify absence form state
  const [justifyDate, setJustifyDate] = useState('2026-11-04');
  const [justifyCourse, setJustifyCourse] = useState('Inglés Bilingüe & Inmersión para Hotelería y Negocios');
  const [justifyReason, setJustifyReason] = useState('Horario laboral hotelero');
  const [justifyExplanation, setJustifyExplanation] = useState('');
  const [justifyProofName, setJustifyProofName] = useState('Constancia_Laboral_Hotel.pdf');
  const [showLivePopupAlert, setShowLivePopupAlert] = useState(true);

  // Real-time synchronization listeners
  useEffect(() => {
    const unsubTasks = subscribeToTasks((tasks) => {
      setLiveTasks(tasks);
    });
    const unsubJusts = subscribeToJustifications((justs) => {
      setLiveJustifications(justs);
    });
    const unsubSubs = subscribeToSubmissions((subs) => {
      setLiveSubmissions(subs);
    });
    const unsubAnns = subscribeToAnnouncements((anns) => {
      setLiveAnnouncements(anns);
    });
    const unsubClass = subscribeToClassroomSession((session) => {
      setClassroomSession(session);
      if (session.isLive) {
        setShowLivePopupAlert(true);
      }
    });

    return () => {
      unsubTasks();
      unsubJusts();
      unsubSubs();
      unsubAnns();
      unsubClass();
    };
  }, []);

  // Play gentle chime when teacher goes live
  useEffect(() => {
    if (classroomSession?.isLive) {
      try {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }
      } catch (e) {}
    }
  }, [classroomSession?.isLive, classroomSession?.courseId]);


  const handleSendJustification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justifyExplanation.trim()) {
      triggerToast('Por favor escribe la explicación del justificante.');
      return;
    }
    await submitStudentJustification({
      studentId: student.uid || 'stu_demo_01',
      studentName: student.displayName || 'Nardo Zorrilla',
      courseId: 'ingles-bilingue-hoteleria',
      courseTitle: justifyCourse,
      classDate: justifyDate,
      reason: `${justifyReason}: ${justifyExplanation.trim()}`,
      documentProofName: justifyProofName || 'Comprobante_Adjunto.pdf'
    });
    setShowJustifyModal(false);
    setJustifyExplanation('');
    triggerToast('¡Justificación enviada al profesor encargado! Aparece en su lista de revisión al instante.');
  };

  const handleSendTaskSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskSubmissionText.trim() || !selectedTaskForSubmit) {
      triggerToast('Por favor escribe el contenido de tu entrega.');
      return;
    }
    await submitStudentTask({
      studentId: student.uid || 'stu_demo_01',
      studentName: student.displayName || 'Nardo Zorrilla',
      courseId: selectedTaskForSubmit.courseId,
      courseTitle: selectedTaskForSubmit.courseTitle,
      topicId: selectedTaskForSubmit.id,
      topicTitle: selectedTaskForSubmit.title,
      submissionText: taskSubmissionText.trim(),
      attachmentName: taskAttachmentName.trim() || 'Entrega_Practica_NardoZorrilla.pdf'
    });
    setShowTaskSubmitModal(false);
    setTaskSubmissionText('');
    setTaskAttachmentName('');
    setSelectedTaskForSubmit(null);
    triggerToast('¡Práctica enviada con éxito! Ya está disponible en la libreta de calificaciones del profesor.');
  };

  // Profile Form State (Real user data only - zero fake placeholder values)
  const [profileData, setProfileData] = useState({
    displayName: student.displayName || '',
    email: student.email || '',
    avatarUrl: student.avatarUrl || '',
    phone: student.phone || '',
    documentId: student.documentId || '',
    address: student.address || '',
    birthDate: student.birthDate || '',
    emergencyContact: student.emergencyContact || '',
    emergencyPhone: student.emergencyPhone || '',
    emergencyRelation: student.emergencyRelation || '',
    academicLevel: (student.enrolledCourses && student.enrolledCourses.length > 0) ? 'Estudiante Regular' : 'Nuevo Ingreso',
    isEditing: false,
  });

  const handleUploadStudentAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfileData(prev => ({ ...prev, avatarUrl: base64 }));
      const updated: StudentProfile = { ...student, avatarUrl: base64 };
      localStorage.setItem('pca_active_student', JSON.stringify(updated));
      saveStudentProfile(updated).catch(() => {});
      if (onUpdateStudent) onUpdateStudent(updated);
      triggerToast('¡Foto de perfil actualizada con éxito!');
    };
    reader.readAsDataURL(file);
  };

  // Persistent Student Calendar state (Requirement 5: Allows scheduling class dates and persists)
  const [scheduledClassDays, setScheduledClassDays] = useState<Record<number, { courseTitle: string; time: string }>>(() => {
    try {
      const stored = localStorage.getItem(`pca_student_calendar_${student.uid || student.email}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  });
  const [calendarSelectedCourse, setCalendarSelectedCourse] = useState<string>('');
  const [calendarSelectedTime, setCalendarSelectedTime] = useState<string>('7:00 PM - 9:00 PM');

  const handleSaveCalendarDay = (day: number, courseTitle: string, time: string) => {
    const title = courseTitle || primaryCourseTitle || 'Clase Virtual en Vivo';
    const updated = {
      ...scheduledClassDays,
      [day]: { courseTitle: title, time }
    };
    setScheduledClassDays(updated);
    localStorage.setItem(`pca_student_calendar_${student.uid || student.email}`, JSON.stringify(updated));
    triggerToast(`¡Clase de "${title}" guardada para el día ${day} de Noviembre!`);
  };

  const handleRemoveCalendarDay = (day: number) => {
    const updated = { ...scheduledClassDays };
    delete updated[day];
    setScheduledClassDays(updated);
    localStorage.setItem(`pca_student_calendar_${student.uid || student.email}`, JSON.stringify(updated));
    triggerToast(`Clase del día ${day} eliminada de tu calendario.`);
  };

  // Real attendance history from localStorage
  const [attendanceHistory] = useState<Array<{ id: string; date: string; courseTitle: string; modality: string; time: string; status: string }>>(() => {
    try {
      const raw = localStorage.getItem(`pca_student_attendance_${student.uid || student.email}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  // Real topic quiz & practice grades from curriculum completions
  const [topicGrades] = useState<Array<{ id: string; courseTitle: string; topicTitle: string; type: string; grade: number; date: string }>>(() => {
    try {
      const raw = localStorage.getItem(`pca_student_grades_${student.uid || student.email}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  // Saved Payment Methods State (Requirement 19: Purge fake 4242 cards)
  const [savedCards, setSavedCards] = useState<Array<{ id: string; brand: string; last4: string; isDefault: boolean; expiry: string }>>(() => {
    try {
      const stored = localStorage.getItem('pca_student_cards');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((c: any) => c && c.last4 !== '4242' && c.brand !== 'Visa');
      }
    } catch (e) {}
    return [];
  });
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');

  // Settings Toggles State
  const [settingsToggles, setSettingsToggles] = useState({
    whatsappNotifications: true,
    emailDigest: true,
    classReminders: true,
  });

  // Dynamic Invoices State (Requirement 19: Purge fake 4242 invoices)
  const [invoices, setInvoices] = useState<Array<{ id: string; date: string; concept: string; method: string; amount: string; status: string }>>(() => {
    try {
      const stored = localStorage.getItem('pca_student_invoices');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((i: any) => i && !i.method?.includes('4242') && !i.id?.includes('2026-00'));
      }
    } catch (e) {}
    return [];
  });

  // Marketplace Category Filter
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>('Todos');

  // Exam Simulator State
  const [simulatorStep, setSimulatorStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate days left in 12-day trial
  const calculateDaysLeft = () => {
    if (!student.trialExpiresAt) return 12;
    const diff = new Date(student.trialExpiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const daysLeft = calculateDaysLeft();

  // Dynamic courses catalog and student enrolled courses (Sanitizing legacy dummy slugs)
  const allCatalogCourses = getAllCourses();
  const sanitizedEnrolled = (student.enrolledCourses || []).filter(
    (c: string) => c !== 'ingles-bilingue-hoteleria' && c !== 'full-stack-web-dev' && c !== 'ia-para-negocios' && c !== 'ai-masterclass-negocios'
  );
  const studentEnrolledCoursesList = allCatalogCourses.filter(c => 
    sanitizedEnrolled.includes(c.id) || sanitizedEnrolled.includes(c.title)
  );
  const activeEnrolledCourse = studentEnrolledCoursesList[0] || null;
  const primaryCourseTitle = activeEnrolledCourse ? activeEnrolledCourse.title : '';

  // Filter tasks to only show assignments for courses the student is actually enrolled in
  const enrolledCourseIds = new Set(studentEnrolledCoursesList.map(c => c.id).concat(studentEnrolledCoursesList.map(c => c.title)));
  const studentTasks = liveTasks.filter(task => 
    enrolledCourseIds.has(task.courseId) || enrolledCourseIds.has(task.courseTitle)
  );

  // Real student graded submissions & real average grade
  const mySubmissions = liveSubmissions.filter(s => 
    s.studentId === student.uid || 
    s.studentName === student.displayName || 
    (profileData.displayName && s.studentName === profileData.displayName)
  );
  const studentGradedSubmissions = mySubmissions.filter(s => s.status === 'graded' && typeof s.grade === 'number');

  // Combined real evaluations: topic quizzes + graded submissions
  const allEvaluations = [
    ...topicGrades.map(g => ({
      id: g.id,
      courseTitle: g.courseTitle,
      topicTitle: g.topicTitle,
      type: g.type,
      grade: g.grade,
      status: g.grade >= 80 ? 'Aprobado' : 'Revisión',
      date: g.date
    })),
    ...studentGradedSubmissions.map(s => ({
      id: s.id,
      courseTitle: s.courseTitle,
      topicTitle: s.topicTitle,
      type: 'Práctica con Docente',
      grade: s.grade || 0,
      status: (s.grade || 0) >= 80 ? 'Aprobado' : 'Revisión',
      date: s.gradedAt || s.submittedAt
    }))
  ];

  const realAverageGrade = allEvaluations.length > 0
    ? Math.round(allEvaluations.reduce((acc, curr) => acc + curr.grade, 0) / allEvaluations.length)
    : 0;

  // Sidebar Menu Items with All Required Sections (Req 4, 5, 6, 7, 8 + Autoaprendizaje)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'cursos', label: 'Mis cursos', icon: BookOpen },
    { id: 'curriculum', label: 'Plan de estudio (Unidades)', icon: Presentation, badge: 'Interactivo' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'Nuevo' },
    { id: 'calificaciones', label: 'Calificaciones', icon: Award },
    { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
    { id: 'examenes', label: 'Exámenes', icon: FileText },
    { id: 'calendario', label: 'Calendario académico', icon: CalendarIcon },
    { id: 'anuncios', label: 'Tablón de anuncios', icon: Megaphone },
    { id: 'descargas', label: 'Descargas', icon: Download },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'billing', label: 'Facturación (Billing)', icon: CreditCard },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  // Handle Profile Save
  const handleSaveProfile = () => {
    const updated: StudentProfile = {
      ...student,
      displayName: profileData.displayName,
      email: profileData.email,
      avatarUrl: profileData.avatarUrl,
      phone: profileData.phone,
      documentId: profileData.documentId,
      address: profileData.address,
      birthDate: profileData.birthDate,
      emergencyContact: profileData.emergencyContact,
      emergencyPhone: profileData.emergencyPhone,
      emergencyRelation: profileData.emergencyRelation,
    };
    localStorage.setItem('pca_active_student', JSON.stringify(updated));
    saveStudentProfile(updated).catch(() => {});
    if (onUpdateStudent) onUpdateStudent(updated);
    setProfileData(prev => ({ ...prev, isEditing: false }));
    triggerToast('¡Perfil de estudiante actualizado con éxito!');
  };

  // Handle 1-Click Course Enrollment in Marketplace
  const handleEnrollMarketplaceCourse = (course: Course) => {
    const currentCourses = student.enrolledCourses || [];
    if (currentCourses.includes(course.id) || currentCourses.includes(course.title)) {
      triggerToast(`Ya estás matriculado en ${course.title}. Abriendo curso...`);
      setActiveMenu('cursos');
      return;
    }

    const updated: StudentProfile = {
      ...student,
      enrolledCourses: [...currentCourses, course.title],
    };
    localStorage.setItem('pca_active_student', JSON.stringify(updated));
    saveStudentProfile(updated).catch(() => {});
    if (onUpdateStudent) onUpdateStudent(updated);

    // Notify the instructor in real-time
    createTeacherAnnouncement({
      courseId: course.id,
      courseTitle: course.title,
      title: `🎉 ¡Nuevo Estudiante Matriculado: ${student.displayName}!`,
      content: `El estudiante ${student.displayName} (${student.email}) se ha matriculado en tu curso "${course.title}". Ya puede acceder a tu temario y tareas asignadas.`,
      priority: 'normal'
    }).catch(() => {});

    triggerToast(`¡Inscripción exitosa en ${course.title}! Se ha añadido a tus cursos y tu profesor ha sido notificado.`);
    setActiveMenu('cursos');
  };

  // Handle Add Payment Card
  const handleAddPaymentCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || newCardNumber.length < 15) {
      alert('Introduce un número de tarjeta válido');
      return;
    }
    const last4 = newCardNumber.replace(/\s/g, '').slice(-4);
    const newCard = {
      id: 'c_' + Date.now(),
      brand: newCardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      last4,
      isDefault: false,
      expiry: newCardExpiry || '12/28'
    };
    setSavedCards(prev => [...prev, newCard]);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvc('');
    setShowAddCardModal(false);
    triggerToast('¡Nueva forma de pago guardada de forma segura!');
  };

  // Dedicated Course Curriculum & Multimedia Auto-Learning Player View (Unidades y Temas)
  if (viewingCurriculumCourse) {
    return (
      <CourseCurriculumPlayer
        courseId={viewingCurriculumCourse.id}
        courseTitle={viewingCurriculumCourse.title}
        student={student}
        onBackToDashboard={() => setViewingCurriculumCourse(null)}
        onEnterLiveClassroom={(title) => {
          setViewingCurriculumCourse(null);
          onEnterClassroom(title);
        }}
        onProgressUpdated={(newPct) => {
          triggerToast(`¡Progreso del curso actualizado! Llevas ${newPct}% del temario dominado.`);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-[#030712] text-slate-200 flex flex-col md:flex-row antialiased relative selection:bg-cyan-500/30 font-sans overflow-hidden">
      
      {/* MOBILE DRAWER BACKDROP (Req 2: Se despliega lateralmente) */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xs transition-opacity animate-fadeIn"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR (Desktop Collapsible & Mobile Slide-Over Drawer - border reaches 100% full height) */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-40 h-full
          bg-[#050b18] border-r border-slate-800 flex flex-col shrink-0
          transition-all duration-300 ease-in-out box-border
          ${isMobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${isDesktopSidebarCollapsed ? 'md:w-16' : 'md:w-60'}
        `}
      >
        
        {/* Sidebar Header with Official Logo (Req 2: Exact matching h-14 height aligned with main header) */}
        <div className="h-14 px-3.5 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 box-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/aistudio/logo_7f87d68b.png"
              alt="Punta Cana Academy"
              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shadow-sm shrink-0"
            />
            {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="leading-tight truncate">
                <span className="font-black text-white text-xs tracking-tight block truncate">
                  Punta Cana
                </span>
                <span className="text-[10px] font-bold text-cyan-400 block -mt-0.5">
                  Academy
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle Button inside sidebar */}
          <button
            onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            title={isDesktopSidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
          >
            {isDesktopSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (All 13 subpages requested) */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'curriculum') {
                    if (onOpenCurriculum) {
                      onOpenCurriculum(undefined, undefined);
                    } else {
                      setViewingCurriculumCourse({ id: '', title: '' });
                    }
                  } else {
                    setActiveMenu(item.id);
                  }
                  setIsMobileSidebarOpen(false);
                }}
                title={isDesktopSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                } ${isDesktopSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {item.badge && (!isDesktopSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Badge */}
        <div className="p-2 border-t border-slate-800 bg-[#040814] shrink-0">
          <div className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 ${
            isDesktopSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'justify-between'
          }`}>
            <button
              onClick={() => {
                setActiveMenu('perfil');
                setIsMobileSidebarOpen(false);
              }}
              className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-black text-cyan-300 text-xs shrink-0 group-hover:scale-105 transition-transform">
                {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'E'}
              </div>
              {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="truncate">
                  <p className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-cyan-400 transition-colors">
                    {profileData.displayName || 'Estudiante'}
                  </p>
                  <p className="text-[9px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {student.plan === 'free_trial' ? `Prueba (${daysLeft}d)` : 'Membresía Pro'}
                  </p>
                </div>
              )}
            </button>

            {(!isDesktopSidebarCollapsed || isMobileSidebarOpen) && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="h-full flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar (Req 2: Exact matching h-14 height continuously aligned with sidebar header border-b) */}
        <header className="h-14 bg-[#050b18] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 box-border z-30">
          
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Button to slide drawer from left */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Abrir menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Contextual Breadcrumb (Sin segundo logo duplicado en header) */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="capitalize truncate">
                  {activeMenu === 'dashboard' ? 'Dashboard del estudiante' : activeMenu}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Zoom Scale Selector + Search + Return to Web */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Zoom / Proportion Selector (Req: 70% Zoom out compact layout) */}
            <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setZoomScale(0.72)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  zoomScale <= 0.75 
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista compacta al 70%"
              >
                70% Zoom
              </button>
              <button
                onClick={() => setZoomScale(0.85)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  zoomScale === 0.85 
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista media al 85%"
              >
                85%
              </button>
              <button
                onClick={() => setZoomScale(1.0)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  zoomScale === 1.0 
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista estándar al 100%"
              >
                100%
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-36 sm:w-48 hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en cursos..."
                className="w-full pl-7 pr-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setActiveMenu('anuncios')}
              title="Notificaciones y Anuncios"
              className="relative p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-1 right-1" />
            </button>
          </div>
        </header>

        {/* Dashboard Content Container with Zoom / Density Applied (Req: Proporciones 70%) */}
        <div 
          className="flex-1 w-full overflow-y-auto transition-all duration-200"
          style={zoomScale !== 1.0 ? { zoom: zoomScale } : undefined}
        >
          <div className="p-3 sm:p-5 space-y-4 max-w-6xl mx-auto w-full">

            {/* ============================================================ */}
            {/* VIEW 1: MAIN DASHBOARD OVERVIEW                              */}
            {/* ============================================================ */}
            {activeMenu === 'dashboard' && (
              <>
                {/* Real-Time Live Broadcast Banner from Teacher (Requirement 15: Course-specific) */}
                {classroomSession?.isLive && studentEnrolledCoursesList.some(c => 
                  c.id === classroomSession.courseId || 
                  c.slug === classroomSession.courseId ||
                  c.title?.toLowerCase() === classroomSession.courseTitle?.toLowerCase() ||
                  (classroomSession.courseTitle && c.title && (
                    c.title.toLowerCase().includes(classroomSession.courseTitle.toLowerCase()) ||
                    classroomSession.courseTitle.toLowerCase().includes(c.title.toLowerCase())
                  ))
                ) && (

                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/90 via-slate-900 to-cyan-950/90 border border-red-500/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                            EN VIVO AHORA
                          </span>
                          <span className="text-xs font-bold text-white">
                            {classroomSession.teacherName} ha iniciado la clase virtual
                          </span>
                        </div>
                        <p className="text-[11px] text-cyan-200 mt-0.5 font-medium">
                          {classroomSession.courseTitle} • {classroomSession.topicTitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onEnterClassroom(classroomSession.courseTitle || primaryCourseTitle)}
                      className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Unirse al Aula Virtual en Vivo</span>
                    </button>
                  </div>
                )}

                {/* Welcome Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                      Punta Cana Academy • Campus Virtual & Sede Friusa
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      ¡Hola, {profileData.displayName}!
                    </h1>
                    <p className="text-xs text-slate-400">
                      Tu espacio para aprender, revisar tus avances y organizar la próxima semana.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEnterClassroom(primaryCourseTitle)}
                      className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>Entrar al Aula Virtual</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu('calendario')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Calendario</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>

                {/* Mis Cursos Matriculados */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#060e22] via-[#05142e] to-[#040816] border-2 border-cyan-500/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h2 className="text-sm sm:text-base font-black text-white">
                        Mis Cursos Matriculados
                      </h2>
                    </div>
                    {studentEnrolledCoursesList.length > 0 && (
                      <button
                        onClick={() => setActiveMenu('cursos')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Ver todos mis cursos ({studentEnrolledCoursesList.length})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {studentEnrolledCoursesList.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                      <GraduationCap className="w-10 h-10 text-cyan-400 mx-auto opacity-70" />
                      <h3 className="text-sm font-bold text-white">Aún no estás matriculado en ningún curso</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Explora nuestro catálogo académico oficial con clases presenciales en Friusa y modalidad virtual híbrida para iniciar tu formación hoy mismo.
                      </p>
                      <button
                        onClick={() => setActiveMenu('marketplace')}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Explorar Cursos Disponibles</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 shadow-md overflow-hidden">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 p-0.5 shrink-0 shadow-md shadow-cyan-500/20">
                        <img
                          src={activeEnrolledCourse?.coverImage || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80"}
                          alt="Curso"
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            En Curso Activo
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            Docente: {activeEnrolledCourse?.instructor || 'Prof. Nardo Zorrilla'}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate sm:whitespace-normal">
                          {activeEnrolledCourse?.title || primaryCourseTitle}
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-[11px] text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                            <Clock className="w-3 h-3 shrink-0" />
                            {activeEnrolledCourse?.schedule || 'Próxima clase: Hoy 6:30 PM'}
                          </span>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <span className="text-slate-300">
                            {activeEnrolledCourse?.duration || '12 Semanas'}
                          </span>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <span className="text-emerald-400 font-semibold">
                            Aula Virtual abierta
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap sm:flex-nowrap pt-1 lg:pt-0">
                      <button
                        onClick={() => onEnterClassroom(activeEnrolledCourse?.title || primaryCourseTitle)}
                        className="flex-1 sm:flex-initial btn-gradient-cyan px-3.5 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Play className="w-3 h-3 fill-slate-950 shrink-0" />
                        <span>Entrar al Aula Virtual</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onOpenCurriculum) {
                            onOpenCurriculum(activeEnrolledCourse?.id || 'curso', activeEnrolledCourse?.title || primaryCourseTitle);
                          } else {
                            setViewingCurriculumCourse({ id: activeEnrolledCourse?.id || 'curso', title: activeEnrolledCourse?.title || primaryCourseTitle });
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5"
                        title="Ver unidades, temas y recursos didácticos interactivos"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Plan de Estudio (Unidades & Temas)</span>
                      </button>
                    </div>
                  </div>
                  )}
                </div>

                {/* Live Assigned Tasks & Homework by Teacher Section */}
                <div className="p-4 rounded-2xl bg-[#060c1c] border border-cyan-500/30 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                          <span>Tareas & Prácticas Pendientes</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                            {studentTasks.length} asignadas
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Asignadas por tu profesor en tiempo real. Envía tus entregas para recibir nota y feedback.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hidden sm:flex">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sincronizado con Docente
                    </span>
                  </div>

                  {studentTasks.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
                      <p className="text-xs font-bold text-white">No tienes tareas pendientes por el momento</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        {studentEnrolledCoursesList.length === 0 
                          ? 'Al matricularte en un curso, las tareas y prácticas oficiales que asigne tu profesor aparecerán en esta sección.' 
                          : 'Estás al día con tus entregas. Tu profesor publicará aquí nuevas prácticas y proyectos.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentTasks.map((task) => {
                        const mySubmission = liveSubmissions.find(s => s.topicId === task.id || s.topicTitle === task.title);
                        return (
                          <div key={task.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-xs text-white">{task.title}</h4>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30 shrink-0 font-bold">
                                  {task.points} pts
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{task.description}</p>
                              {task.rubric && (
                                <p className="text-[10px] text-slate-400 italic">Rúbrica: {task.rubric}</p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-amber-300 font-mono">
                                Vence: <strong>{task.dueDate}</strong>
                              </span>

                              {mySubmission ? (
                                mySubmission.status === 'graded' ? (
                                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Nota: {mySubmission.grade}/100</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                                    Entregada (Por Calificar)
                                  </span>
                                )
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedTaskForSubmit(task);
                                    setShowTaskSubmitModal(true);
                                  }}
                                  className="btn-gradient-cyan px-3 py-1 rounded-lg text-slate-950 font-black text-[11px] hover:scale-102 transition-all cursor-pointer shadow-sm"
                                >
                                  Entregar Práctica
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5 KPI Stat Cards (Authentic Real Data Only) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[9px] text-slate-500">↗</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">Promedio general</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {realAverageGrade > 0 ? `${realAverageGrade}%` : '--'}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {realAverageGrade > 0 ? 'Calificación oficial' : 'Sin notas registradas'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-[9px] text-slate-500">↗</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">Cursos matriculados</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {studentEnrolledCoursesList.length}
                    </p>
                    <p className="text-[9px] text-cyan-400">
                      {studentEnrolledCoursesList.length === 1 ? '1 curso activo' : `${studentEnrolledCoursesList.length} inscripciones`}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[9px] text-slate-500">↗</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">Exámenes completados</p>
                    <p className="text-lg font-black text-white mt-0.5">{student.completedExams || 0}</p>
                    <p className="text-[9px] text-slate-500">
                      {student.completedExams ? `${student.completedExams} completados` : '0 pendientes'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[9px] text-slate-500">↗</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">Rango general</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {studentEnrolledCoursesList.length > 0 ? 'Activo' : '--'}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {studentEnrolledCoursesList.length > 0 ? 'Estudiante Regular' : 'Pendiente de inicio'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/30 transition-all col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[9px] text-slate-500">↗</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">Asistencia</p>
                    <p className="text-lg font-black text-cyan-400 mt-0.5">
                      {studentEnrolledCoursesList.length > 0 ? `${student.attendanceRate || 100}%` : '--'}
                    </p>
                    <p className="text-[9px] text-emerald-400">
                      {studentEnrolledCoursesList.length > 0 ? 'Al día en Friusa & Online' : 'Sin registrar'}
                    </p>
                  </div>
                </div>

                {/* Row: Resultados recientes & Tablón de anuncios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-xs font-bold text-white">Resultados recientes</h3>
                        <button 
                          onClick={() => setActiveMenu('calificaciones')}
                          className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                        >
                          Ver historial
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">Calificaciones oficiales publicadas por tu docente</p>
                    </div>

                    <div className="py-2.5 space-y-2">
                      {studentGradedSubmissions.length === 0 ? (
                        <div className="py-5 text-center text-slate-400">
                          <FileText className="w-7 h-7 mx-auto text-slate-600 mb-1.5 opacity-60" />
                          <p className="text-xs font-semibold text-slate-300">No hay calificaciones registradas</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Al entregar tus prácticas, tus notas oficiales aparecerán aquí.</p>
                        </div>
                      ) : (
                        studentGradedSubmissions.slice(0, 3).map((sub) => (
                          <div key={sub.id} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                            <div className="min-w-0 flex-1 mr-2">
                              <p className="text-xs font-bold text-white truncate">{sub.topicTitle}</p>
                              <p className="text-[10px] text-slate-400 truncate">{sub.courseTitle}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              {sub.grade} / 100
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-xs font-bold text-white">Tablón de anuncios</h3>
                        <Megaphone className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Comunicados oficiales de la dirección</p>
                    </div>

                    <div className="py-2 space-y-2">
                      <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs">
                        <div className="flex items-center justify-between font-bold text-cyan-300 text-[10px] mb-0.5">
                          <span>Bienvenida Oficial • Lic. Daysi Polanco</span>
                          <span className="text-[9px] text-slate-400">Hoy</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Tu prueba gratuita de 12 días está activa. Puedes asistir a las clases en Friusa (Plaza Doña Bélgica) o ingresar al Aula Virtual 100% online a tu ritmo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row: Calendario académico, Accesos rápidos, Resumen de rendimiento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-white">Calendario académico</h3>
                      <div className="flex items-center gap-1 text-slate-400">
                        <button className="p-1 hover:text-white"><ChevronLeft className="w-3 h-3" /></button>
                        <button className="p-1 hover:text-white"><ChevronRight className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <p className="text-[10px] text-cyan-400 font-bold mb-2">Noviembre de 2026</p>

                    <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => (
                        <span key={idx} className="font-bold text-slate-500 py-0.5">{day}</span>
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected = dayNum === selectedCalendarDay;
                        return (
                          <button
                            key={dayNum}
                            onClick={() => setSelectedCalendarDay(dayNum)}
                            className={`py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' 
                                : 'text-slate-300 hover:bg-slate-800/80'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-slate-500 mt-2 text-center truncate">
                      Día {selectedCalendarDay}: Clases regulares y tutorías activas.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white mb-0.5">Accesos rápidos</h3>
                      <p className="text-[10px] text-slate-400 mb-2">Herramientas y secciones frecuentes</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setActiveMenu('calificaciones')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[9px] font-bold text-slate-300">Resultados</span>
                      </button>

                      <button
                        onClick={() => setActiveMenu('cursos')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[9px] font-bold text-slate-300">Mis cursos</span>
                      </button>

                      <button
                        onClick={() => setActiveMenu('marketplace')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[9px] font-bold text-slate-300">Marketplace</span>
                      </button>

                      <button
                        onClick={() => setActiveMenu('asistencia')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-bold text-slate-300">Asistencia</span>
                      </button>

                      <button
                        onClick={() => setActiveMenu('billing')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[9px] font-bold text-slate-300">Facturación</span>
                      </button>

                      <button
                        onClick={() => setActiveMenu('configuracion')}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-300">Ajustes</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white mb-0.5">Resumen de rendimiento</h3>
                      <p className="text-[10px] text-slate-400 mb-1">Distribución de resultados publicados</p>
                    </div>

                    {(() => {
                      const allGrades = [
                        ...topicGrades.map(g => g.grade),
                        ...studentGradedSubmissions.map(s => s.grade || 0)
                      ];
                      const hasGrades = allGrades.length > 0;
                      const avgOverallGrade = hasGrades
                        ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
                        : 0;
                      const excellentCount = allGrades.filter(g => g >= 85).length;
                      const goodCount = allGrades.filter(g => g >= 70 && g < 85).length;
                      const excellentPct = hasGrades ? Math.round((excellentCount / allGrades.length) * 100) : 0;
                      const goodPct = hasGrades ? Math.round((goodCount / allGrades.length) * 100) : 0;
                      const dashOffset = hasGrades ? 94.2 - (94.2 * avgOverallGrade) / 100 : 94.2;

                      return (
                        <>
                          <div className="flex items-center justify-center my-1">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="15"
                                  className="text-slate-800"
                                  strokeWidth="3.5"
                                  stroke="currentColor"
                                  fill="none"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="15"
                                  className={hasGrades ? "text-cyan-400" : "text-slate-700"}
                                  strokeWidth="3.5"
                                  strokeDasharray="94.2"
                                  strokeDashoffset={dashOffset}
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="none"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-black text-white">{hasGrades ? `${avgOverallGrade}%` : '0%'}</span>
                                <span className="text-[8px] text-slate-400">{hasGrades ? 'Promedio' : 'Sin notas'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Excelente (≥85)
                              </span>
                              <span className="font-bold text-white">{hasGrades ? `${excellentPct}%` : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                Bueno (≥70)
                              </span>
                              <span className="font-bold text-white">{hasGrades ? `${goodPct}%` : '—'}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}

            {/* ============================================================ */}
            {/* VIEW 2: PERFIL DEL ESTUDIANTE (Req 6: Completo con Carnet QR) */}
            {/* ============================================================ */}
            {activeMenu === 'perfil' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Perfil Académico del Estudiante</h2>
                    <p className="text-xs text-slate-400">Carnet digital oficial, datos personales y contacto de emergencia.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profileData.isEditing ? (
                      <button
                        onClick={handleSaveProfile}
                        className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Cambios</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setProfileData(prev => ({ ...prev, isEditing: true }))}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Editar Perfil</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left: Carnet Digital Oficial con Código QR (Requested by user) */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071738] via-[#051128] to-[#030918] border-2 border-cyan-400/50 p-5 shadow-2xl text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full" />
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/aistudio/logo_7f87d68b.png"
                            alt="Logo PCA"
                            className="w-8 h-8 rounded-full border border-cyan-400/60"
                          />
                          <div>
                            <p className="text-xs font-black tracking-tight">PUNTA CANA ACADEMY</p>
                            <p className="text-[9px] text-cyan-300 font-bold tracking-widest uppercase">Carnet Digital Oficial</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ACTIVO
                        </span>
                      </div>

                      {/* Photo & Main Info */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-cyan-400/60 shadow-md shrink-0 bg-slate-900 flex items-center justify-center">
                          {profileData.avatarUrl ? (
                            <img
                              src={profileData.avatarUrl}
                              alt="Estudiante"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-cyan-950 text-cyan-400 font-black text-lg">
                              {(profileData.displayName || student.displayName || 'ES').substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-white truncate">{profileData.displayName || student.displayName || 'Estudiante'}</h3>
                          <p className="text-[10px] text-cyan-300 font-mono">ID: PCA-{student.uid ? student.uid.substring(0, 4).toUpperCase() : '2026'}-ST</p>
                          <p className="text-[10px] text-slate-300 truncate">{profileData.academicLevel || 'Estudiante Regular'}</p>
                          <p className="text-[9px] text-slate-400">Sede Friusa & Online</p>
                        </div>
                      </div>

                      {/* QR Code and Barcode */}
                      <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 text-slate-900 mb-3 shadow-inner">
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-500">Acceso Campus Friusa</p>
                          <p className="text-xs font-black font-mono">PCA-{student.uid ? student.uid.substring(0, 4).toUpperCase() : '8842'}-VALID</p>
                          <p className="text-[8px] text-slate-400">Vence: Noviembre 2027</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-950 p-1 rounded-lg flex items-center justify-center shrink-0">
                          <QrCode className="w-10 h-10 text-cyan-400" />
                        </div>
                      </div>

                      <div className="text-[9px] text-slate-400 text-center border-t border-slate-800/80 pt-2">
                        Plaza Doña Bélgica, Local L5, Friusa, Punta Cana
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-cyan-500/30">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Subir Foto de Carnet</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUploadStudentAvatar}
                        />
                      </label>
                      <button
                        onClick={() => triggerToast('¡Descargando Carnet Oficial en formato digital HD!')}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/80"
                      >
                        <Printer className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Informacion Personal, Academica y Contacto de Emergencia */}
                  <div className="lg:col-span-2 space-y-3">
                    
                    {/* Datos Personales */}
                    <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Información Personal</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.displayName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.displayName}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Documento / Cédula</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.documentId}
                              onChange={(e) => setProfileData(prev => ({ ...prev, documentId: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.documentId}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Correo Institucional</label>
                          <p className="font-semibold text-cyan-300">{profileData.email}</p>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.phone}</p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400 block mb-1">Dirección en Punta Cana</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.address}
                              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.address}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contacto de Emergencia (Confirmed in user interview) */}
                    <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-rose-400" />
                        <span>Contacto de Emergencia</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Nombre</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.emergencyContact}
                              onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.emergencyContact}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Parentesco</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.emergencyRelation}
                              onChange={(e) => setProfileData(prev => ({ ...prev, emergencyRelation: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.emergencyRelation}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Teléfono</label>
                          {profileData.isEditing ? (
                            <input
                              type="text"
                              value={profileData.emergencyPhone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          ) : (
                            <p className="font-semibold text-white">{profileData.emergencyPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informacion Academica */}
                    <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Historial Académico</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Estado</p>
                          <p className="font-bold text-emerald-400">
                            {studentEnrolledCoursesList.length > 0 ? 'Regular Activo' : 'Pendiente de Curso'}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Promedio</p>
                          <p className="font-bold text-cyan-400">
                            {realAverageGrade > 0 ? `${realAverageGrade} / 100` : '--'}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Cursos Matriculados</p>
                          <p className="font-bold text-white">{studentEnrolledCoursesList.length}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <p className="text-[10px] text-slate-400">Evaluaciones</p>
                          <p className="font-bold text-white">{studentGradedSubmissions.length}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 3: MIS CURSOS (Req 4: Pagina Dedicada de Cursos Inscritos) */}
            {/* ============================================================ */}
            {activeMenu === 'cursos' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-black text-white">Mis Cursos Matriculados</h2>
                    <p className="text-xs text-slate-400">Gestiona tus programas activos, revisa lecciones y continúa tu aprendizaje.</p>
                  </div>
                  <button
                    onClick={() => setActiveMenu('marketplace')}
                    className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Inscribirse a Nuevo Curso (Marketplace)</span>
                  </button>
                </div>

                {studentEnrolledCoursesList.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#060c1c] border border-cyan-500/20 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-base font-black text-white">No tienes cursos matriculados todavía</h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        Explora el catálogo de cursos de Punta Cana Academy o elige un programa del Marketplace para comenzar tu formación profesional con clases en vivo y laboratorios en Friusa.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveMenu('marketplace')}
                      className="btn-gradient-cyan px-5 py-2.5 rounded-xl text-slate-950 text-xs font-black shadow-lg inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Explorar Catálogo de Cursos</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentEnrolledCoursesList.map((course) => {
                      const isCourseLive = Boolean(
                        classroomSession?.isLive && (
                          classroomSession.courseId === course.id || 
                          classroomSession.courseId === course.slug ||
                          classroomSession.courseTitle?.toLowerCase() === course.title?.toLowerCase() ||
                          (classroomSession.courseTitle && course.title && (
                            course.title.toLowerCase().includes(classroomSession.courseTitle.toLowerCase()) ||
                            classroomSession.courseTitle.toLowerCase().includes(course.title.toLowerCase())
                          ))
                        )
                      );


                      return (
                        <div 
                          key={course.id}
                          className={`p-4 rounded-2xl bg-[#060c1c] border transition-all flex flex-col justify-between space-y-3 ${
                            isCourseLive ? 'border-red-500/70 shadow-lg shadow-red-500/20' : 'border-cyan-500/30'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="relative h-36 rounded-xl overflow-hidden">
                              <img
                                src={course.coverImage}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                                {course.category}
                              </div>
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-slate-950">
                                En Curso
                              </div>

                              {/* Course-Specific Live Indicator (Requirement 15) */}
                              {isCourseLive && (
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white shadow-md flex items-center gap-1.5 animate-pulse">
                                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                  <span>EN VIVO AHORA</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-white">{course.title}</h3>
                              <p className="text-[11px] text-slate-400 mt-1">Docente: {course.instructor}</p>
                              <p className="text-[10px] text-cyan-400 mt-0.5">Horario: {course.schedule}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <button
                              onClick={() => {
                                if (onOpenCurriculum) {
                                  onOpenCurriculum(course.id, course.title);
                                } else {
                                  setViewingCurriculumCourse({ id: course.id, title: course.title });
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                              title="Estudiar unidades y temas interactivos con videos, diapositivas y quizzes"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Unidades & Temas</span>
                            </button>
                            {isCourseLive ? (
                              <button
                                onClick={() => onEnterClassroom(course.title)}
                                className="px-4 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 bg-gradient-to-r from-red-600 to-rose-600 text-white animate-pulse hover:scale-102 transition-transform"
                                title="El docente está transmitiendo en vivo en este momento"
                              >
                                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                <span>Unirse a Clase en Vivo</span>
                              </button>
                            ) : (
                              <div
                                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-800/60 border border-slate-700/60 text-slate-400 flex items-center gap-1.5 shrink-0 select-none"
                                title="El profesor no ha iniciado transmisión para este curso"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                <span>Clase Offline</span>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 4: MARKETPLACE DE CURSOS (Req 5: 1-Clic Inscripcion)     */}
            {/* ============================================================ */}
            {activeMenu === 'marketplace' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-black text-white">Marketplace Oficial de Cursos</h2>
                    <p className="text-xs text-slate-400">Inscríbete a nuevas especializaciones con tarifas y beneficios preferenciales para alumnos.</p>
                  </div>
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                    Inscripción Rápida 1-Clic
                  </span>
                </div>

                {/* Categories Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['Todos', 'Idiomas', 'Tecnología', 'Inteligencia Artificial', 'Turismo y Hotelería'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMarketplaceCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                        marketplaceCategory === cat
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {allCatalogCourses
                    .filter(c => marketplaceCategory === 'Todos' || c.category === marketplaceCategory)
                    .map((course) => {
                      const isEnrolled = student.enrolledCourses?.includes(course.id) || student.enrolledCourses?.includes(course.title);
                      return (
                        <div 
                          key={course.id}
                          className="rounded-2xl bg-[#060c1c] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
                        >
                          <div className="relative h-32 overflow-hidden">
                            <img
                              src={course.coverImage}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-cyan-300 backdrop-blur-xs">
                              {course.category}
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/90 text-slate-950 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </div>

                          <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-white line-clamp-1">{course.title}</h3>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                                <span>{course.duration}</span>
                                <span>•</span>
                                <span>{course.level}</span>
                                <span>•</span>
                                <span className="text-cyan-400">Certificación Oficial</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[10px] text-slate-500 block">Cuota mensual</span>
                                <span className="text-sm font-black text-cyan-300">{course.priceMonthly || '$39 USD'}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setShowSyllabusModal(course)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  Temario
                                </button>
                                {isEnrolled ? (
                                  <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                    Inscrito
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleEnrollMarketplaceCourse(course)}
                                    className="btn-gradient-cyan px-3 py-1.5 rounded-lg text-slate-950 text-[11px] font-black shadow-md hover:scale-102 transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>Inscribirme</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 5: CALIFICACIONES (Req 6)                                */}
            {/* ============================================================ */}
            {activeMenu === 'calificaciones' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Récord de Calificaciones</h2>
                    <p className="text-xs text-slate-400">Desglose de notas, evaluaciones prácticas y promedios oficiales.</p>
                  </div>
                  <button
                    onClick={() => triggerToast('¡Descargando Certificado de Calificaciones Oficial en PDF!')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Descargar Récord Oficial (PDF)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Promedio Ponderado</p>
                    <p className="text-2xl font-black text-cyan-400 mt-1">
                      {realAverageGrade > 0 ? `${realAverageGrade} / 100` : '-- / 100'}
                    </p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      {realAverageGrade >= 90 
                        ? 'Nivel de Excelencia Académica' 
                        : realAverageGrade >= 80 
                        ? 'Nivel Satisfactorio Aprobatorio' 
                        : 'Sin evaluaciones calificadas'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Evaluaciones Realizadas</p>
                    <p className="text-2xl font-black text-white mt-1">
                      {studentGradedSubmissions.length}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {studentGradedSubmissions.length > 0 ? 'Entregas calificadas por el profesor' : '0 entregas evaluadas'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Estado de Certificación</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {studentEnrolledCoursesList.length > 0 ? 'En Curso' : 'Pendiente'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Requisito mínimo 80/100 para titulación</p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#060c1c] border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Curso</th>
                        <th className="p-3">Evaluación / Práctica</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3 text-right">Nota</th>
                        <th className="p-3 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {studentGradedSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            <Award className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
                            <p className="text-xs font-semibold text-slate-300">No hay calificaciones registradas todavía</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Cuando envíes tus prácticas y tu profesor las evalúe en su libreta docente, tus notas oficiales aparecerán aquí en tiempo real.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        studentGradedSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-white">{sub.courseTitle}</td>
                            <td className="p-3">{sub.topicTitle}</td>
                            <td className="p-3 text-slate-400">Práctica Entregada</td>
                            <td className="p-3 text-right font-black text-emerald-400">{sub.grade} / 100</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (sub.grade || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {(sub.grade || 0) >= 80 ? 'Aprobado' : 'Revisión'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Entregas Prácticas Sincronizadas con Libreta Docente */}
                <div className="rounded-xl bg-[#060c1c] border border-cyan-500/30 overflow-hidden shadow-lg p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <span>Prácticas & Tareas Evaluadas por el Profesor</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Notas y comentarios pedagógicos asignados directamente por el docente en su libreta de calificaciones.
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                      {liveSubmissions.length} entregas registradas
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {liveSubmissions.map((sub) => (
                      <div key={sub.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xs text-white">{sub.topicTitle}</h4>
                            <p className="text-[11px] text-cyan-400">{sub.courseTitle} • {sub.submittedAt}</p>
                          </div>
                          <div>
                            {sub.status === 'graded' ? (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                Calificación: {sub.grade} / 100
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                                Por Calificar por Docente
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Tu entrega:</span>
                          <p className="italic text-slate-200 text-xs">"{sub.submissionText}"</p>
                          {sub.attachmentName && (
                            <p className="text-[10px] text-cyan-400 mt-1 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Adjunto: {sub.attachmentName}</span>
                            </p>
                          )}
                        </div>

                        {sub.teacherFeedback && (
                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">
                              Retroalimentación del Profesor:
                            </span>
                            <p className="mt-0.5 text-xs leading-relaxed">{sub.teacherFeedback}</p>
                            {sub.gradedAt && (
                              <span className="text-[9px] text-emerald-400 block mt-1 font-mono">{sub.gradedAt}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 6: ASISTENCIA (Req 6)                                    */}
            {/* ============================================================ */}
            {activeMenu === 'asistencia' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Control de Asistencia</h2>
                    <p className="text-xs text-slate-400">Registro de presencialidad en Sede Friusa y asistencia al Aula Virtual.</p>
                  </div>
                  <button
                    onClick={() => setShowJustifyModal(true)}
                    className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Solicitar Justificación</span>
                  </button>
                </div>

                {(() => {
                  const totalAttendances = attendanceHistory.length;
                  const presentCount = attendanceHistory.filter(a => a.status === 'Presente').length;
                  const globalPct = totalAttendances > 0 ? Math.round((presentCount / totalAttendances) * 100) : 0;
                  const friusaRecords = attendanceHistory.filter(a => a.modality?.toLowerCase().includes('presencial') || a.modality?.toLowerCase().includes('friusa'));
                  const virtualRecords = attendanceHistory.filter(a => !a.modality?.toLowerCase().includes('presencial'));

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                          <p className="text-[10px] text-slate-400">Asistencia Global</p>
                          <p className="text-2xl font-black text-cyan-400 mt-1">{totalAttendances > 0 ? `${globalPct}%` : '0%'}</p>
                          <p className="text-[10px] text-emerald-400">
                            {totalAttendances > 0
                              ? (globalPct >= 80 ? 'Requisito mínimo 80% cumplido' : 'Por debajo del mínimo requerido')
                              : 'Sin registros de asistencia aún'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                          <p className="text-[10px] text-slate-400">Sede Presencial Friusa</p>
                          <p className="text-2xl font-black text-white mt-1">{friusaRecords.length}</p>
                          <p className="text-[10px] text-slate-400">Plaza Doña Bélgica, Local L5</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#060c1c] border border-slate-800">
                          <p className="text-[10px] text-slate-400">Aula Virtual Online</p>
                          <p className="text-2xl font-black text-white mt-1">{virtualRecords.length}</p>
                          <p className="text-[10px] text-slate-400">Transmisiones en vivo asistidas</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#060c1c] border border-slate-800 overflow-hidden">
                        {totalAttendances === 0 ? (
                          <div className="p-8 text-center space-y-2">
                            <UserCheck className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
                            <h4 className="text-xs font-bold text-white">No hay registros de asistencia todavía</h4>
                            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                              Tus asistencias se computarán automáticamente en tiempo real al ingresar a las clases en vivo del Aula Virtual o cuando el profesor confirme tu asistencia en la sede.
                            </p>
                          </div>
                        ) : (
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                              <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Curso</th>
                                <th className="p-3">Modalidad</th>
                                <th className="p-3">Hora</th>
                                <th className="p-3 text-center">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                              {attendanceHistory.map((att) => (
                                <tr key={att.id} className="hover:bg-slate-900/50">
                                  <td className="p-3 font-semibold">{att.date}</td>
                                  <td className="p-3 text-white font-bold">{att.courseTitle}</td>
                                  <td className="p-3 text-cyan-400">{att.modality}</td>
                                  <td className="p-3 font-mono">{att.time}</td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      att.status === 'Presente' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                                    }`}>
                                      {att.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  );
                })()}

                {/* Historial de Justificantes Sincronizados en Tiempo Real */}
                <div className="rounded-xl bg-[#060c1c] border border-cyan-500/30 overflow-hidden shadow-lg space-y-2 p-3 sm:p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>Historial de Justificantes de Inasistencia</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Estado de tus solicitudes de inasistencia revisadas por el profesor en tiempo real.
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                      {liveJustifications.length} solicitudes
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {liveJustifications.map((just) => (
                      <div key={just.id} className="py-3 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{just.classDate}</span>
                            <span className="text-cyan-400 font-medium">• {just.courseTitle}</span>
                          </div>
                          <div>
                            {just.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span>Pendiente de Revisión por el Docente</span>
                              </span>
                            )}
                            {just.status === 'approved' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Aprobada por el Docente</span>
                              </span>
                            )}
                            {just.status === 'rejected' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
                                <X className="w-3 h-3 text-rose-400" />
                                <span>Rechazada por el Docente</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 italic">
                          "{just.reason}"
                        </p>

                        {just.documentProofName && (
                          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400">
                            <FileText className="w-3 h-3" />
                            <span>Comprobante: <strong>{just.documentProofName}</strong></span>
                          </div>
                        )}

                        {just.teacherNotes && (
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-[11px] text-cyan-200 mt-1">
                            <strong className="text-white block text-[10px] font-bold">Nota del Profesor Encargado:</strong>
                            <p className="mt-0.5 leading-relaxed">{just.teacherNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 7: EXÁMENES (Req 6)                                       */}
            {/* ============================================================ */}
            {activeMenu === 'examenes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Exámenes & Evaluaciones</h2>
                    <p className="text-xs text-slate-400">Pruebas programadas, cuestionarios en línea y simuladores de certificación.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSimulatorStep('intro');
                      setShowExamSimulatorModal(true);
                    }}
                    className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>Iniciar Simulador de Práctica</span>
                  </button>
                </div>

                {studentEnrolledCoursesList.length === 0 ? (
                  <div className="p-8 rounded-xl bg-[#060c1c] border border-slate-800 text-center space-y-3">
                    <FileQuestion className="w-10 h-10 text-cyan-400 mx-auto opacity-70" />
                    <h3 className="text-sm font-bold text-white">No tienes evaluaciones activas</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Inscríbete en los cursos de Punta Cana Academy para acceder a los simuladores de certificación oficial y cuestionarios de cada unidad didáctica.
                    </p>
                    <button
                      onClick={() => setActiveMenu('marketplace')}
                      className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 text-xs font-black shadow-md inline-flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explorar Cursos</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-xl bg-[#060c1c] border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Simulador de Certificación PCA
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Disponible 24/7
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white">
                        {primaryCourseTitle || 'Simulador de Evaluación Oficial'}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Prueba tus conocimientos con el simulador interactivo de evaluación con cronómetro, preguntas de selección múltiple y retroalimentación pedagógica instantánea.
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Modalidad:</span>
                          <span className="text-white font-bold">Simulación con Temporizador</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Preguntas:</span>
                          <span className="text-white font-bold">Banco de Reactivos PCA</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Puntaje mínimo de aprobación:</span>
                          <span className="text-cyan-400 font-bold">80 / 100</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSimulatorStep('intro');
                          setShowExamSimulatorModal(true);
                        }}
                        className="w-full btn-gradient-cyan py-2 rounded-xl text-slate-950 font-black text-xs shadow-md cursor-pointer"
                      >
                        Abrir Simulador de Examen
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Historial de Cuestionarios Completados
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {topicGrades.length} registros
                        </span>
                      </div>

                      {topicGrades.length === 0 ? (
                        <div className="p-6 rounded-lg bg-slate-900/40 border border-slate-800/80 text-center space-y-1.5">
                          <FileText className="w-6 h-6 text-slate-600 mx-auto" />
                          <p className="text-xs font-semibold text-slate-300">Aún no has completado cuestionarios</p>
                          <p className="text-[10px] text-slate-500">
                            Al finalizar cada tema o unidad en el reproductor de clases, podrás resolver el cuestionario y tu nota aparecerá aquí.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {topicGrades.map((g) => (
                            <div key={g.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                              <div className="min-w-0 pr-2">
                                <p className="text-xs font-bold text-white truncate">{g.topicTitle}</p>
                                <p className="text-[10px] text-cyan-400 truncate">{g.courseTitle} • {g.date}</p>
                              </div>
                              <span className={`text-sm font-black shrink-0 ${g.grade >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {g.grade} / 100
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 8: CALENDARIO ACADÉMICO (Req 6)                          */}
            {/* ============================================================ */}
            {activeMenu === 'calendario' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Calendario Académico Oficial</h2>
                    <p className="text-xs text-slate-400">Fechas de clases en Friusa, sesiones virtuales, exámenes y entregas.</p>
                  </div>
                  <button
                    onClick={() => triggerToast('¡Calendario de Punta Cana Academy sincronizado con tu cuenta!')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sincronizar con Google Calendar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-xs font-bold text-cyan-400 mb-2">Noviembre 2026</p>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                        <span key={i} className="font-bold text-slate-500 py-1 text-[10px]">{d}</span>
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = day === selectedCalendarDay;
                        const hasScheduledClass = !!scheduledClassDays[day];
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedCalendarDay(day)}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span>{day}</span>
                            {hasScheduledClass && (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-400'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Eventos para el Día {selectedCalendarDay} de Noviembre 2026
                    </h3>
                    <div className="space-y-2">
                      {studentEnrolledCoursesList.length === 0 ? (
                        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                          <CalendarIcon className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
                          <h4 className="text-xs font-bold text-white">No tienes clases en vivo programadas todavía</h4>
                          <p className="text-[11px] text-slate-400">
                            Matricúlate en un curso para visualizar aquí los días y horarios fijados por tu profesor y unirte al aula virtual.
                          </p>
                          <button
                            onClick={() => setActiveMenu('marketplace')}
                            className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 text-xs font-black shadow-md inline-flex items-center gap-1.5 cursor-pointer mt-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Ver Cursos Disponibles</span>
                          </button>
                        </div>
                      ) : scheduledClassDays[selectedCalendarDay] ? (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                                Clase Agendada
                              </span>
                              <span className="text-[10px] text-slate-400">{scheduledClassDays[selectedCalendarDay].time}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{scheduledClassDays[selectedCalendarDay].courseTitle}</h4>
                            <p className="text-[11px] text-slate-400">Aula Virtual interactiva en vivo con pase de lista</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => onEnterClassroom(scheduledClassDays[selectedCalendarDay].courseTitle)}
                              className="btn-gradient-cyan px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs cursor-pointer shadow-md"
                            >
                              Entrar al Aula
                            </button>
                            <button
                              onClick={() => handleRemoveCalendarDay(selectedCalendarDay)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer transition-colors border border-rose-500/30"
                              title="Quitar clase de este día"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                          <p className="text-xs text-slate-300">
                            No tienes ninguna clase agendada específicamente para el <strong>{selectedCalendarDay} de Noviembre</strong>.
                          </p>
                          <div className="p-3 rounded-lg bg-[#060c1c] border border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                              Agendar sesión para este día:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <select
                                value={calendarSelectedCourse || studentEnrolledCoursesList[0]?.title || ''}
                                onChange={(e) => setCalendarSelectedCourse(e.target.value)}
                                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                              >
                                {studentEnrolledCoursesList.map((c) => (
                                  <option key={c.id} value={c.title}>{c.title}</option>
                                ))}
                              </select>
                              <select
                                value={calendarSelectedTime}
                                onChange={(e) => setCalendarSelectedTime(e.target.value)}
                                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                              >
                                <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM (Noche)</option>
                                <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM (Tarde)</option>
                                <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM (Mañana)</option>
                              </select>
                            </div>
                            <button
                              onClick={() => handleSaveCalendarDay(
                                selectedCalendarDay,
                                calendarSelectedCourse || studentEnrolledCoursesList[0]?.title || '',
                                calendarSelectedTime
                              )}
                              className="btn-gradient-cyan px-3.5 py-1.5 rounded-lg text-slate-950 font-black text-xs cursor-pointer shadow-md inline-flex items-center gap-1.5"
                            >
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span>Fijar Clase en Este Día</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 9: TABLÓN DE ANUNCIOS (Req 6)                            */}
            {/* ============================================================ */}
            {activeMenu === 'anuncios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Tablón de Anuncios Oficiales</h2>
                    <p className="text-xs text-slate-400">Comunicaciones de la Dirección Académica y avisos importantes.</p>
                  </div>
                  <button
                    onClick={() => triggerToast('¡Todos los anuncios han sido marcados como leídos!')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Marcar leídos
                  </button>
                </div>

                {(() => {
                  const relevantAnnouncements = liveAnnouncements.filter(a =>
                    !a.courseId || enrolledCourseIds.has(a.courseId) || enrolledCourseIds.has(a.courseTitle)
                  );

                  if (relevantAnnouncements.length === 0) {
                    return (
                      <div className="p-8 rounded-xl bg-[#060c1c] border border-slate-800 text-center space-y-2">
                        <Bell className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
                        <h4 className="text-xs font-bold text-white">No hay anuncios oficiales en este momento</h4>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                          Los comunicados oficiales de la Dirección Académica y de tus profesores asignados se publicarán aquí en tiempo real cuando sean emitidos.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {relevantAnnouncements.map((anc) => (
                        <div
                          key={anc.id}
                          className={`p-4 rounded-xl bg-[#060c1c] border space-y-2 ${
                            anc.priority === 'urgent' ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-cyan-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 text-xs font-bold">
                                {anc.courseTitle ? anc.courseTitle.substring(0, 2).toUpperCase() : 'PC'}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">{anc.courseTitle || 'Punta Cana Academy'}</p>
                                <p className="text-[9px] text-cyan-300">Dirección Docente</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {anc.priority === 'urgent' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  URGENTE
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{anc.createdAt}</span>
                            </div>
                          </div>
                          <h3 className="text-xs font-bold text-white">{anc.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{anc.content}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 10: DESCARGAS & CERTIFICADOS (Req 6)                     */}
            {/* ============================================================ */}
            {activeMenu === 'descargas' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white">Descargas & Documentación Oficial</h2>
                  <p className="text-xs text-slate-400">Material de apoyo pedagógico, libros digitales y certificados con validez internacional.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-cyan-500/30 space-y-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Certificado en Proceso
                    </span>
                    <h3 className="text-sm font-bold text-white">Certificado Oficial: Inglés Bilingüe & Inmersión</h3>
                    <p className="text-xs text-slate-300">Avalado con firma oficial de la Directora Daysi Polanco y código de verificación QR.</p>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-[11px] text-slate-400">
                      ID Certificación: PCA-CERT-2026-9912
                    </div>
                    <button
                      onClick={() => triggerToast('¡Generando vista previa del Certificado Oficial en PDF!')}
                      className="w-full btn-gradient-cyan py-2 rounded-xl text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Diploma Oficial (PDF)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Guías y Materiales de Apoyo</h3>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Guía Oficial de Inglés para Hotelería VIP</p>
                          <p className="text-[10px] text-slate-400">PDF • 4.8 MB</p>
                        </div>
                        <button 
                          onClick={() => triggerToast('¡Descargando Guía Oficial de Inglés VIP!')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Manual Frontend, React & Tailwind CSS</p>
                          <p className="text-[10px] text-slate-400">PDF • 6.2 MB</p>
                        </div>
                        <button 
                          onClick={() => triggerToast('¡Descargando Manual Frontend!')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 11: FEEDBACK (Req 6)                                     */}
            {/* ============================================================ */}
            {activeMenu === 'feedback' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white">Feedback & Sugerencias</h2>
                  <p className="text-xs text-slate-400">Tu opinión es fundamental para mantener la excelencia educativa de Punta Cana Academy.</p>
                </div>

                <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#060c1c] border border-cyan-500/30 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Calificación General de la Academia
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-5 h-5 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">{feedbackRating} de 5 Estrellas</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Escribe tu sugerencia o evaluación
                    </label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Cuéntanos sobre tus profesores, la plataforma o las clases en Friusa..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!feedbackText.trim()) {
                        alert('Por favor escribe tu comentario antes de enviar.');
                        return;
                      }
                      setFeedbackText('');
                      triggerToast('¡Gracias! Tu feedback ha sido enviado directamente a la Dirección.');
                    }}
                    className="w-full btn-gradient-cyan py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-md cursor-pointer"
                  >
                    Enviar Feedback a la Dirección
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 12: FACTURACIÓN / BILLING (Req 8: Historial y Recibos)   */}
            {/* ============================================================ */}
            {activeMenu === 'billing' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Facturación & Pagos</h2>
                    <p className="text-xs text-slate-400">Revisa tu plan activo, historial de facturas y descarga recibos oficiales.</p>
                  </div>
                  <button
                    onClick={() => setActiveMenu('configuracion')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Gestionar Formas de Pago
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-cyan-500/30">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Plan Actual</p>
                    <p className="text-base font-black text-white mt-1">Prueba 12 Días Gratuita</p>
                    <p className="text-[10px] text-emerald-400 mt-1">{daysLeft} días restantes de acceso completo</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Próximo Cobro</p>
                    <p className="text-base font-black text-cyan-400 mt-1">$39.00 USD</p>
                    <p className="text-[10px] text-slate-400 mt-1">Fecha: 14 de Noviembre de 2026</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Estado de Cuenta</p>
                    <p className="text-base font-black text-emerald-400 mt-1">Al Día</p>
                    <p className="text-[10px] text-slate-400 mt-1">0 facturas pendientes</p>
                  </div>
                </div>

                {/* Historial de Facturas (Confirmed in user interview - Requirement 19: Purge mock data) */}
                <div className="rounded-xl bg-[#060c1c] border border-slate-800 overflow-hidden">
                  <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Facturas y Recibos</h3>
                    <span className="text-[10px] text-slate-400">Total: {invoices.length} recibos emitidos</span>
                  </div>
                  {invoices.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 space-y-2">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-300">No hay facturas ni recibos emitidos</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Tus comprobantes de pago de cursos y suscripciones oficiales aparecerán registrados aquí automáticamente.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/40 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Factura #</th>
                          <th className="p-3">Fecha</th>
                          <th className="p-3">Concepto</th>
                          <th className="p-3">Método</th>
                          <th className="p-3">Monto</th>
                          <th className="p-3 text-center">Estado</th>
                          <th className="p-3 text-right">Recibo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {invoices.map((inv: any) => (
                          <tr key={inv.id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-mono font-bold text-cyan-300">{inv.id}</td>
                            <td className="p-3">{inv.date}</td>
                            <td className="p-3 text-white font-medium">{inv.concept}</td>
                            <td className="p-3 text-slate-400">{inv.method}</td>
                            <td className="p-3 font-mono font-bold text-emerald-400">{inv.amount}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => triggerToast(`¡Descargando Recibo Oficial ${inv.id} en PDF!`)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-400 cursor-pointer"
                              >
                                PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* VIEW 13: CONFIGURACIÓN (Req 7: Cuenta, Formas de Pago, etc.)  */}
            {/* ============================================================ */}
            {activeMenu === 'configuracion' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white">Configuración de la Cuenta</h2>
                  <p className="text-xs text-slate-400">Administra tus formas de pago, seguridad y preferencias de notificación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Formas de Pago Guardadas */}
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Formas de Pago Guardadas</span>
                      </h3>
                      <button
                        onClick={() => setShowAddCardModal(true)}
                        className="btn-gradient-cyan px-2.5 py-1 rounded-lg text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {savedCards.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                          <p className="text-xs text-slate-300">No tienes métodos de pago guardados.</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Al inscribirte a un curso podrás registrar tu tarjeta o cuenta preferida.</p>
                        </div>
                      ) : (
                        savedCards.map((card) => (
                          <div key={card.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <CreditCard className="w-4 h-4 text-cyan-400" />
                              <div>
                                <p className="text-xs font-bold text-white">{card.brand} •••• {card.last4}</p>
                                <p className="text-[10px] text-slate-400">Vence: {card.expiry}</p>
                              </div>
                            </div>
                            {card.isDefault && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                Principal
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Seguridad y Passkey */}
                  <div className="p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seguridad & Acceso</span>
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2">
                        <p className="font-bold text-white">Cambiar Contraseña</p>
                        <input
                          type="password"
                          placeholder="Nueva contraseña..."
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                        <button
                          onClick={() => triggerToast('¡Contraseña actualizada correctamente!')}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Actualizar Contraseña
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preferencias de Notificaciones */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-[#060c1c] border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Canales de Notificación</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <label className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer">
                        <span>Avisos por WhatsApp</span>
                        <input
                          type="checkbox"
                          checked={settingsToggles.whatsappNotifications}
                          onChange={(e) => setSettingsToggles(prev => ({ ...prev, whatsappNotifications: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4"
                        />
                      </label>
                      <label className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer">
                        <span>Resumen por Email</span>
                        <input
                          type="checkbox"
                          checked={settingsToggles.emailDigest}
                          onChange={(e) => setSettingsToggles(prev => ({ ...prev, emailDigest: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4"
                        />
                      </label>
                      <label className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer">
                        <span>Recordatorio 15m antes</span>
                        <input
                          type="checkbox"
                          checked={settingsToggles.classReminders}
                          onChange={(e) => setSettingsToggles(prev => ({ ...prev, classReminders: e.target.checked }))}
                          className="accent-cyan-500 w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODALS: SYLLABUS, EXAM SIMULATOR, ADD CARD, JUSTIFY           */}
      {/* ============================================================ */}

      {/* 1. Modal Temario Completo */}
      {showSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#070e1c] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Temario Oficial</span>
                <h3 className="text-sm font-black text-white">{showSyllabusModal.title}</h3>
              </div>
              <button 
                onClick={() => setShowSyllabusModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {showSyllabusModal.syllabus && showSyllabusModal.syllabus.length > 0 ? (
                showSyllabusModal.syllabus.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                      <span>{item.module}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.duration}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                      {item.topics.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Temario estructurado disponible en la clase en vivo.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSyllabusModal(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const title = showSyllabusModal.title;
                  setShowSyllabusModal(null);
                  onEnterClassroom(title);
                }}
                className="btn-gradient-cyan px-4 py-1.5 rounded-lg text-xs font-black text-slate-950 cursor-pointer"
              >
                Entrar al Aula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Simulador de Examen */}
      {showExamSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#070e1c] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Simulador de Examen de Práctica</h3>
              </div>
              <button onClick={() => setShowExamSimulatorModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {simulatorStep === 'intro' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p>Este simulador evalúa vocabulario hotelero VIP y atención a huéspedes en inglés en condiciones reales.</p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <p>• 3 Preguntas de opción múltiple.</p>
                  <p>• Puntuación calculada automáticamente.</p>
                  <p>• No penaliza tu récord oficial.</p>
                </div>
                <button
                  onClick={() => setSimulatorStep('quiz')}
                  className="w-full btn-gradient-cyan py-2 rounded-xl text-slate-950 font-black text-xs cursor-pointer"
                >
                  Comenzar Evaluación Ahora
                </button>
              </div>
            )}

            {simulatorStep === 'quiz' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-white">1. How should a concierge respond when a guest asks for a restaurant recommendation?</p>
                  {[
                    "I recommend our oceanfront grill, I'd be delighted to reserve a table for you.",
                    "Look at Google Maps, there are many places outside.",
                    "We only serve breakfast, nothing else."
                  ].map((ans, idx) => (
                    <label key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                      <input
                        type="radio"
                        name="q1"
                        checked={quizAnswers[1] === idx}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, 1: idx }))}
                        className="accent-cyan-500"
                      />
                      <span>{ans}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-white">2. What is the polite phrase to acknowledge a guest complaint?</p>
                  {[
                    "I sincerely apologize for the inconvenience, let me resolve this immediately.",
                    "It is not my fault, talk to the manager.",
                    "Wait 30 minutes please."
                  ].map((ans, idx) => (
                    <label key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                      <input
                        type="radio"
                        name="q2"
                        checked={quizAnswers[2] === idx}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, 2: idx }))}
                        className="accent-cyan-500"
                      />
                      <span>{ans}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const score = (quizAnswers[1] === 0 ? 50 : 0) + (quizAnswers[2] === 0 ? 50 : 0);
                    setQuizScore(score);
                    setSimulatorStep('result');
                  }}
                  className="w-full btn-gradient-cyan py-2 rounded-xl text-slate-950 font-black text-xs cursor-pointer"
                >
                  Finalizar & Ver Calificación
                </button>
              </div>
            )}

            {simulatorStep === 'result' && (
              <div className="space-y-3 text-center py-2">
                <Award className="w-12 h-12 text-cyan-400 mx-auto" />
                <h4 className="text-base font-black text-white">¡Simulación Completada!</h4>
                <p className="text-2xl font-black text-emerald-400 font-mono">{quizScore} / 100</p>
                <p className="text-xs text-slate-300">
                  {quizScore && quizScore >= 80 
                    ? '¡Excelente! Demuestras un alto dominio de inglés hotelero para resorts de lujo.' 
                    : 'Buen intento. Te recomendamos repasar la Unidad 1 en el Aula Virtual.'}
                </p>
                <button
                  onClick={() => setShowExamSimulatorModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Cerrar Simulador
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Modal Solicitar Justificación Conectado en Tiempo Real */}
      {showJustifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSendJustification} className="w-full max-w-md bg-[#070e1c] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-3">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Gestión Académica</span>
              <h3 className="text-sm font-black text-white mt-0.5">Solicitar Justificación de Inasistencia</h3>
              <p className="text-[11px] text-slate-400">
                Tu solicitud será enviada directamente al profesor encargado para su aprobación en tiempo real.
              </p>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Materia / Curso</label>
                <select 
                  value={justifyCourse}
                  onChange={(e) => setJustifyCourse(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                >
                  <option value="Inglés Bilingüe & Inmersión para Hotelería y Negocios">Inglés Bilingüe & Inmersión para Hotelería y Negocios</option>
                  <option value="Desarrollo Web Full Stack con React, Node & TypeScript">Desarrollo Web Full Stack con React, Node & TypeScript</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Fecha de la clase</label>
                  <input 
                    type="date" 
                    value={justifyDate}
                    onChange={(e) => setJustifyDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Motivo</label>
                  <select 
                    value={justifyReason}
                    onChange={(e) => setJustifyReason(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="Horario laboral hotelero">Horario laboral hotelero</option>
                    <option value="Causa médica / Salud">Causa médica / Salud</option>
                    <option value="Fuerza mayor / Emergencia">Fuerza mayor / Emergencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Explicación para el Profesor</label>
                <textarea 
                  rows={2} 
                  required
                  value={justifyExplanation}
                  onChange={(e) => setJustifyExplanation(e.target.value)}
                  placeholder="Ej. Turno extraordinario en recepción de hotel por arribo de vuelo tardío..." 
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed text-xs" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Nombre del Comprobante / Constancia</label>
                <input 
                  type="text" 
                  value={justifyProofName}
                  onChange={(e) => setJustifyProofName(e.target.value)}
                  placeholder="Ej. Constancia_RRHH_Hotel.pdf" 
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setShowJustifyModal(false)} 
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gradient-cyan px-4 py-1.5 rounded-lg text-xs font-black text-slate-950 cursor-pointer shadow-md hover:scale-102 transition-all"
              >
                Enviar al Profesor Encargado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3.5. Modal Entregar Tarea / Práctica Sincronizada */}
      {showTaskSubmitModal && selectedTaskForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSendTaskSubmission} className="w-full max-w-lg bg-[#070e1c] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Entrega Académica</span>
                <h3 className="text-sm font-black text-white mt-0.5">{selectedTaskForSubmit.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedTaskForSubmit.courseTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTaskSubmitModal(false);
                  setSelectedTaskForSubmit(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <p className="text-[11px] text-slate-300 font-semibold">{selectedTaskForSubmit.description}</p>
              {selectedTaskForSubmit.rubric && (
                <p className="text-[10px] text-slate-400 italic">Rúbrica: {selectedTaskForSubmit.rubric}</p>
              )}
              <div className="flex items-center gap-3 text-[10px] pt-1 text-slate-400 border-t border-slate-800">
                <span>Vence: <strong className="text-amber-300 font-mono">{selectedTaskForSubmit.dueDate}</strong></span>
                <span>Puntaje: <strong className="text-cyan-400 font-mono">{selectedTaskForSubmit.points} pts</strong></span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Respuesta, Guión o Enlace de tu Entrega</label>
                <textarea
                  rows={4}
                  required
                  value={taskSubmissionText}
                  onChange={(e) => setTaskSubmissionText(e.target.value)}
                  placeholder="Escribe tu diálogo en inglés, resumen del caso, o pega el enlace a tu ejercicio/grabación..."
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Archivo Adjunto o Nombre de Documento (Opcional)</label>
                <input
                  type="text"
                  value={taskAttachmentName}
                  onChange={(e) => setTaskAttachmentName(e.target.value)}
                  placeholder="Ej. CheckIn_Dialogue_AudioScript_Nardo.docx"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowTaskSubmitModal(false);
                  setSelectedTaskForSubmit(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gradient-cyan px-4 py-1.5 rounded-lg text-xs font-black text-slate-950 cursor-pointer shadow-md hover:scale-102 transition-all"
              >
                Enviar Entrega al Profesor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Modal Agregar Forma de Pago */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleAddPaymentCard} className="w-full max-w-md bg-[#070e1c] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Agregar Forma de Pago</h3>
            <p className="text-xs text-slate-400">Tus datos están protegidos con cifrado de grado bancario.</p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Número de Tarjeta</label>
                <input
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Vencimiento (MM/AA)</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gradient-cyan px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 cursor-pointer"
              >
                Guardar Tarjeta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Live Alert Popup for Enrolled Student */}
      {classroomSession?.isLive && showLivePopupAlert && studentEnrolledCoursesList.some(c => 
        c.id === classroomSession.courseId || 
        c.slug === classroomSession.courseId ||
        c.title?.toLowerCase() === classroomSession.courseTitle?.toLowerCase() ||
        (classroomSession.courseTitle && c.title && (
          c.title.toLowerCase().includes(classroomSession.courseTitle.toLowerCase()) ||
          classroomSession.courseTitle.toLowerCase().includes(c.title.toLowerCase())
        ))
      ) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#030914] border-2 border-red-500 rounded-2xl p-4 shadow-2xl text-white shadow-red-500/30 animate-fadeIn">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
                EN VIVO AHORA
              </span>
            </div>
            <button
              onClick={() => setShowLivePopupAlert(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white leading-tight">
            ¡{classroomSession.teacherName} está transmitiendo en vivo!
          </h4>
          <p className="text-xs text-cyan-300 mt-1 font-semibold line-clamp-1">
            {classroomSession.courseTitle}
          </p>
          {classroomSession.topicTitle && (
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              Tema: {classroomSession.topicTitle}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setShowLivePopupAlert(false);
                onEnterClassroom(classroomSession.courseTitle || primaryCourseTitle);
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Unirse a la Clase en Vivo</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
