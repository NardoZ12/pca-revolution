import React, { useState, useEffect, useRef } from 'react';
import { 
  InstructorProfile, 
  TeacherCourse, 
  TeacherTopic, 
  StudentTaskSubmission, 
  AbsenceJustification, 
  TeacherAnnouncement, 
  PayoutTransaction,
  LiveTask,
  LiveClassroomSession
} from '../../types/instructor.ts';
import { 
  getStoredInstructor, 
  saveStoredInstructor,
  getStoredTeacherCourses,
  saveStoredTeacherCourses,
  getStoredSubmissions,
  getStoredJustifications,
  getStoredTeacherAnnouncements,
  getStoredPayouts,
  saveStoredPayouts
} from '../../data/instructorData.ts';
import { 
  saveNewPublishedCourse, 
  deletePublishedCourse, 
  duplicatePublishedCourse, 
  OFFICIAL_COURSE_CATEGORIES, 
  OFFICIAL_COURSE_MODALITIES, 
  Course 
} from '../../data/coursesData.ts';
import {
  subscribeToTasks,
  subscribeToSubmissions,
  subscribeToJustifications,
  subscribeToAnnouncements,
  subscribeToClassroomSession,
  createLiveTask,
  gradeStudentSubmission,
  reviewStudentJustification,
  createTeacherAnnouncement,
  updateClassroomSession,
  sendClassroomChatMessage
} from '../../lib/syncService.ts';
import { 
  getRobustCameraStream, 
  stopCameraStreamSafely 
} from '../../lib/webrtcHelper.ts';
import { Logo } from '../Logo.tsx';
import { CourseCurriculumPlayer } from '../CourseCurriculumPlayer.tsx';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck, 
  CalendarCheck, 
  Video, 
  Megaphone, 
  DollarSign, 
  UserCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy,
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Sliders, 
  Eye, 
  Send, 
  Download, 
  Upload, 
  FileText, 
  Presentation, 
  X, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Menu, 
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building,
  CreditCard,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  MessageSquare,
  Award,
  Bot,
  HelpCircle,
  ChevronRight,
  Layers,
  MapPin,
  Play,
  Info,
  Star,
  Radio,
  Disc,
  Volume2,
  Lock,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  onSwitchToStudentPortal: () => void;
  instructor?: InstructorProfile | null;
}

type TeacherTab = 
  | 'overview' 
  | 'courses' 
  | 'create_course'
  | 'gradebook' 
  | 'attendance' 
  | 'classroom' 
  | 'announcements' 
  | 'finances' 
  | 'profile';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onLogout,
  onBackToHome,
  onSwitchToStudentPortal,
  instructor: propInstructor,
}) => {
  // Navigation & Compact Zoom State (Matching StudentDashboard scale & density)
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [zoomScale, setZoomScale] = useState<number>(0.85); // 85% default zoom
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [instructor, setInstructor] = useState<InstructorProfile>(() => {
    return propInstructor || getStoredInstructor();
  });
  const [courses, setCourses] = useState<TeacherCourse[]>(() => getStoredTeacherCourses());
  const [submissions, setSubmissions] = useState<StudentTaskSubmission[]>(() => getStoredSubmissions());
  const [justifications, setJustifications] = useState<AbsenceJustification[]>(() => getStoredJustifications());
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>(() => getStoredTeacherAnnouncements());
  const [payouts, setPayouts] = useState<PayoutTransaction[]>(() => getStoredPayouts());

  // Toast helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<StudentTaskSubmission | null>(null);
  const [selectedJustificationForReview, setSelectedJustificationForReview] = useState<AbsenceJustification | null>(null);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Course Preview, Deletion, Live Broadcast Setup (Requirements 10, 12, 14, 16, 22, 23)
  const [previewingCourse, setPreviewingCourse] = useState<TeacherCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<TeacherCourse | null>(null);
  const [isLiveSetupModalOpen, setIsLiveSetupModalOpen] = useState(false);
  const [selectedLiveCourseId, setSelectedLiveCourseId] = useState<string>('');
  const [liveSectionName, setLiveSectionName] = useState<string>('');
  const [showLiveConfirmDialog, setShowLiveConfirmDialog] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [payoutPaypalEmail, setPayoutPaypalEmail] = useState('');

  // Teacher Assistant Chatbot Modal state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatbotMessages, setChatbotMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente Pedagógico de Punta Cana Academy. Estoy aquí para ayudarte a estructurar tus cursos, redactar rúbricas de evaluación, generar preguntas para quizzes o responder tus dudas sobre pagos y clases virtuales. ¿En qué te puedo colaborar hoy?',
      time: 'Ahora'
    }
  ]);
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);

  // Grade review form
  const [reviewGradeInput, setReviewGradeInput] = useState<number>(95);
  const [reviewFeedbackInput, setReviewFeedbackInput] = useState<string>('');

  // Course creator & editor state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [thumbnailTab, setThumbnailTab] = useState<'upload' | 'drive' | 'link'>('upload');
  const [thumbnailDriveInput, setThumbnailDriveInput] = useState('');
  const [videoTab, setVideoTab] = useState<'upload' | 'drive' | 'link'>('upload');
  const [videoDriveInput, setVideoDriveInput] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [topicDriveVideoInputs, setTopicDriveVideoInputs] = useState<Record<string, string>>({});
  const [topicVideoTabs, setTopicVideoTabs] = useState<Record<string, 'upload' | 'drive' | 'link'>>({});
  const [topicSlideTabs, setTopicSlideTabs] = useState<Record<string, 'upload' | 'drive'>>({});
  const [topicDriveSlideInputs, setTopicDriveSlideInputs] = useState<Record<string, string>>({});
  const [newCourseTitle, setNewCourseTitle] = useState('Inglés Hotelero y Atención al Huésped VIP');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState('Domina la comunicación con huéspedes de lujo y asciende en la industria turística');
  const [newCourseCategory, setNewCourseCategory] = useState('Lenguas & Idiomas Extranjeros');
  const [newCoursePrice, setNewCoursePrice] = useState<number>(29.99);
  const [newCourseLevel, setNewCourseLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Semanas (48 horas lectivas)');
  const [newCourseModality, setNewCourseModality] = useState<'Virtual' | 'Presencial en Friusa' | 'Semipresencial'>('Virtual');
  const [newCourseSchedule, setNewCourseSchedule] = useState('Martes y Jueves 7:00 PM - 9:00 PM');
  const [newCourseDesc, setNewCourseDesc] = useState('Aprende a comunicarte con soltura en los escenarios más exigentes de la hotelería 5 estrellas en Punta Cana: recepción, concierge, atención telefónica, resolución de quejas y venta sugestiva de servicios.');
  const [newCourseMethodology, setNewCourseMethodology] = useState('Clases prácticas interactivas con simulaciones de roles en vivo, retroalimentación personalizada, presentaciones multimedia y entregas evaluadas paso a paso.');
  const [newCourseGraduateProfile, setNewCourseGraduateProfile] = useState('El egresado estará capacitado para desempeñarse como Recepcionista Bilingüe, Agente de Concierge, Supervisor de Front Desk o Asistente de Huéspedes en resorts de lujo de Punta Cana, Bávaro y Cap Cana.');
  const [newCourseCertification, setNewCourseCertification] = useState('Certificado de Competencia Profesional avalado por Punta Cana Academy con código QR de verificación institucional');
  const [newCourseThumbnail, setNewCourseThumbnail] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80');
  const [newCourseExplanatoryVideo, setNewCourseExplanatoryVideo] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [courseStudioStep, setCourseStudioStep] = useState<number>(1);
  const [creationUnits, setCreationUnits] = useState([
    {
      id: 'u-1',
      title: 'Unidad 1: Bienvenida, Vocabulario y Check-in de Huéspedes',
      description: 'Fundamentos del saludo protocolar, términos hoteleros esenciales y registro inicial.',
      topics: [
        {
          id: 't-1-1',
          title: '1.1 Saludo VIP y primer contacto telefónico',
          durationMinutes: 45,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          slidesCount: 16,
          hasQuiz: true,
          hasPractice: true,
          practiceInstructions: 'Graba una nota de voz o sube un documento con el script de bienvenida para un huésped que llega a las 11:00 PM sin reservación confirmada.',
          practiceRubric: 'Cortesía y dicción (40%), Aplicación del protocolo (40%), Solución al problema (20%)'
        },
        {
          id: 't-1-2',
          title: '1.2 Procedimientos de Check-In y cobro de depósitos',
          durationMinutes: 50,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          slidesCount: 22,
          hasQuiz: true,
          hasPractice: true,
          practiceInstructions: 'Simulación de cobro con tarjeta internacional y explicación de las amenidades del resort.',
          practiceRubric: 'Claridad en términos financieros (50%), Explicación de amenidades (50%)'
        }
      ]
    },
    {
      id: 'u-2',
      title: 'Unidad 2: Asistencia de Concierge y Excursiones Locales',
      description: 'Recomendaciones de actividades turísticas en Punta Cana, traslados y reservas especiales.',
      topics: [
        {
          id: 't-2-1',
          title: '2.1 Orientación turística de la zona de Bávaro y Macao',
          durationMinutes: 40,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          slidesCount: 18,
          hasQuiz: true,
          hasPractice: true,
          practiceInstructions: 'Diseña un itinerario de 2 días para una familia con niños que se hospeda en Playa Bávaro.',
          practiceRubric: 'Pertinencia geográfica (50%), Calidad del itinerario (50%)'
        }
      ]
    },
    {
      id: 'u-3',
      title: 'Unidad 3: Manejo de Quejas e Incidencias Críticas (Exclusivo Pro Caribe)',
      description: 'Técnicas avanzadas de desescalamiento, compensaciones hoteleras y fidelización.',
      topics: [
        {
          id: 't-3-1',
          title: '3.1 Método HEAT para resolución de desacuerdos con huéspedes',
          durationMinutes: 60,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          slidesCount: 25,
          hasQuiz: true,
          hasPractice: true,
          practiceInstructions: 'Caso práctico de resolución: huésped con habitación no asignada en aniversario de bodas.',
          practiceRubric: 'Manejo de la objeción (40%), Empatía y cortesía (30%), Propuesta compensatoria (30%)'
        }
      ]
    }
  ]);

  // Announcement creator state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementCourseId, setAnnouncementCourseId] = useState(courses[0]?.id || 'ingles-bilingue-hoteleria');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'urgent'>('normal');

  // Task / Homework creator state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourseId, setNewTaskCourseId] = useState(courses[0]?.id || 'ingles-bilingue-hoteleria');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Mañana, 11:59 PM');
  const [newTaskRubric, setNewTaskRubric] = useState('Rigor conceptual (40%), aplicación práctica (40%), presentación (20%)');
  const [newTaskPoints, setNewTaskPoints] = useState<number>(100);
  const [tasks, setTasks] = useState<LiveTask[]>([]);

  // Payout request form - Req 5: Strictly PayPal or Bank Transfer
  const [payoutAmount, setPayoutAmount] = useState<number>(500);
  const [payoutBank, setPayoutBank] = useState('Transferencia Bancaria (Banco Popular Dominicano)');
  const [payoutAccount, setPayoutAccount] = useState('7984321098');

  // Virtual Classroom Host & WebRTC state
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveChatMessage, setLiveChatMessage] = useState('');
  const [liveChatList, setLiveChatList] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Nardo Zorrilla', text: 'Buenas tardes profesora Adeyri, listo para la clase.', time: '18:30' },
    { sender: 'Carla Méndez', text: 'Presente. Tengo el diálogo listo.', time: '18:31' },
  ]);

  // WebRTC refs
  const teacherVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Real-time synchronization subscriptions across Firestore and BroadcastChannel
  useEffect(() => {
    const unsubTasks = subscribeToTasks((liveTasks) => {
      setTasks(liveTasks);
    });

    const unsubSubs = subscribeToSubmissions((liveSubs) => {
      setSubmissions(liveSubs);
    });

    const unsubJusts = subscribeToJustifications((liveJusts) => {
      setJustifications(liveJusts);
    });

    const unsubAnns = subscribeToAnnouncements((liveAnns) => {
      setAnnouncements(liveAnns);
    });

    const unsubClass = subscribeToClassroomSession((session) => {
      setIsLiveActive(session.isLive);
      if (session.chatMessages && session.chatMessages.length > 0) {
        setLiveChatList(session.chatMessages.map(m => ({
          sender: m.sender + (m.role === 'teacher' ? ' (Docente)' : ''),
          text: m.text,
          time: m.time
        })));
      }
    });

    return () => {
      unsubTasks();
      unsubSubs();
      unsubJusts();
      unsubAnns();
      unsubClass();
    };
  }, []);

  const [isRealCamera, setIsRealCamera] = useState(false);

  // Auto-activate or re-bind camera whenever teacher navigates to the Classroom tab
  useEffect(() => {
    if (activeTab === 'classroom') {
      if (!mediaStreamRef.current) {
        startCameraStream();
      } else if (teacherVideoRef.current && isCamOn) {
        teacherVideoRef.current.srcObject = mediaStreamRef.current;
        teacherVideoRef.current.play().catch(() => {});
      }
    }
  }, [activeTab, isCamOn]);

  // Broadcast video frames from teacher's video/screen to student's classroom
  useEffect(() => {
    if (!isLiveActive || !isCamOn) return;
    const video = teacherVideoRef.current;
    if (!video) return;

    let streamChan: BroadcastChannel | null = null;
    let interval: any = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        streamChan = new BroadcastChannel('pca_teacher_stream');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        interval = setInterval(() => {
          if (video && video.videoWidth > 0 && video.videoHeight > 0 && ctx) {
            canvas.width = Math.min(640, video.videoWidth);
            canvas.height = Math.min(360, video.videoHeight);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
            streamChan?.postMessage({
              type: 'live_frame',
              frame: dataUrl,
              teacherName: instructor.displayName,
              isScreenSharing
            });
          }
        }, 120);
      }
    } catch (e) {
      console.warn('Broadcasting error:', e);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (streamChan) streamChan.close();
    };
  }, [isLiveActive, isCamOn, isScreenSharing, instructor.displayName]);


  // WebRTC Camera Stream Management with Guaranteed HD Video
  const startCameraStream = async () => {
    try {
      if (mediaStreamRef.current) {
        stopCameraStreamSafely(mediaStreamRef.current);
      }
      const result = await getRobustCameraStream(instructor.displayName, 'teacher');
      mediaStreamRef.current = result.stream;
      setIsRealCamera(result.isRealCamera);
      setIsCamOn(true);
      setIsMicOn(true);
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = result.stream;
        teacherVideoRef.current.play().catch(() => {});
      }
      showToast(result.isRealCamera ? '¡Cámara WebRTC del dispositivo encendida y activa!' : '¡Cámara HD conectada y transmitiendo en pantalla!');
    } catch (err) {
      console.warn('Error starting camera stream:', err);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      stopCameraStreamSafely(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }
    if (teacherVideoRef.current) {
      teacherVideoRef.current.srcObject = null;
    }
    setIsCamOn(false);
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !isMicOn));
    }
    setIsMicOn(!isMicOn);
    showToast(!isMicOn ? 'Micrófono activado.' : 'Micrófono silenciado.');
  };

  const toggleCam = async () => {
    if (isCamOn) {
      stopCameraStream();
      showToast('Cámara desactivada.');
    } else {
      await startCameraStream();
    }
  };

  // Screen share via getDisplayMedia
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (teacherVideoRef.current) {
            teacherVideoRef.current.srcObject = displayStream;
            teacherVideoRef.current.play().catch(() => {});
          }
          setIsScreenSharing(true);
          showToast('Compartiendo pantalla en el Aula Virtual.');
          displayStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (mediaStreamRef.current && teacherVideoRef.current) {
              teacherVideoRef.current.srcObject = mediaStreamRef.current;
            }
          };
        }
      } catch (err) {
        console.warn('Screen share cancelled', err);
      }
    } else {
      setIsScreenSharing(false);
      if (mediaStreamRef.current && teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = mediaStreamRef.current;
      }
      showToast('Compartición de pantalla detenida.');
    }
  };

  // Real class recording with MediaRecorder
  const startRecording = () => {
    if (!mediaStreamRef.current) {
      showToast('Por favor activa la cámara primero para iniciar la grabación.');
      return;
    }
    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(mediaStreamRef.current);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Grabacion_Clase_PCA_${new Date().toISOString().slice(0, 10)}.webm`;
        a.click();
        showToast('¡Grabación de la clase descargada exitosamente en formato WebM!');
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      showToast('● Grabando clase en vivo...');
    } catch (err) {
      console.warn('Recording error:', err);
      showToast('Grabador no soportado en este navegador.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Recording timer tick
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Live Broadcast Handlers (Requirements 12 & 16)
  const handleOpenStartLiveModal = (courseId?: string) => {
    const targetCourse = courses.find(c => c.id === courseId) || courses[0];
    setSelectedLiveCourseId(targetCourse?.id || '');
    setLiveSectionName('Sección 1: Sesión Práctica Interactiva');
    setShowLiveConfirmDialog(false);
    setIsLiveSetupModalOpen(true);
  };

  const handleConfirmStartLiveSession = async () => {
    const matchedCourse = courses.find(c => c.id === selectedLiveCourseId) || courses[0];
    if (!matchedCourse) {
      showToast('Por favor selecciona un curso para iniciar la clase.');
      return;
    }
    await startCameraStream();
    await updateClassroomSession({
      isLive: true,
      courseId: matchedCourse.id,
      courseTitle: matchedCourse.title,
      topicTitle: liveSectionName.trim() || matchedCourse.title,
      teacherName: instructor.displayName,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsLiveActive(true);
    setIsLiveSetupModalOpen(false);
    setShowLiveConfirmDialog(false);
    setActiveTab('classroom');
    showToast(`¡Clase en vivo iniciada para ${matchedCourse.title}!`);
  };

  // Toggle Live Broadcast
  const handleToggleLive = async () => {
    if (!isLiveActive) {
      handleOpenStartLiveModal(courses[0]?.id);
    } else {
      stopCameraStream();
      if (isRecording) stopRecording();
      await updateClassroomSession({
        isLive: false
      });
      setIsLiveActive(false);
      showToast('Clase virtual finalizada.');
    }
  };

  // Course duplication and deletion handlers (Requirement 10)
  const handleDuplicateCourse = (courseId: string) => {
    const duplicated = duplicatePublishedCourse(courseId);
    if (duplicated) {
      const nextTeacherCourse: TeacherCourse = {
        id: duplicated.id,
        title: duplicated.title,
        subtitle: duplicated.subtitle,
        category: duplicated.category,
        price: 29.99,
        status: 'published',
        enrolledStudentsCount: 0,
        rating: 5.0,
        thumbnail: duplicated.coverImage,
        description: duplicated.description,
        level: duplicated.level,
        proCaribeEligible: true,
        units: []
      };
      const updatedList = [nextTeacherCourse, ...courses];
      updateCoursesAndSave(updatedList);
      showToast(`¡Curso duplicado con éxito: "${duplicated.title}"!`);
    } else {
      showToast('Error al duplicar el curso.');
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    deletePublishedCourse(courseId);
    const updatedList = courses.filter(c => c.id !== courseId);
    updateCoursesAndSave(updatedList);
    setCourseToDelete(null);
    showToast('Curso eliminado correctamente de tu catálogo y plataforma.');
  };

  // Send classroom chat message
  const handleSendClassroomChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatMessage.trim()) return;
    const text = liveChatMessage.trim();
    setLiveChatMessage('');
    await sendClassroomChatMessage({
      sender: instructor.displayName,
      role: 'teacher',
      text
    });
  };

  // Save helpers
  const updateCoursesAndSave = (updated: TeacherCourse[]) => {
    setCourses(updated);
    saveStoredTeacherCourses(updated);
  };

  const updatePayoutsAndSave = (updated: PayoutTransaction[]) => {
    setPayouts(updated);
    saveStoredPayouts(updated);
  };

  // Grade submission and sync in REAL TIME with student dashboard (Requirements 25 & 30)
  const handleGradeSubmission = async (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    await gradeStudentSubmission(
      submissionId,
      reviewGradeInput,
      reviewFeedbackInput || '¡Excelente trabajo! Has demostrado dominio de los conceptos.'
    );
    // Sync with student's personal gradebook in localStorage
    if (sub) {
      try {
        const studentGradesKey = `pca_student_grades_${sub.studentId || 'nardo'}`;
        const existingGrades = JSON.parse(localStorage.getItem(studentGradesKey) || '[]');
        const updatedGrades = [
          {
            id: `grade_${Date.now()}`,
            courseId: sub.courseId,
            courseTitle: sub.courseTitle,
            topicTitle: sub.topicTitle,
            score: reviewGradeInput,
            feedback: reviewFeedbackInput || '¡Excelente trabajo! Has demostrado dominio de los conceptos.',
            date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
          },
          ...existingGrades.filter((g: any) => g.topicTitle !== sub.topicTitle)
        ];
        localStorage.setItem(studentGradesKey, JSON.stringify(updatedGrades));
        window.dispatchEvent(new Event('pca_grades_updated'));
      } catch (e) {}
    }
    setSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      grade: reviewGradeInput,
      teacherFeedback: reviewFeedbackInput || '¡Excelente trabajo!',
      status: (reviewGradeInput < 70 ? 'needs_revision' : 'graded') as any,
      gradedAt: 'Hoy a las ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : s));
    setSelectedSubmissionForReview(null);
    showToast('¡Calificación actualizada con éxito!');
  };

  // Review absence justification and sync in REAL TIME with student dashboard (Requirement 26)
  const handleReviewJustification = async (justId: string, status: 'approved' | 'rejected', notes: string) => {
    await reviewStudentJustification(justId, status, notes);
    setSelectedJustificationForReview(null);
    showToast(`Justificante ${status === 'approved' ? 'Aprobado' : 'Rechazado'} y sincronizado en tiempo real con el alumno.`);
  };

  // Create live task / assignment (Requirement 24)
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      showToast('Por favor escribe el título de la tarea.');
      return;
    }
    if (isAssigningTask) return;
    setIsAssigningTask(true);

    try {
      const matchedCourse = courses.find((c) => c.id === newTaskCourseId) || courses[0];
      await createLiveTask({
        courseId: matchedCourse?.id || 'ingles-bilingue-hoteleria',
        courseTitle: matchedCourse?.title || 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || 'Práctica evaluativa asignada por el profesor.',
        dueDate: newTaskDueDate || 'Mañana, 11:59 PM',
        rubric: newTaskRubric || 'Criterios de evaluación definidos por la cátedra.',
        points: Number(newTaskPoints) || 100,
        teacherId: instructor.uid,
        teacherName: instructor.displayName
      });

      setIsNewTaskModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      showToast('¡Tarea asignada con éxito! Aparece al instante en los pendientes del estudiante con notificación inmediata.');
    } finally {
      setIsAssigningTask(false);
    }
  };

  // Create announcement and broadcast (Requirement 28)
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      showToast('Por favor completa el título y contenido del anuncio.');
      return;
    }

    const matchedCourse = courses.find((c) => c.id === announcementCourseId) || courses[0];
    await createTeacherAnnouncement({
      courseId: matchedCourse?.id || 'ingles-bilingue-hoteleria',
      courseTitle: matchedCourse?.title || 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
      title: announcementTitle.trim(),
      content: announcementContent.trim(),
      priority: announcementPriority
    });

    setIsNewAnnouncementModalOpen(false);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    showToast('¡Aviso publicado con éxito y transmitido a todos los alumnos!');
  };

  // Helper to convert Google Drive link to direct image URL
  const convertDriveImageUrl = (raw: string) => {
    const match = raw.match(/\/d\/([a-zA-Z0-9_-]+)/) || raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return raw;
  };

  // Helper to convert Google Drive / YouTube link to embeddable video URL
  const convertVideoUrl = (raw: string) => {
    // Google Drive
    const driveMatch = raw.match(/\/d\/([a-zA-Z0-9_-]+)/) || raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    // YouTube
    const ytMatch = raw.match(/(?:watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return raw;
  };

  // Handle image upload from computer (FileReader -> Base64)
  const handleUploadThumbnailFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen es mayor a 5MB. Por favor sube una imagen más ligera.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewCourseThumbnail(reader.result);
        showToast('Foto cargada exitosamente desde tu computador.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle video upload from computer (Local Object URL / Blob)
  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setNewCourseExplanatoryVideo(objectUrl);
    showToast('Video promocional cargado con éxito desde tu computador.');
  };

  // Handle topic video upload from computer (FileReader -> ObjectUrl / Base64)
  const handleUploadTopicVideoFile = (uIdx: number, tIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const updated = [...creationUnits];
    updated[uIdx].topics[tIdx].videoUrl = objectUrl;
    setCreationUnits(updated);
    showToast(`Video de lección cargado para: ${updated[uIdx].topics[tIdx].title}`);
  };

  // Handle topic slides/document upload from computer
  const handleUploadTopicSlidesFile = (uIdx: number, tIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const count = files.length > 1 ? files.length : (creationUnits[uIdx].topics[tIdx].slidesCount || 10) + 5;
    const updated = [...creationUnits];
    updated[uIdx].topics[tIdx].slidesCount = count;
    setCreationUnits(updated);
    showToast(`Diapositivas y material didáctico cargados (${count} diapositivas registradas).`);
  };

  // Add topic to unit in course creation
  const handleAddTopicToCreationUnit = (uIdx: number) => {
    const updated = [...creationUnits];
    const unit = updated[uIdx];
    const nextNum = unit.topics.length + 1;
    const newTopic = {
      id: `t-${unit.id}-${Date.now()}`,
      title: `${uIdx + 1}.${nextNum} Nuevo Tema Didáctico`,
      durationMinutes: 45,
      videoUrl: '',
      slidesCount: 12,
      hasQuiz: true,
      hasPractice: true,
      practiceInstructions: 'Elabora un resumen o ejercicio práctico aplicando los conceptos de esta lección.',
      practiceRubric: 'Dominio conceptual (50%), Aplicación práctica (50%)'
    };
    unit.topics.push(newTopic);
    setCreationUnits(updated);
    setExpandedTopicId(newTopic.id);
    showToast('Nuevo tema añadido a la unidad.');
  };

  // Add new unit in course creation
  const handleAddCreationUnit = () => {
    const nextUnitNum = creationUnits.length + 1;
    const newUnit = {
      id: `u-${nextUnitNum}-${Date.now()}`,
      title: `Unidad ${nextUnitNum}: Nuevo Módulo Temático`,
      description: 'Objetivos de aprendizaje y competencias de este módulo.',
      topics: [
        {
          id: `t-${nextUnitNum}-1-${Date.now()}`,
          title: `${nextUnitNum}.1 Introducción a la Unidad`,
          durationMinutes: 40,
          videoUrl: '',
          slidesCount: 10,
          hasQuiz: true,
          hasPractice: true,
          practiceInstructions: 'Redacta un breve análisis sobre el caso de estudio propuesto.',
          practiceRubric: 'Calidad de argumentación (50%), Cumplimiento formal (50%)'
        }
      ]
    };
    setCreationUnits([...creationUnits, newUnit]);
    setExpandedTopicId(newUnit.topics[0].id);
    showToast(`Unidad ${nextUnitNum} creada exitosamente.`);
  };

  // Remove topic from unit
  const handleRemoveTopicFromCreationUnit = (uIdx: number, tIdx: number) => {
    const updated = [...creationUnits];
    if (updated[uIdx].topics.length <= 1) {
      showToast('Cada unidad debe tener al menos 1 tema.');
      return;
    }
    updated[uIdx].topics.splice(tIdx, 1);
    setCreationUnits(updated);
    showToast('Tema eliminado de la unidad.');
  };

  // Edit existing course or draft (Requirement 5)
  const handleStartEditCourse = (course: TeacherCourse) => {
    setEditingCourseId(course.id);
    setNewCourseTitle(course.title);
    setNewCourseSubtitle(course.subtitle || '');
    setNewCourseCategory(course.category);
    setNewCoursePrice(course.price || 29.99);
    setNewCourseLevel(course.level || 'Principiante');
    setNewCourseDuration(course.duration || '8 Semanas (48 horas lectivas)');
    setNewCourseModality('Virtual');
    setNewCourseSchedule(course.schedule || 'Martes y Jueves 7:00 PM - 9:00 PM');
    setNewCourseDesc(course.description || '');
    setNewCourseMethodology(course.methodology || 'Clases interactivas en vivo con simulaciones...');
    setNewCourseGraduateProfile(course.graduateProfile || 'El egresado dominará los estándares...');
    setNewCourseCertification(course.certification || 'Certificado Oficial Punta Cana Academy');
    setNewCourseThumbnail(course.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80');
    setNewCourseExplanatoryVideo(course.explanatoryVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    
    if (course.units && course.units.length > 0) {
      setCreationUnits(
        course.units.map((u) => ({
          id: u.id,
          title: u.title,
          description: u.description || '',
          topics: (u.topics || []).map((t) => ({
            id: t.id,
            title: t.title,
            durationMinutes: t.durationMinutes || 45,
            videoUrl: t.videoUrl || '',
            slidesCount: t.slidesCount || 10,
            hasQuiz: !!t.hasQuiz,
            hasPractice: !!t.hasPractice,
            practiceInstructions: t.practiceInstructions || '',
            practiceRubric: t.practiceRubric || '',
          })),
        }))
      );
    } else {
      setCreationUnits([
        {
          id: 'u-1',
          title: 'Unidad 1: Fundamentos y Conceptos Iniciales',
          description: 'Módulo introductorio del programa.',
          topics: [
            {
              id: 't-1-1',
              title: '1.1 Introducción y objetivos de la materia',
              durationMinutes: 45,
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              slidesCount: 15,
              hasQuiz: true,
              hasPractice: true,
              practiceInstructions: 'Realiza la práctica asignada.',
              practiceRubric: 'Evaluación de competencias (100%).'
            }
          ]
        }
      ]);
    }
    setExpandedTopicId(null);
    setCourseStudioStep(1);
    setActiveTab('create_course');
    showToast(`Editando borrador/curso: ${course.title}`);
  };

  // Reset form for fresh course creation
  const handleResetCourseForm = () => {
    setEditingCourseId(null);
    setNewCourseTitle('');
    setNewCourseSubtitle('');
    setNewCourseCategory('Lenguas & Idiomas Extranjeros (Inglés General, Francés, Alemán, Ruso, Italiano, Mandarín)');
    setNewCoursePrice(29.99);
    setNewCourseLevel('Principiante');
    setNewCourseDuration('8 Semanas (48 horas lectivas)');
    setNewCourseModality('Virtual');
    setNewCourseSchedule('Martes y Jueves 7:00 PM - 9:00 PM');
    setNewCourseDesc('');
    setNewCourseMethodology('Clases prácticas interactivas con simulaciones de roles en vivo...');
    setNewCourseGraduateProfile('El egresado estará capacitado para desempeñarse con solvencia...');
    setNewCourseCertification('Certificado de Competencia Profesional avalado por Punta Cana Academy con código QR de verificación institucional');
    setNewCourseThumbnail('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80');
    setNewCourseExplanatoryVideo('https://www.youtube.com/embed/dQw4w9WgXcQ');
    setCreationUnits([
      {
        id: 'u-1',
        title: 'Unidad 1: Introducción y Fundamentos de la Materia',
        description: 'Fundamentos iniciales y conceptos clave para el estudiante.',
        topics: [
          {
            id: 't-1-1',
            title: '1.1 Introducción y objetivos del programa',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            slidesCount: 15,
            hasQuiz: true,
            hasPractice: true,
            practiceInstructions: 'Realiza la práctica inicial asignada.',
            practiceRubric: 'Evaluación inicial de comprensión (100%).'
          }
        ]
      }
    ]);
    setCourseStudioStep(1);
  };

  // Create or Update course handler
  const handleCreateCourse = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      showToast('Por favor ingresa el título del curso.');
      return;
    }

    if (newCoursePrice < 10 || newCoursePrice > 500) {
      showToast('Por favor fija un precio válido entre $10.00 y $500.00 USD.');
      return;
    }

    const courseId = editingCourseId || ('curso-' + Date.now());
    const existing = courses.find((c) => c.id === courseId);

    const newCourse: TeacherCourse = {
      id: courseId,
      title: newCourseTitle.trim(),
      subtitle: newCourseSubtitle.trim(),
      category: newCourseCategory,
      price: Number(newCoursePrice),
      status: isDraft ? 'draft' : 'published',
      enrolledStudentsCount: existing ? existing.enrolledStudentsCount : 0,
      rating: existing ? existing.rating : 5.0,
      thumbnail: newCourseThumbnail,
      description: newCourseDesc.trim() || 'Curso creado por ' + instructor.displayName,
      methodology: newCourseMethodology.trim(),
      graduateProfile: newCourseGraduateProfile.trim(),
      certification: newCourseCertification.trim(),
      explanatoryVideoUrl: newCourseExplanatoryVideo.trim(),
      duration: newCourseDuration.trim(),
      modality: 'Virtual', // Locked to 100% Virtual (Requirement 7)
      schedule: newCourseSchedule.trim(),
      level: newCourseLevel,
      proCaribeEligible: true,
      units: creationUnits.map((u, uIdx) => ({
        id: u.id || `u-${Date.now()}-${uIdx}`,
        title: u.title,
        description: u.description,
        topics: u.topics.map((t, tIdx) => ({
          id: t.id || `t-${Date.now()}-${tIdx}`,
          title: t.title,
          durationMinutes: t.durationMinutes || 45,
          videoUrl: t.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          slidesCount: t.slidesCount || 15,
          hasQuiz: t.hasQuiz ?? true,
          hasPractice: t.hasPractice ?? true,
          practiceInstructions: t.practiceInstructions || 'Realiza la práctica asignada.',
          practiceRubric: t.practiceRubric || 'Evaluación de competencias (100%).',
        }))
      }))
    };

    let nextList: TeacherCourse[];
    if (editingCourseId) {
      nextList = courses.map((c) => (c.id === editingCourseId ? newCourse : c));
    } else {
      nextList = [newCourse, ...courses];
      const updatedProfile = {
        ...instructor,
        activeCoursesCount: instructor.activeCoursesCount + 1,
      };
      setInstructor(updatedProfile);
      saveStoredInstructor(updatedProfile);
    }
    updateCoursesAndSave(nextList);

    // Publish to public catalog immediately so students can view and enroll
    const categoryMap: Record<string, Course['category']> = {
      'Lenguas & Idiomas Extranjeros (Inglés General, Francés, Alemán, Ruso, Italiano, Mandarín)': 'Idiomas',
      'Inglés & Comunicación para Hotelería, Turismo y Servicio VIP': 'Idiomas',
      'Idiomas & Hotelería': 'Idiomas',
      'Tecnología, Programación Web & Software': 'Tecnología',
      'Tecnología & Programación': 'Tecnología',
      'Tecnología & Software': 'Tecnología',
      'Inteligencia Artificial, Automatización & Negocios Digitales': 'Inteligencia Artificial',
      'Inteligencia Artificial': 'Inteligencia Artificial',
      'Turismo, Hotelería de Lujo & Ecoturismo del Caribe': 'Turismo y Hotelería',
      'Turismo & Ecoturismo': 'Turismo y Hotelería',
      'Alimentos y Bebidas, Gastronomía, Cocina & Barismo': 'Turismo y Hotelería',
      'Administración, Finanzas, Contabilidad & Recursos Humanos': 'Liderazgo',
      'Marketing Digital, Redes Sociales & Creación de Contenido': 'Liderazgo',
      'Liderazgo, Oratoria, Ventas & Habilidades Blandas': 'Liderazgo',
      'Guía Turística, Animación & Operaciones de Excursiones': 'Turismo y Hotelería',
      'Salud, Bienestar, Spa & Primeros Auxilios': 'Turismo y Hotelería',
      'Arte, Fotografía, Diseño Gráfico & Producción Audiovisual': 'Tecnología',
      'Mantenimiento, Electricidad & Operaciones Técnicas': 'Tecnología',
      'Idiomas': 'Idiomas',
      'Tecnología': 'Tecnología',
      'Turismo y Hotelería': 'Turismo y Hotelería',
      'Liderazgo': 'Liderazgo'
    };

    const publicCourse: Course = {
      id: newCourse.id,
      slug: newCourse.id,
      title: newCourse.title,
      subtitle: newCourse.subtitle || 'Programa Oficial Punta Cana Academy',
      category: categoryMap[newCourse.category] || 'Turismo y Hotelería',
      instructor: instructor.displayName,
      instructorRole: instructor.specialty || 'Docente Titular',
      instructorAvatar: instructor.avatarUrl || '',
      level: newCourse.level,
      duration: newCourse.duration || '8 Semanas',
      schedule: newCourse.schedule || 'Martes y Jueves 7:00 PM - 9:00 PM',
      modality: '100% Virtual', // Requirement 7
      students: existing?.enrolledStudentsCount || 0,
      rating: 5.0,
      coverImage: newCourse.thumbnail,
      description: newCourse.description,
      longDescription: `${newCourse.description}\n\nMetodología: ${newCourse.methodology}\n\nPerfil del egresado: ${newCourse.graduateProfile}`,
      badge: isDraft ? 'Borrador' : 'Curso Oficial',
      highlights: [
        `Docente: ${instructor.displayName}`,
        'Clases interactivas y sesiones en vivo',
        'Certificación Oficial Punta Cana Academy'
      ],
      whatYouWillLearn: creationUnits.flatMap(u => u.topics.map(t => t.title)).slice(0, 4),
      syllabus: creationUnits.map((u) => ({
        module: u.title,
        duration: '2 Semanas',
        topics: u.topics.map(t => t.title),
      })),
      certification: newCourse.certification || 'Certificado Oficial Punta Cana Academy',
      priceMonthly: `$${Number(newCourse.price).toFixed(2)}`
    };
    saveNewPublishedCourse(publicCourse);

    // Create initial practice task for enrolled students
    const firstPractice = creationUnits.flatMap(u => u.topics).find(t => t.hasPractice);
    if (firstPractice) {
      createLiveTask({
        courseId: newCourse.id,
        courseTitle: newCourse.title,
        title: `${firstPractice.title} - Práctica`,
        description: firstPractice.practiceInstructions || 'Realiza la práctica asignada para este módulo.',
        dueDate: 'Próxima semana, 11:59 PM',
        rubric: firstPractice.practiceRubric || 'Evaluación de competencias (100%).',
        points: 100,
        teacherId: instructor.uid,
        teacherName: instructor.displayName
      }).catch(() => {});
    }

    setEditingCourseId(null);
    setIsNewCourseModalOpen(false);
    setActiveTab('courses');
    if (isDraft) {
      showToast('Borrador guardado exitosamente.');
    } else {
      showToast('¡Curso guardado y publicado en la plataforma y catálogo oficial!');
    }
  };

  // Payout request (Requirement 14: PayPal or Bank Transfer)
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > instructor.balanceAvailable) {
      showToast('Monto inválido o superior al balance disponible.');
      return;
    }

    const isPaypal = payoutBank.includes('PayPal');
    if (isPaypal && (!payoutPaypalEmail.trim() || !payoutPaypalEmail.includes('@'))) {
      showToast('Por favor escribe un correo electrónico de PayPal válido.');
      return;
    }
    if (!isPaypal && !payoutAccount.trim()) {
      showToast('Por favor escribe el número de cuenta bancaria.');
      return;
    }

    const ref = 'TX-RET-' + Math.floor(100000 + Math.random() * 900000);
    const newTx: PayoutTransaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: -payoutAmount,
      type: 'withdrawal',
      description: isPaypal 
        ? `Retiro vía PayPal (${payoutPaypalEmail.trim()})`
        : `Retiro vía ${payoutBank} (*${payoutAccount.slice(-4)})`,
      status: 'completed',
      receiptReference: ref,
    };

    const nextPayouts = [newTx, ...payouts];
    updatePayoutsAndSave(nextPayouts);

    const updatedProf = {
      ...instructor,
      balanceAvailable: Math.max(0, instructor.balanceAvailable - payoutAmount),
    };
    setInstructor(updatedProf);
    saveStoredInstructor(updatedProf);

    setIsPayoutModalOpen(false);
    showToast(`Retiro de $${payoutAmount.toFixed(2)} USD procesado correctamente. Ref: ${ref}`);
  };

  // Add topic to unit
  const handleAddTopicToCourse = (courseId: string, unitId: string) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          units: c.units.map((u) => {
            if (u.id === unitId) {
              const topicNum = u.topics.length + 1;
              const newTopic: TeacherTopic = {
                id: `t_${Date.now()}`,
                title: `${u.title.slice(0, 8)}.${topicNum} Nuevo Tema Didáctico`,
                durationMinutes: 45,
                slidesCount: 15,
                hasQuiz: true,
                hasPractice: true,
                practiceInstructions: 'Instrucciones para la práctica de este tema...',
              };
              return {
                ...u,
                topics: [...u.topics, newTopic],
              };
            }
            return u;
          })
        };
      }
      return c;
    });

    updateCoursesAndSave(updated);
    showToast('Nuevo tema didáctico agregado al temario.');
  };

  // Teacher Assistant AI Responses
  const handleSendChatbotMessage = (textToSend?: string) => {
    const query = textToSend || chatbotInput;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatbotMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatbotInput('');
    setIsChatbotTyping(true);

    setTimeout(() => {
      setIsChatbotTyping(false);
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('estructur') || q.includes('unidad') || q.includes('tema')) {
        reply = 'Te recomiendo estructurar tu curso en 3 a 5 Unidades temáticas, cada una con 3 a 4 temas de 30-45 minutos. Cada tema debe incluir: 1) Video tutorial o clase explicativa, 2) Presentación de diapositivas en PowerPoint o PDF descargable, 3) Un quiz de 2-4 preguntas para comprobar comprensión, y 4) Una práctica aplicada para calificar.';
      } else if (q.includes('rúbrica') || q.includes('rubrica') || q.includes('evalua')) {
        reply = 'Aquí tienes una rúbrica práctica estándar: 40% Aplicación de conceptos teóricos, 30% Claridad y estructura del entregable, 20% Originalidad y solución creativa, 10% Puntualidad y formato. Puedes pegarla en el campo de "Rúbrica de Práctica" al editar tus temas.';
      } else if (q.includes('quiz') || q.includes('pregunta')) {
        reply = 'Para quizzes efectivos, redacta preguntas con 4 opciones donde solo 1 sea correcta y las otras 3 sean distractores verosímiles pero erróneos. Asegúrate de fijar un mínimo de 75% de aprobación para que el estudiante desbloquee el tema siguiente.';
      } else if (q.includes('pago') || q.includes('banco') || q.includes('paypal') || q.includes('retir')) {
        reply = 'Los pagos se procesan de forma automática a través de PayPal o transferencias bancarias directas (Banco Popular, Banreservas, Banco BHD). Puedes ir a la pestaña de "Finanzas & Retiros" y presionar "Solicitar Retiro de Fondos" cuando alcances al menos $20 USD de balance disponible.';
      } else if (q.includes('pro caribe') || q.includes('bonificaci')) {
        reply = 'Los miembros del Plan Pro Caribe tienen acceso a tus cursos sin costo extra para ellos. Tú recibes Bonificaciones Mensuales acumuladas por darles seguimiento y ofrecer clases virtuales en vivo según tu horario. Se acreditan el día 1 de cada mes.';
      } else if (q.includes('vivo') || q.includes('clase') || q.includes('aula')) {
        reply = 'En la pestaña "Aula Virtual en Vivo" puedes iniciar tu clase con video HD, compartir tus diapositivas o pantalla, usar la pizarra y responder dudas en el chat. Al terminar, la asistencia de tus alumnos se registra de forma automática.';
      } else {
        reply = `Comprendo tu consulta sobre "${query}". Como profesor de Punta Cana Academy, cuentas con autonomía completa para fijar el precio de tus cursos, estructurar tus recursos didácticos y calificar a tus estudiantes. Si necesitas apoyo pedagógico adicional, nuestro equipo de coordinación docente está disponible en Sede Friusa y por WhatsApp.`;
      }

      setChatbotMessages(prev => [...prev, {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 700);
  };

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const pendingJustificationsCount = justifications.filter((j) => j.status === 'pending').length;

  // Full Course Preview & Curriculum Player (Requirement 23)
  if (previewingCourse) {
    return (
      <CourseCurriculumPlayer
        courseId={previewingCourse.id}
        courseTitle={previewingCourse.title}
        student={{
          uid: instructor.uid,
          displayName: instructor.displayName,
          email: instructor.email,
          role: 'instructor',
          plan: 'corporativo',
          enrolledCourses: [previewingCourse.id],
          attendanceRate: 100,
          averageGrade: 100,
          completedLessons: [],
          completedExams: 0,
          avatarUrl: instructor.avatarUrl
        }}
        onBackToDashboard={() => setPreviewingCourse(null)}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#020713] text-white flex flex-col font-sans select-none text-[13px]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header - Compact h-14, matching StudentDashboard header (Req 3: words never overlapping) */}
      <header className="h-14 border-b border-cyan-900/40 bg-[#030d1a] px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 z-30 box-border">
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Abrir menú"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Desktop collapse sidebar toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80 transition-colors cursor-pointer border border-cyan-950"
            title={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>

          <Logo size="sm" onClick={onBackToHome} />

          <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-cyan-900/50 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs text-white">Dashboard del Profesor</span>
            <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 font-semibold">
              Instructors Hub
            </span>
          </div>
        </div>

        {/* Center / Right controls - Compact & responsive */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          {/* Zoom controls - Exactly matching StudentDashboard functionality */}
          <div className="flex items-center rounded-lg bg-slate-900/90 border border-slate-700/80 p-0.5 text-[10px]">
            <button
              onClick={() => setZoomScale(0.70)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomScale === 0.70 ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista compacta al 70%"
            >
              70% Zoom
            </button>
            <button
              onClick={() => setZoomScale(0.85)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomScale === 0.85 ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista media al 85%"
            >
              85%
            </button>
            <button
              onClick={() => setZoomScale(1.0)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomScale === 1.0 ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista estándar al 100%"
            >
              100%
            </button>
          </div>

          {/* Teacher Assistant Chatbot Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-900 text-xs font-bold transition-all cursor-pointer"
            title="Abrir Asistente Pedagógico para Profesores"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Asistente PCA</span>
          </button>

          {/* Switch to Student Portal */}
          <button
            onClick={onSwitchToStudentPortal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-bold transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portal Estudiantes</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Sidebar + Scaled Content) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`h-full bg-[#030a16] border-r border-cyan-950/80 flex flex-col justify-between shrink-0 transition-all duration-200 z-20 ${
            isSidebarCollapsed ? 'w-16' : 'w-56 sm:w-60'
          } ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-60 shadow-2xl' : 'hidden md:flex'}`}
        >
          {/* Top navigation links */}
          <div className="p-2.5 space-y-1 overflow-y-auto">
            {/* Instructor badge */}
            {!isSidebarCollapsed && (
              <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/20 flex items-center gap-2.5">
                {instructor.avatarUrl ? (
                  <img
                    src={instructor.avatarUrl}
                    alt={instructor.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-black text-xs shrink-0">
                    {instructor.displayName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') || 'DOC'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-bold text-xs text-white truncate leading-tight">{instructor.displayName}</p>
                  <p className="text-[10px] text-cyan-400 truncate mt-0.5">{instructor.specialty}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Resumen General</span>}
            </button>

            <button
              onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Mis Cursos Creados</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded font-black border border-cyan-500/30">
                    {courses.length}
                  </span>
                </div>
              )}
            </button>

            {/* Req 1: Dedicated Course Creation Studio */}
            <button
              onClick={() => { handleResetCourseForm(); setActiveTab('create_course'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'create_course'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-cyan-400 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20'
              }`}
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Crear Curso</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                    activeTab === 'create_course' ? 'bg-slate-950 text-amber-300' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    Estudio
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('gradebook'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gradebook'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Revisión de Tareas</span>
                  {pendingSubmissionsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded font-black">
                      {pendingSubmissionsCount}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Asistencia & Faltas</span>
                  {pendingJustificationsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded font-black">
                      {pendingJustificationsCount}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('classroom'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Video className="w-4 h-4 shrink-0 text-cyan-400" />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Aula Virtual en Vivo</span>
                  {isLiveActive && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('announcements'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Tablón de Anuncios</span>}
            </button>

            <button
              onClick={() => { setActiveTab('finances'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'finances'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
              {!isSidebarCollapsed && <span>Finanzas & Retiros</span>}
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <UserCircle className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Perfil del Docente</span>}
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="p-2.5 border-t border-slate-900 space-y-1.5">
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              {!isSidebarCollapsed && <span>Asistente Pedagógico</span>}
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </aside>

        {/* Content Area with Applied Zoom Scaling (matches StudentDashboard compact visual density) */}
        <main 
          className="flex-1 h-full overflow-y-auto transition-all duration-200 bg-[#020713]"
          style={zoomScale !== 1.0 ? { zoom: zoomScale } : undefined}
        >
          <div className="p-3 sm:p-5 space-y-4 max-w-6xl mx-auto w-full">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Header Greeting - Compact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#041326] via-[#030d1a] to-[#020713] p-4 sm:p-5 rounded-2xl border border-cyan-500/20 shadow-lg">
                  <div>
                    <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Panel de Control Docente • Punta Cana Academy</span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-white">
                      ¡Bienvenido, {instructor.displayName}!
                    </h1>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Tus cursos están activos capacitando estudiantes en Bávaro-Punta Cana.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => { handleResetCourseForm(); setActiveTab('create_course'); }}
                      className="btn-gradient-cyan px-3.5 py-2 rounded-xl text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Curso</span>
                    </button>
                    <button
                      onClick={() => handleOpenStartLiveModal(courses[0]?.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-cyan-950/60 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Iniciar Aula</span>
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards - Compact density matching StudentDashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#040e1d] border border-cyan-500/20 rounded-2xl p-3.5 shadow-md">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Alumnos Activos</span>
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-1.5">{instructor.totalStudents}</p>
                    <p className="text-[10px] text-cyan-400/80 mt-0.5">Inscripciones vigentes</p>
                  </div>

                  <div className="bg-[#040e1d] border border-cyan-500/20 rounded-2xl p-3.5 shadow-md">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Balance Disponible</span>
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1.5">${instructor.balanceAvailable.toFixed(2)} USD</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Listo para retiro</p>
                  </div>

                  <div className="bg-[#040e1d] border border-cyan-500/20 rounded-2xl p-3.5 shadow-md">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Tareas por Calificar</span>
                      <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-1.5">{pendingSubmissionsCount}</p>
                    <p className="text-[10px] text-amber-400/80 mt-0.5">Entregas pendientes</p>
                  </div>

                  <div className="bg-[#040e1d] border border-cyan-500/20 rounded-2xl p-3.5 shadow-md">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Evaluación Docente</span>
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-1.5">{instructor.rating} / 5.0</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Calificación promedio</p>
                  </div>
                </div>

                {/* Submissions queue + Class schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Column 1 & 2: Submissions queue */}
                  <div className="lg:col-span-2 bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-white">Tareas Prácticas Pendientes</h3>
                        <p className="text-[11px] text-slate-400">Estudiantes esperando tu revisión para desbloquear su avance</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('gradebook')}
                        className="text-xs text-cyan-400 hover:underline font-bold"
                      >
                        Ver todas ({submissions.length})
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {submissions.length === 0 ? (
                        <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                          <ClipboardCheck className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
                          <p className="text-xs font-bold text-white">No hay tareas pendientes de revisión</p>
                          <p className="text-[11px] text-slate-400">
                            Cuando tus estudiantes suban sus entregas y proyectos prácticos, aparecerán aquí para evaluarlos y asignar notas.
                          </p>
                        </div>
                      ) : (
                        submissions.slice(0, 3).map((sub) => (
                          <div 
                            key={sub.id}
                            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                                alt={sub.studentName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-xs text-white">{sub.studentName}</p>
                                  {sub.status === 'pending' ? (
                                    <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
                                      Pendiente
                                    </span>
                                  ) : (
                                    <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                                      Nota: {sub.grade}/100
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-cyan-300 mt-0.5 truncate max-w-xs">{sub.topicTitle}</p>
                                <p className="text-[10px] text-slate-500">{sub.submittedAt}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedSubmissionForReview(sub);
                                setReviewGradeInput(sub.grade || 95);
                                setReviewFeedbackInput(sub.teacherFeedback || '');
                              }}
                              className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-black hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-center"
                            >
                              {sub.status === 'pending' ? 'Evaluar' : 'Editar Nota'}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 3: Live Class Card */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#06182c] to-[#040e1d] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Próxima Clase Virtual</span>
                      </div>
                      {courses.length === 0 ? (
                        <div>
                          <h4 className="text-sm font-black text-white">Programa tu Primera Clase Virtual</h4>
                          <p className="text-xs text-slate-300 mt-1">Sincronización WebRTC en Alta Definición</p>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                            Crea tu primer curso para impartir clases en vivo con video, pizarra interactiva y chat en tiempo real.
                          </p>
                          <button
                            onClick={() => setActiveTab('create_course')}
                            className="w-full mt-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-black hover:scale-101 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Crear Curso Ahora</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-black text-white">{courses[0]?.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{courses[0]?.schedule || 'Hoy a las 6:30 PM (Hora de Punta Cana)'}</p>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                            Participan alumnos matriculados y miembros del campus virtual.
                          </p>
                          <button
                            onClick={() => setActiveTab('classroom')}
                            className="w-full mt-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-black hover:scale-101 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Entrar al Aula</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Justifications quick alert */}
                    <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Justificaciones de Faltas</span>
                        </h4>
                        <span className="text-[10px] text-amber-400 font-bold">{pendingJustificationsCount} pendientes</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Alumnos han presentado comprobantes médicos y laborales.
                      </p>
                      <button
                        onClick={() => setActiveTab('attendance')}
                        className="w-full mt-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition-colors"
                      >
                        Revisar Justificantes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MIS CURSOS CREADOS & TEMARIOS */}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Mis Cursos Creados & Temarios</h2>
                    <p className="text-xs text-slate-400">
                      Gestiona unidades, lecciones, diapositivas, videos y evaluaciones.
                    </p>
                  </div>
                  <button
                    onClick={() => { handleResetCourseForm(); setActiveTab('create_course'); }}
                    className="btn-gradient-cyan px-3.5 py-2 rounded-xl text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Estudio de Creación de Cursos</span>
                  </button>
                </div>

                {/* Courses Grid or Empty State */}
                {courses.length === 0 ? (
                  <div className="bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                      <BookOpen className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base sm:text-lg font-black text-white">¡Comienza tu Trayectoria Docente!</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Aún no tienes cursos creados en tu perfil. Diseña tu primer programa académico con unidades, lecciones y prácticas reales. Al crearlo, se publicará de inmediato en el catálogo de Punta Cana Academy para que nuevos estudiantes puedan matricularse.
                      </p>
                    </div>
                    <button
                      onClick={() => { handleResetCourseForm(); setActiveTab('create_course'); }}
                      className="btn-gradient-cyan px-6 py-2.5 rounded-xl text-slate-950 text-xs font-black shadow-lg inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Mi Primer Curso Ahora</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <div 
                        key={course.id}
                        className="bg-[#040e1d] border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040e1d] via-transparent to-transparent" />
                            
                            <div className="absolute top-2.5 left-2.5 flex gap-2">
                              {course.status === 'published' ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                                  Publicado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Borrador</span>
                                </span>
                              )}
                            </div>

                            <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg text-cyan-300 text-xs font-black">
                              ${course.price.toFixed(2)} USD
                            </div>
                          </div>

                          <div className="p-4">
                            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">{course.category}</span>
                            <h3 className="text-sm font-black text-white mt-0.5 leading-snug">{course.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>

                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                              <span>{course.units.length} Unidades</span>
                              <span className="font-semibold text-cyan-400">{course.enrolledStudentsCount} Alumnos</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0 space-y-2.5">
                          {/* Units preview */}
                          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                              <span>Temario</span>
                              <button
                                onClick={() => handleAddTopicToCourse(course.id, course.units[0]?.id)}
                                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Añadir Tema</span>
                              </button>
                            </div>
                            {course.units.map((u) => (
                              <div key={u.id} className="text-[10px]">
                                <p className="font-semibold text-slate-300 truncate">{u.title}</p>
                                <div className="pl-2 mt-0.5 space-y-0.5">
                                  {u.topics.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between text-slate-400">
                                      <span className="truncate max-w-[180px]">• {t.title}</span>
                                      <span className="text-[9px] text-cyan-400/80">{t.durationMinutes}m</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Live & Task Assignment Actions (Requirement 22) */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleOpenStartLiveModal(course.id)}
                              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-101"
                              title="Iniciar clase virtual en vivo para este curso"
                            >
                              <Radio className="w-3.5 h-3.5 animate-pulse" />
                              <span>Clase en Vivo</span>
                            </button>
                            <button
                              onClick={() => {
                                setNewTaskCourseId(course.id);
                                setIsNewTaskModalOpen(true);
                              }}
                              className="py-2 px-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                              title="Asignar tarea evaluativa para este curso"
                            >
                              <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Asignar Tarea</span>
                            </button>
                          </div>

                          {/* Gestión del Curso: Editar, Duplicar, Vista Previa, Eliminar (Requisitos 2, 10, 23) */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
                            <button
                              onClick={() => handleStartEditCourse(course)}
                              className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                              title="Editar contenidos y estructura"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDuplicateCourse(course.id)}
                              className="py-2 px-2 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-amber-500/10"
                              title="Duplicar este curso con todo su contenido"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Duplicar</span>
                            </button>
                            <button
                              onClick={() => setPreviewingCourse(course)}
                              className="py-2 px-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                              title="Vista previa completa del temario y lecciones"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>Previa</span>
                            </button>
                            <button
                              onClick={() => setCourseToDelete(course)}
                              className="py-2 px-2 rounded-xl bg-rose-950/50 border border-rose-500/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-rose-500/20"
                              title="Eliminar este curso permanentemente"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Eliminar</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB DEDICADO: ESTUDIO DE CREACIÓN DE CURSOS (Req 1 & Req 2) */}
            {activeTab === 'create_course' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#06182c] via-[#041021] to-[#030a16] border border-cyan-500/30 p-4 sm:p-5 rounded-2xl shadow-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Estudio Oficial del Docente</span>
                      </span>
                      <span className="text-xs text-slate-400">• Marketplace Punta Cana Academy</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white">Estudio de Creación & Publicación de Cursos</h2>
                    <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                      Diseña la ficha integral de tu curso. Todos los datos configurados aquí alimentarán la página principal, el catálogo público y el aula virtual de tus estudiantes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
                    >
                      Volver a Cursos
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCreateCourse(e, true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                    >
                      Guardar Borrador
                    </button>
                  </div>
                </div>

                {/* Steps Segmented Navigation */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-[#030a16] p-1.5 rounded-xl border border-slate-800">
                  {[
                    { step: 1, label: '1. Ficha & Modalidad', icon: BookOpen },
                    { step: 2, label: '2. Metodología & Egresado', icon: GraduationCap },
                    { step: 3, label: '3. Portada & Video Trailer', icon: Presentation },
                    { step: 4, label: '4. Temario & Prácticas', icon: Layers },
                    { step: 5, label: '5. Precio & Vista Previa', icon: Sparkles },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isActive = courseStudioStep === item.step;
                    return (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setCourseStudioStep(item.step)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md font-black'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* STEP 1: FICHA Y MODALIDAD */}
                {courseStudioStep === 1 && (
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span>Paso 1: Identidad del Curso y Modalidad de Enseñanza</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Define el título comercial, subtítulo, duración y si las clases se impartirán en campus virtual o en nuestra sede física de Friusa.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Título */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Título Oficial del Curso <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          placeholder="Ej. Inglés Hotelero Bilingüe para Front Desk y Concierge"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Subtítulo */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Subtítulo Comercial / Propuesta de Valor <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCourseSubtitle}
                          onChange={(e) => setNewCourseSubtitle(e.target.value)}
                          placeholder="Ej. Domina la comunicación fluida con huéspedes VIP en resorts de lujo de Punta Cana"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Categoría (Requirement 6: OFFICIAL_COURSE_CATEGORIES) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Categoría Temática</label>
                        <select
                          value={newCourseCategory}
                          onChange={(e) => setNewCourseCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          {OFFICIAL_COURSE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Nivel */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Nivel de Dificultad</label>
                        <select
                          value={newCourseLevel}
                          onChange={(e) => setNewCourseLevel(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="Principiante">Principiante (Desde cero)</option>
                          <option value="Intermedio">Intermedio (Competencias previas)</option>
                          <option value="Avanzado">Avanzado (Especialización alta)</option>
                        </select>
                      </div>

                      {/* Modalidad Selector (Virtual activo, Presencial y Semipresencial bloqueados) - Req 7 */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-slate-300">
                            Modalidad de Impartición <span className="text-cyan-400">*</span>
                          </label>
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            Solo modalidad 100% Virtual habilitada
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setNewCourseModality('Virtual')}
                            className="p-3 rounded-xl border text-left transition-all cursor-pointer bg-cyan-950/70 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/30"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-white">100% Virtual</span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500 text-slate-950 rounded font-black">
                                Activo
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Clases interactivas en vivo vía streaming WebRTC + campus 24/7 disponible para todos los estudiantes.
                            </p>
                          </button>

                          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-500 opacity-60 cursor-not-allowed relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-500" />
                                Presencial en Friusa
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded border border-amber-500/30 font-bold">
                                Bloqueado
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Temporalmente inhabilitado. Se abrirá próximamente para convocatorias en sede física.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-500 opacity-60 cursor-not-allowed relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-500" />
                                Semipresencial
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded border border-amber-500/30 font-bold">
                                Bloqueado
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Temporalmente inhabilitado. Las clases presenciales híbridas están pausadas por ahora.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Duración */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Duración del Curso <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCourseDuration}
                          onChange={(e) => setNewCourseDuration(e.target.value)}
                          placeholder="Ej. 8 Semanas (48 horas lectivas)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Días y Horarios de Clases en Vivo */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Días y Horario de Clases en Vivo <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCourseSchedule}
                          onChange={(e) => setNewCourseSchedule(e.target.value)}
                          placeholder="Ej. Martes y Jueves 7:00 PM - 9:00 PM (En Vivo por WebRTC)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Estos días se reflejarán automáticamente en el Calendario Académico de los estudiantes que matriculen tu curso.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(2)}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
                      >
                        <span>Siguiente: Metodología & Perfil Egresado</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: METODOLOGÍA & PERFIL DEL EGRESADO */}
                {courseStudioStep === 2 && (
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                        <span>Paso 2: Descripción Pedagógica y Perfil del Egresado</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Los estudiantes y las empresas hoteleras leen esta sección antes de matricularse para conocer el campo de inserción laboral.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Descripción */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Descripción Integral del Curso <span className="text-cyan-400">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={newCourseDesc}
                          onChange={(e) => setNewCourseDesc(e.target.value)}
                          placeholder="Detalla qué aprenderá el alumno, qué problemas sabrá resolver y por qué tu formación es relevante..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                        />
                      </div>

                      {/* Metodología */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Metodología de Enseñanza
                        </label>
                        <textarea
                          rows={2}
                          value={newCourseMethodology}
                          onChange={(e) => setNewCourseMethodology(e.target.value)}
                          placeholder="Explica cómo se desarrollarán las clases (simulaciones de casos reales, role-playing, prácticas continuas)..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                        />
                      </div>

                      {/* Perfil del Egresado */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Perfil del Egresado & Salidas Laborales en Punta Cana <span className="text-cyan-400">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={newCourseGraduateProfile}
                          onChange={(e) => setNewCourseGraduateProfile(e.target.value)}
                          placeholder="Enumera las competencias alcanzadas y los cargos concretos que el estudiante podrá desempeñar (Ej. Recepcionista bilingüe, Concierge en resorts 5 estrellas, Agente de servicios al cliente)..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                        />
                      </div>

                      {/* Certificación */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Certificación Otorgada
                        </label>
                        <input
                          type="text"
                          value={newCourseCertification}
                          onChange={(e) => setNewCourseCertification(e.target.value)}
                          placeholder="Ej. Certificado Oficial Punta Cana Academy con código QR de verificación institucional"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(1)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(3)}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
                      >
                        <span>Siguiente: Portada & Video Trailer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PORTADA CON GUÍA DE ESPECIFICACIONES & VIDEO TRAILER */}
                {courseStudioStep === 3 && (
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Presentation className="w-4 h-4 text-cyan-400" />
                        <span>Paso 3: Recursos Promocionales — Foto de Portada & Video Explicativo</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        El material audiovisual es la carta de presentación de tu curso. Sigue rigurosamente las pautas de calidad para maximizar tus inscripciones.
                      </p>
                    </div>

                    {/* FOTO DE PORTADA CON BANNER TÉCNICO DETALLADO */}
                    <div className="space-y-3">
                      {/* Notice Banner con dimensiones técnicas obligatorias */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#030a16] border border-amber-500/40 text-amber-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Especificaciones Técnicas para la Foto de Portada</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <strong className="text-white">Aviso docente importante:</strong> Esta imagen y tu video explicativo serán utilizados por el equipo de marketing de Punta Cana Academy en campañas de pauta digital (Meta, Google, TikTok), cartelería y newsletters para promocionar tu curso ante miles de potenciales alumnos.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/30">
                            <span className="block text-slate-400 text-[10px]">Dimensiones recomendadas:</span>
                            <span className="font-black text-white">1920 × 1080 px (o 1280 × 720 px)</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/30">
                            <span className="block text-slate-400 text-[10px]">Relación de aspecto:</span>
                            <span className="font-black text-white">16:9 Panorámica horizontal</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/30">
                            <span className="block text-slate-400 text-[10px]">Calidad y Formato:</span>
                            <span className="font-black text-white">Mínimo 300 DPI • WebP o PNG</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/30">
                            <span className="block text-slate-400 text-[10px]">Zona Segura:</span>
                            <span className="font-black text-white">15% de margen libre perimetral</span>
                          </div>
                        </div>
                      </div>

                      {/* Input de Portada con opciones de Computador, Google Drive y Enlace Web (Req 4) */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-slate-300">
                          Foto de Portada del Curso (16:9 HD) <span className="text-cyan-400">*</span>
                        </label>

                        {/* Selector de origen para imagen */}
                        <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1 text-xs font-bold max-w-md">
                          <button
                            type="button"
                            onClick={() => setThumbnailTab('upload')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              thumbnailTab === 'upload' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Desde mi PC</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailTab('drive')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              thumbnailTab === 'drive' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Google Drive</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailTab('link')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              thumbnailTab === 'link' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Enlace Web</span>
                          </button>
                        </div>

                        {thumbnailTab === 'upload' && (
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-dashed border-cyan-500/40 text-center space-y-2 max-w-lg">
                            <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                            <p className="text-xs text-slate-300">Selecciona una imagen de tu computadora (PNG, JPG, WebP hasta 5MB)</p>
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-xs transition-all">
                              <span>Examinar Archivos</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadThumbnailFile}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}

                        {thumbnailTab === 'drive' && (
                          <div className="space-y-2 max-w-lg">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={thumbnailDriveInput}
                                onChange={(e) => setThumbnailDriveInput(e.target.value)}
                                placeholder="Pega el enlace de Google Drive (ej. https://drive.google.com/file/d/...)"
                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!thumbnailDriveInput.trim()) return;
                                  const converted = convertDriveImageUrl(thumbnailDriveInput.trim());
                                  setNewCourseThumbnail(converted);
                                  showToast('Enlace de Google Drive importado.');
                                }}
                                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer whitespace-nowrap"
                              >
                                Importar
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Asegúrate de que el enlace en Google Drive tenga el acceso configurado en: &ldquo;Cualquier persona con el enlace&rdquo;.
                            </p>
                          </div>
                        )}

                        {thumbnailTab === 'link' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={newCourseThumbnail}
                              onChange={(e) => setNewCourseThumbnail(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full max-w-lg px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                            />
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span>Presets temáticos:</span>
                              {[
                                { label: 'Hotelería Resort', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
                                { label: 'Front Desk Bilingüe', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80' },
                                { label: 'Barismo & Coctelería', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80' },
                                { label: 'Tecnología & Código', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => setNewCourseThumbnail(preset.url)}
                                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Vista previa en vivo de la foto de portada */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video max-w-lg shadow-lg">
                          <img
                            src={newCourseThumbnail}
                            alt="Vista previa de portada"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-black text-cyan-300 border border-cyan-500/30">
                            16:9 • Vista Previa HD
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 rounded-lg">
                            <p className="text-[10px] text-cyan-400 font-bold uppercase">{newCourseCategory}</p>
                            <p className="text-xs font-black text-white truncate">{newCourseTitle || 'Título del Curso'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                      {/* VIDEO EXPLICATIVO / TRAILER CON OPCIONES PC, GOOGLE DRIVE Y ENLACE (Req 4) */}
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">Video Explicativo Promocional (Trailer del Curso)</h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Sube o enlaza un video de 1 a 3 minutos explicando qué aprenderán, las dinámicas reales y beneficios laborales. Se reproducirá directamente en la ficha del curso en el marketplace.
                        </p>

                        {/* Selector de origen para video */}
                        <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1 text-xs font-bold max-w-md">
                          <button
                            type="button"
                            onClick={() => setVideoTab('upload')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              videoTab === 'upload' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Desde mi PC</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoTab('drive')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              videoTab === 'drive' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Google Drive</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoTab('link')}
                            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              videoTab === 'link' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>YouTube / URL</span>
                          </button>
                        </div>

                        {videoTab === 'upload' && (
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-dashed border-cyan-500/40 text-center space-y-2 max-w-lg">
                            <Video className="w-6 h-6 text-cyan-400 mx-auto" />
                            <p className="text-xs text-slate-300">Selecciona un video promocional de tu computador (MP4, WebM)</p>
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-xs transition-all">
                              <span>Examinar Video</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleUploadVideoFile}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}

                        {videoTab === 'drive' && (
                          <div className="space-y-2 max-w-lg">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={videoDriveInput}
                                onChange={(e) => setVideoDriveInput(e.target.value)}
                                placeholder="Enlace de Google Drive (ej. https://drive.google.com/file/d/...)"
                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!videoDriveInput.trim()) return;
                                  const converted = convertVideoUrl(videoDriveInput.trim());
                                  setNewCourseExplanatoryVideo(converted);
                                  showToast('Video de Google Drive importado.');
                                }}
                                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer whitespace-nowrap"
                              >
                                Importar
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Configura el video en Drive como público para que cualquier alumno pueda reproducirlo.
                            </p>
                          </div>
                        )}

                        {videoTab === 'link' && (
                          <div className="space-y-2 max-w-lg">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCourseExplanatoryVideo}
                                onChange={(e) => setNewCourseExplanatoryVideo(e.target.value)}
                                onBlur={() => setNewCourseExplanatoryVideo(convertVideoUrl(newCourseExplanatoryVideo))}
                                placeholder="https://www.youtube.com/watch?v=... o https://..."
                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setNewCourseExplanatoryVideo(convertVideoUrl(newCourseExplanatoryVideo));
                                  showToast('Enlace de video adaptado para streaming.');
                                }}
                                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer whitespace-nowrap"
                              >
                                Aplicar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Reproductor de Video Trailer Embebido o Vista Previa */}
                        <div className="aspect-video max-w-lg rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
                          {newCourseExplanatoryVideo.startsWith('blob:') ? (
                            <video
                              src={newCourseExplanatoryVideo}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={newCourseExplanatoryVideo}
                              title="Trailer Explicativo del Curso"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                      </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(2)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(4)}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
                      >
                        <span>Siguiente: Temario & Prácticas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: TEMARIO, UNIDADES & PRÁCTICAS */}
                {courseStudioStep === 4 && (
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Paso 4: Temario, Unidades Didácticas & Prácticas Evaluables</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Estructura los temas secuenciales con videos, diapositivas interactivas, quizzes y tareas prácticas con rúbricas.
                      </p>
                    </div>

                    {/* REGLA DE PRUEBA GRATIS DESTACADA (Req 4) */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-cyan-300">
                        <Info className="w-4 h-4 text-cyan-400" />
                        <span>Regla de Desbloqueo en la Prueba Gratuita (12 Días)</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Durante la prueba gratis de 12 días, los estudiantes únicamente podrán cursar las <strong>2 primeras unidades</strong>. Las unidades 3 en adelante, así como el chat en vivo y las herramientas con inteligencia artificial, quedan bloqueadas hasta que el alumno active su membresía Pro Caribe o adquiera el curso de forma individual.
                      </p>
                    </div>

                    {/* Lista de Unidades Didácticas */}
                    <div className="space-y-3">
                      {creationUnits.map((unit, uIdx) => (
                        <div
                          key={unit.id}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center text-xs font-black">
                                {uIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={unit.title}
                                onChange={(e) => {
                                  const updated = [...creationUnits];
                                  updated[uIdx].title = e.target.value;
                                  setCreationUnits(updated);
                                }}
                                className="bg-transparent font-bold text-xs text-white border-b border-slate-700 focus:border-cyan-400 focus:outline-none px-1 py-0.5 w-full sm:w-80"
                              />
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              uIdx < 2
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {uIdx < 2 ? 'Incluida en Prueba Gratis' : 'Exclusiva Pro Caribe / Compra'}
                            </span>
                          </div>

                          {/* Temas de la unidad */}
                          <div className="space-y-2.5 pl-2">
                            {unit.topics.map((topic, tIdx) => {
                              const isExpanded = expandedTopicId === topic.id;
                              const currentVideoTab = topicVideoTabs[topic.id] || 'upload';
                              const currentSlideTab = topicSlideTabs[topic.id] || 'upload';

                              return (
                                <div
                                  key={topic.id}
                                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2.5 transition-all"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="w-5 h-5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold">
                                        {tIdx + 1}
                                      </span>
                                      <input
                                        type="text"
                                        value={topic.title}
                                        onChange={(e) => {
                                          const updated = [...creationUnits];
                                          updated[uIdx].topics[tIdx].title = e.target.value;
                                          setCreationUnits(updated);
                                        }}
                                        className="bg-transparent font-semibold text-xs text-white border-b border-slate-800 focus:border-cyan-400 focus:outline-none flex-1"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5">
                                        <Clock className="w-3 h-3 text-cyan-400" />
                                        <input
                                          type="number"
                                          value={topic.durationMinutes}
                                          onChange={(e) => {
                                            const updated = [...creationUnits];
                                            updated[uIdx].topics[tIdx].durationMinutes = Number(e.target.value) || 30;
                                            setCreationUnits(updated);
                                          }}
                                          className="w-10 bg-transparent text-[11px] font-bold text-white focus:outline-none text-right"
                                        />
                                        <span className="text-[10px] text-slate-400">min</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                                          isExpanded
                                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-xs'
                                            : 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-500/50'
                                        }`}
                                      >
                                        <span>{isExpanded ? 'Ocultar' : 'Subir Recursos'}</span>
                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                      {unit.topics.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveTopicFromCreationUnit(uIdx, tIdx)}
                                          title="Eliminar tema"
                                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Resumen de recursos adjuntos */}
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                                    <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                                      topic.videoUrl 
                                        ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300 font-semibold' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400'
                                    }`}>
                                      <Video className="w-3 h-3" />
                                      <span>{topic.videoUrl ? 'Video Asignado' : 'Sin Video'}</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                                      <Presentation className="w-3 h-3 text-cyan-400" />
                                      <span>{topic.slidesCount} Diapositivas</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                                      ✓ Quiz Interactivo
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300">
                                      📝 Tarea Práctica
                                    </span>
                                  </div>

                                  {/* Panel expandible: Carga de Video y Diapositivas desde PC o Google Drive (Req 4) */}
                                  {isExpanded && (
                                    <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3.5 mt-2 animate-fadeIn">
                                      {/* 1. VIDEO DE LA LECCIÓN */}
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <label className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Video className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Video de la Lección / Clase Grabada</span>
                                          </label>
                                          <div className="flex rounded-lg bg-slate-950 border border-slate-700 p-0.5 text-[10px] font-bold">
                                            <button
                                              type="button"
                                              onClick={() => setTopicVideoTabs(prev => ({ ...prev, [topic.id]: 'upload' }))}
                                              className={`px-2 py-0.5 rounded ${currentVideoTab === 'upload' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              Desde PC
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setTopicVideoTabs(prev => ({ ...prev, [topic.id]: 'drive' }))}
                                              className={`px-2 py-0.5 rounded ${currentVideoTab === 'drive' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              Google Drive
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setTopicVideoTabs(prev => ({ ...prev, [topic.id]: 'link' }))}
                                              className={`px-2 py-0.5 rounded ${currentVideoTab === 'link' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              Enlace Web
                                            </button>
                                          </div>
                                        </div>

                                        {currentVideoTab === 'upload' && (
                                          <div className="p-2.5 rounded-lg bg-slate-950 border border-dashed border-cyan-500/30 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-300 truncate">
                                              <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                                              <span className="truncate">{topic.videoUrl ? 'Video seleccionado' : 'Sube el video de la clase desde tu disco local (MP4/WebM)'}</span>
                                            </div>
                                            <label className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] cursor-pointer whitespace-nowrap">
                                              <span>Examinar Video</span>
                                              <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleUploadTopicVideoFile(uIdx, tIdx, e)}
                                                className="hidden"
                                              />
                                            </label>
                                          </div>
                                        )}

                                        {currentVideoTab === 'drive' && (
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              value={topicDriveVideoInputs[topic.id] || ''}
                                              onChange={(e) => setTopicDriveVideoInputs(prev => ({ ...prev, [topic.id]: e.target.value }))}
                                              placeholder="Enlace de Google Drive (ej. https://drive.google.com/file/d/...)"
                                              className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-cyan-400"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const raw = (topicDriveVideoInputs[topic.id] || '').trim();
                                                if (!raw) return;
                                                const converted = convertVideoUrl(raw);
                                                const updated = [...creationUnits];
                                                updated[uIdx].topics[tIdx].videoUrl = converted;
                                                setCreationUnits(updated);
                                                showToast('Video de Google Drive importado.');
                                              }}
                                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px] cursor-pointer whitespace-nowrap"
                                            >
                                              Importar
                                            </button>
                                          </div>
                                        )}

                                        {currentVideoTab === 'link' && (
                                          <input
                                            type="text"
                                            value={topic.videoUrl}
                                            onChange={(e) => {
                                              const updated = [...creationUnits];
                                              updated[uIdx].topics[tIdx].videoUrl = convertVideoUrl(e.target.value);
                                              setCreationUnits(updated);
                                            }}
                                            placeholder="https://www.youtube.com/embed/... o https://..."
                                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-cyan-400"
                                          />
                                        )}
                                      </div>

                                      {/* 2. DIAPOSITIVAS Y MATERIAL DIDÁCTICO */}
                                      <div className="space-y-2 pt-2 border-t border-slate-800">
                                        <div className="flex items-center justify-between">
                                          <label className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Presentation className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Diapositivas y Material de Apoyo ({topic.slidesCount} diapositivas)</span>
                                          </label>
                                          <div className="flex rounded-lg bg-slate-950 border border-slate-700 p-0.5 text-[10px] font-bold">
                                            <button
                                              type="button"
                                              onClick={() => setTopicSlideTabs(prev => ({ ...prev, [topic.id]: 'upload' }))}
                                              className={`px-2 py-0.5 rounded ${currentSlideTab === 'upload' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              Desde PC
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setTopicSlideTabs(prev => ({ ...prev, [topic.id]: 'drive' }))}
                                              className={`px-2 py-0.5 rounded ${currentSlideTab === 'drive' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                              Google Drive
                                            </button>
                                          </div>
                                        </div>

                                        {currentSlideTab === 'upload' && (
                                          <div className="p-2.5 rounded-lg bg-slate-950 border border-dashed border-cyan-500/30 flex items-center justify-between gap-3">
                                            <span className="text-[11px] text-slate-300">
                                              Sube archivos de diapositivas o fotos didácticas (PDF, PPTX, PNG, JPG)
                                            </span>
                                            <label className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] cursor-pointer whitespace-nowrap">
                                              <span>Subir Archivos</span>
                                              <input
                                                type="file"
                                                accept="image/*,.pdf,.ppt,.pptx"
                                                multiple
                                                onChange={(e) => handleUploadTopicSlidesFile(uIdx, tIdx, e)}
                                                className="hidden"
                                              />
                                            </label>
                                          </div>
                                        )}

                                        {currentSlideTab === 'drive' && (
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              value={topicDriveSlideInputs[topic.id] || ''}
                                              onChange={(e) => setTopicDriveSlideInputs(prev => ({ ...prev, [topic.id]: e.target.value }))}
                                              placeholder="Enlace de Google Drive a diapositivas o presentación"
                                              className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-cyan-400"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const raw = (topicDriveSlideInputs[topic.id] || '').trim();
                                                if (!raw) return;
                                                const updated = [...creationUnits];
                                                updated[uIdx].topics[tIdx].slidesCount = (updated[uIdx].topics[tIdx].slidesCount || 10) + 8;
                                                setCreationUnits(updated);
                                                showToast('Presentación de Google Drive enlazada al tema.');
                                              }}
                                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px] cursor-pointer whitespace-nowrap"
                                            >
                                              Vincular
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* 3. TAREA Y PRÁCTICA EVALUABLE */}
                                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                                        <label className="text-xs font-bold text-white block">
                                          Instrucciones de la Tarea / Práctica Calificable
                                        </label>
                                        <textarea
                                          value={topic.practiceInstructions}
                                          onChange={(e) => {
                                            const updated = [...creationUnits];
                                            updated[uIdx].topics[tIdx].practiceInstructions = e.target.value;
                                            setCreationUnits(updated);
                                          }}
                                          rows={2}
                                          className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none focus:border-cyan-400"
                                        />
                                        <label className="text-[10px] text-slate-400 block">
                                          Rúbrica de Evaluación:
                                        </label>
                                        <input
                                          type="text"
                                          value={topic.practiceRubric}
                                          onChange={(e) => {
                                            const updated = [...creationUnits];
                                            updated[uIdx].topics[tIdx].practiceRubric = e.target.value;
                                            setCreationUnits(updated);
                                          }}
                                          placeholder="Criterios y porcentajes de calificación..."
                                          className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-300 text-[10px] focus:outline-none focus:border-cyan-400"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Botón para agregar tema a la unidad */}
                            <button
                              type="button"
                              onClick={() => handleAddTopicToCreationUnit(uIdx)}
                              className="w-full py-2 rounded-xl bg-slate-950/70 border border-dashed border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Agregar Tema a la Unidad {uIdx + 1}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Botón para agregar nueva unidad completa */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleAddCreationUnit}
                        className="w-full py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 hover:bg-cyan-950/50 text-cyan-200 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>+ Agregar Nueva Unidad Didáctica</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(3)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(5)}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
                      >
                        <span>Siguiente: Precio & Vista Previa Oficial</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: PRECIO & VISTA PREVIA OFICIAL CON BOTÓN GOLD "SE PRO CARIBE" */}
                {courseStudioStep === 5 && (
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6 animate-fadeIn">
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>Paso 5: Asignación de Precio & Vista Previa Oficial del Curso</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Elige el precio de tus cursos según los estándares establecidos ($49.99 a $150.00 USD). Visualiza la tarjeta en tiempo real con el botón oficial.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      {/* Lado Izquierdo: Configuración de Precio */}
                      <div className="space-y-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black text-white uppercase tracking-wider">
                              Elige el precio de tus cursos <span className="text-cyan-400">*</span>
                            </label>
                            <span className="text-base font-black text-cyan-300 px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40">
                              ${Number(newCoursePrice).toFixed(2)} USD
                            </span>
                          </div>

                          {/* Price Slider */}
                          <input
                            type="range"
                            min="10.00"
                            max="300.00"
                            step="0.5"
                            value={newCoursePrice}
                            onChange={(e) => setNewCoursePrice(parseFloat(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold">
                            <span>Mínimo: $10.00 USD</span>
                            <span>Recomendado: $19.45 - $41.30 USD</span>
                            <span>Máximo: $300.00 USD</span>
                          </div>
                        </div>

                        {/* Presets de Precio */}
                        <div className="flex flex-wrap gap-2">
                          {[19.45, 24.99, 29.99, 34.98, 41.30, 49.99, 79.99].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setNewCoursePrice(preset)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                Math.abs(newCoursePrice - preset) < 0.01
                                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                              }`}
                            >
                              ${preset.toFixed(2)}
                            </button>
                          ))}
                        </div>

                        {/* Finanzas del Docente */}
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span>Condiciones de Cobro para Docentes</span>
                          </p>
                          <ul className="space-y-1 text-slate-300 text-[11px]">
                            <li>• Retiros rápidos sin comisiones ocultas vía <strong>PayPal</strong> o <strong>Transferencia Bancaria (Bancos Dominicanos)</strong>.</li>
                            <li>• Participación en las <strong>Bonificaciones Mensuales</strong> por los estudiantes activos del Plan Pro Caribe.</li>
                            <li>• Soporte pedagógico continuo y aulas virtuales ilimitadas.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Lado Derecho: Tarjeta Oficial de Vista Previa con el Botón Gold "SE PRO CARIBE" (Req 2) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Vista Previa en el Marketplace Oficial</span>
                          </span>
                          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                            En Vivo
                          </span>
                        </div>

                        <div className="bg-[#030914] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                          {/* Image */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                            <img
                              src={newCourseThumbnail}
                              alt={newCourseTitle}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-transparent to-transparent" />
                            
                            <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[9px] font-black uppercase">
                                {newCourseCategory}
                              </span>
                            </div>

                            <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-amber-500/40 px-2 py-0.5 rounded-lg text-amber-300 text-[10px] font-black flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>5.0</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-2.5">
                            <div>
                              <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                                {newCourseTitle || 'Título del curso'}
                              </h3>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {newCourseSubtitle || 'Subtítulo del curso'}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-400">
                              <span>⏱ {newCourseDuration}</span>
                              <span>•</span>
                              <span>📍 {newCourseModality}</span>
                              <span>•</span>
                              <span>🎓 {newCourseLevel}</span>
                            </div>

                            {/* PRECIO & BOTÓN GOLD "SE PRO CARIBE" (Req 2) */}
                            <div className="pt-3 border-t border-slate-800 space-y-2">
                              <div className="flex items-baseline justify-between">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Precio Individual:</span>
                                <span className="text-base font-black text-cyan-300">
                                  ${Number(newCoursePrice).toFixed(2)} USD
                                </span>
                              </div>

                              {/* Botón Gold / Premium: Gratis con Pro Caribe */}
                              <button
                                type="button"
                                onClick={() => showToast('Botón activador de membresía Pro Caribe')}
                                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-yellow-200/60"
                                title="Totalmente gratis con la membresía Pro Caribe"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                                <span>Gratis con Pro Caribe</span>
                              </button>

                              <p className="text-[9px] text-center text-slate-500">
                                Acceso total a este curso y todo el catálogo por solo $19.99/mes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones Finales de Envío */}
                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCourseStudioStep(4)}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        Atrás: Temario
                      </button>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={(e) => handleCreateCourse(e, true)}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                        >
                          Guardar como Borrador
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCreateCourse(e, false)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:scale-102 transition-transform text-slate-950 font-black text-xs shadow-xl cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Enviar a Revisión Académica y Publicar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: GRADEBOOK & REVISIÓN DE TAREAS */}
            {activeTab === 'gradebook' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Revisión de Tareas y Calificaciones</h2>
                    <p className="text-xs text-slate-400">
                      Asigna tareas, evalúa las entregas en tiempo real y asigna su nota oficial con retroalimentación.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewTaskModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-102 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Asignar Nueva Tarea / Práctica</span>
                    </button>
                    <span className="text-xs font-bold text-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/30 whitespace-nowrap">
                      {submissions.length} entregas
                    </span>
                  </div>
                </div>

                {/* Active Tasks Assigned by Teacher Banner */}
                {tasks.length > 0 && (
                  <div className="bg-[#040e1d] border border-cyan-500/20 rounded-2xl p-3.5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tareas & Prácticas Asignadas a los Alumnos ({tasks.length})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Sincronizadas en tiempo real con el panel del estudiante</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {tasks.map((task) => (
                        <div key={task.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-white text-xs">{task.title}</h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30 shrink-0">
                              {task.points} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{task.description}</p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                            <span>Vence: <strong className="text-amber-300 font-mono">{task.dueDate}</strong></span>
                            <span className="text-cyan-400">{task.courseTitle.slice(0, 24)}...</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  {submissions.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-300">No hay entregas pendientes de revisión</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Cuando los alumnos inscritos envíen sus tareas y prácticas de los módulos, aparecerán aquí para que puedas calificarlas y dar retroalimentación personalizada.
                      </p>
                    </div>
                  ) : (
                    submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={sub.studentName}
                            className="w-9 h-9 rounded-full object-cover border border-cyan-500/40 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-white">{sub.studentName}</h4>
                              {sub.status === 'pending' ? (
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                                  Por Calificar
                                </span>
                              ) : (
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                                  Nota: {sub.grade}/100
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-cyan-300 mt-0.5">{sub.courseTitle} • {sub.topicTitle}</p>
                            <p className="text-[10px] text-slate-500">{sub.submittedAt}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setReviewGradeInput(sub.grade || 95);
                            setReviewFeedbackInput(sub.teacherFeedback || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-black hover:scale-102 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-md"
                        >
                          {sub.status === 'pending' ? 'Evaluar Tarea' : 'Modificar Nota'}
                        </button>
                      </div>

                      <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-xs text-slate-300">
                        <p className="font-semibold text-slate-400 mb-0.5 text-[10px]">Entrega del alumno:</p>
                        <p className="italic text-slate-200 text-xs leading-relaxed">"{sub.submissionText}"</p>
                        {sub.attachmentName && (
                          <div className="mt-2 pt-1.5 border-t border-slate-900 flex items-center gap-2 text-cyan-400 text-[11px]">
                            <FileText className="w-3 h-3" />
                            <span>Adjunto: <strong>{sub.attachmentName}</strong></span>
                          </div>
                        )}
                      </div>

                      {sub.teacherFeedback && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                          <p className="font-bold text-[10px]">Tu Retroalimentación:</p>
                          <p className="mt-0.5 text-xs">{sub.teacherFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

            {/* TAB 4: ASISTENCIA Y JUSTIFICACIONES */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">Control de Asistencia y Justificaciones</h2>
                  <p className="text-xs text-slate-400">
                    Valida y aprueba las justificaciones de inasistencia médica o laboral presentadas por los alumnos.
                  </p>
                </div>

                <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Solicitudes Recibidas</span>
                  </h3>

                  {justifications.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-300">No hay solicitudes de justificantes</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Las justificaciones de inasistencia por turno laboral o motivos de salud que presenten los estudiantes se listarán aquí para tu aprobación.
                      </p>
                    </div>
                  ) : (
                    justifications.map((just) => (
                      <div
                        key={just.id}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-white">{just.studentName}</h4>
                              {just.status === 'pending' ? (
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                                  Por Validar
                                </span>
                              ) : just.status === 'approved' ? (
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                                  Justificación Aprobada
                                </span>
                              ) : (
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-500/30 font-bold">
                                  Rechazada
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-cyan-300 mt-0.5">{just.courseTitle} • Clase: {just.classDate}</p>
                            <p className="text-[10px] text-slate-500">{just.submittedAt}</p>
                          </div>

                          {just.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReviewJustification(just.id, 'approved', 'Aprobado por el profesor. Asistencia computada.')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors cursor-pointer"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => handleReviewJustification(just.id, 'rejected', 'Documentación insuficiente.')}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-red-300 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Rechazar
                              </button>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Dictamen emitido</p>
                          )}
                        </div>

                        <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-xs text-slate-300">
                          <p className="font-semibold text-slate-400 mb-0.5 text-[10px]">Motivo expuesto:</p>
                          <p className="text-slate-200 text-xs">{just.reason}</p>
                          {just.documentProofName && (
                            <div className="mt-2 pt-1.5 border-t border-slate-900 flex items-center gap-2 text-cyan-400 text-[11px]">
                              <FileText className="w-3 h-3" />
                              <span>Comprobante: <strong>{just.documentProofName}</strong></span>
                            </div>
                          )}
                        </div>

                        {just.teacherNotes && (
                          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
                            <p className="font-bold text-[10px]">Nota del Profesor:</p>
                            <p className="mt-0.5 text-xs">{just.teacherNotes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: AULA VIRTUAL EN VIVO */}
            {activeTab === 'classroom' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Aula Virtual en Vivo</h2>
                    <p className="text-xs text-slate-400">
                      Consola de transmisión en vivo con video, pizarra, chat y asistencia.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleLive}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                        isLiveActive
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:scale-102'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isLiveActive ? 'Finalizar Clase en Vivo' : 'Iniciar Clase en Vivo'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Video Stage with Real Browser WebRTC */}
                  <div className="lg:col-span-2 bg-[#040e1d] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                    <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                      {/* Real WebRTC HTML5 Video Element */}
                      <video
                        ref={teacherVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${isCamOn ? 'block' : 'hidden'}`}
                      />

                      {!isCamOn && (
                        <div className="text-center p-5 space-y-3">
                          <div className="w-14 h-14 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
                            <Video className="w-7 h-7" />
                          </div>
                          <p className="text-sm font-bold text-white">
                            Cámara apagada por el docente
                          </p>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Presiona el botón para encender tu cámara WebRTC y verte en pantalla en vivo.
                          </p>
                          <button
                            type="button"
                            onClick={startCameraStream}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            <span>Encender Cámara Ahora</span>
                          </button>
                        </div>
                      )}

                      {/* Live Badge or Lobby Preview Overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                        {isLiveActive ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>EN VIVO</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>VISTA PREVIA / LOBBY</span>
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-[10px] font-bold">
                          {isRealCamera ? 'Cámara WebRTC del Dispositivo' : 'Cámara Virtual HD Activa'}
                        </span>
                        {isLiveActive && isRecording && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 text-[10px] font-black flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span>GRABANDO {formatRecTime(recordingSeconds)}</span>
                          </span>
                        )}
                      </div>

                      {/* Instructor Name Watermark */}
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white">{instructor.displayName}</span>
                        <span className="text-cyan-400">(Docente Titular)</span>
                      </div>
                    </div>

                    {/* Stage Control Bar */}
                    <div className="p-3 bg-[#030a16] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMic}
                          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                            isMicOn ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'bg-red-900/60 text-red-300 border border-red-500/30'
                          }`}
                          title={isMicOn ? 'Silenciar Micrófono' : 'Activar Micrófono'}
                        >
                          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={toggleCam}
                          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                            isCamOn ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'bg-red-900/60 text-red-300 border border-red-500/30'
                          }`}
                          title={isCamOn ? 'Apagar Cámara WebRTC' : 'Encender Cámara WebRTC'}
                        >
                          {isCamOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={toggleScreenShare}
                          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                            isScreenSharing ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:text-white'
                          }`}
                          title="Compartir Pantalla"
                        >
                          <ScreenShare className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Class Recording Actions */}
                      <div className="flex items-center gap-2">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Disc className="w-3.5 h-3.5 text-red-400" />
                            <span>Grabar Clase</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="px-3 py-1.5 rounded-xl bg-red-600 text-white animate-pulse text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/30"
                          >
                            <span className="w-2 h-2 rounded-full bg-white" />
                            <span>Detener y Descargar ({formatRecTime(recordingSeconds)})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Synced Classroom Chat */}
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between h-[420px]">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat de la Clase en Vivo</span>
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Sincronizado
                        </span>
                      </div>
                      
                      <div className="space-y-2 overflow-y-auto max-h-[290px] pr-1">
                        {liveChatList.map((c, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-0.5">
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span className="font-bold text-cyan-300">{c.sender}</span>
                              <span className="font-mono">{c.time}</span>
                            </div>
                            <p className="text-slate-200 text-xs leading-relaxed">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form
                      onSubmit={handleSendClassroomChatMessage}
                      className="flex gap-2 pt-2 border-t border-slate-800"
                    >
                      <input
                        type="text"
                        value={liveChatMessage}
                        onChange={(e) => setLiveChatMessage(e.target.value)}
                        placeholder="Escribir mensaje a los alumnos..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
                        title="Enviar mensaje"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: TABLÓN DE ANUNCIOS */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Tablón de Anuncios</h2>
                    <p className="text-xs text-slate-400">
                      Publica avisos oficiales visibles en el panel de los estudiantes.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewAnnouncementModalOpen(true)}
                    className="btn-gradient-cyan px-3.5 py-2 rounded-xl text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publicar Anuncio</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.length === 0 ? (
                    <div className="p-8 text-center bg-[#040e1d] border border-slate-800 rounded-2xl space-y-2">
                      <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-300">No hay avisos publicados</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Cuando publiques un aviso oficial o urgente para tu cátedra, aparecerá aquí y se sincronizará en tiempo real con todos tus estudiantes.
                      </p>
                    </div>
                  ) : (
                    announcements.map((anc) => (
                      <div
                        key={anc.id}
                        className="p-4 rounded-2xl bg-[#040e1d] border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2"
                      >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {anc.priority === 'urgent' ? (
                            <span className="px-2 py-0.2 rounded-full bg-red-950 border border-red-500/40 text-red-300 text-[9px] font-bold">
                              Urgente
                            </span>
                          ) : (
                            <span className="px-2 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[9px] font-bold">
                              Oficial
                            </span>
                          )}
                          <span className="text-xs text-slate-400">• {anc.courseTitle}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{anc.createdAt}</span>
                      </div>

                      <h3 className="text-sm font-black text-white">{anc.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{anc.content}</p>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
                        <span>Visto por {anc.viewsCount} estudiantes</span>
                        <span className="text-emerald-400 font-semibold">Sincronizado con Estudiantes</span>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: FINANZAS Y RETIROS */}
            {activeTab === 'finances' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Finanzas & Retiros</h2>
                    <p className="text-xs text-slate-400">
                      Gestiona tus ingresos y solicita transferencias a PayPal o a tu Banco Dominicano.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Solicitar Retiro de Fondos</span>
                  </button>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-4 shadow-md">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balance Disponible</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">${instructor.balanceAvailable.toFixed(2)} USD</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Listo para retiro</p>
                  </div>

                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-md">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ganado Histórico</span>
                    <p className="text-2xl font-black text-white mt-1">${instructor.totalEarningsAllTime.toFixed(2)} USD</p>
                    <p className="text-[10px] text-cyan-400 mt-0.5">Ingresos acumulados</p>
                  </div>

                  {/* Req 3: Bonificaciones Mensuales */}
                  <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-md">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bonificaciones Mensuales</span>
                    <p className="text-2xl font-black text-teal-300 mt-1">${instructor.proCaribeRoyaltiesThisMonth.toFixed(2)} USD</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Plan Pro Caribe acumulado este mes</p>
                  </div>
                </div>

                {/* Payout Channels Banner - Req 5: PayPal & Bank Transfer */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Pagos procesados puntualmente a través de <strong>PayPal Internacional (USD)</strong> o <strong>Transferencia Bancaria</strong> (Banco Popular, Banreservas, Banco BHD).
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 shrink-0 self-start sm:self-auto">
                    {instructor.bankDetails?.bankName}
                  </span>
                </div>

                {/* Transactions Ledger */}
                <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Historial de Transacciones</h3>
                  <div className="divide-y divide-slate-800">
                    {payouts.map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-xs text-white">{tx.description}</p>
                          <p className="text-[10px] text-slate-500">{tx.date} • Ref: {tx.receiptReference}</p>
                        </div>

                        <div className="text-right">
                          <span className={`font-black text-xs sm:text-sm ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} USD
                          </span>
                          <p className="text-[9px] text-emerald-400/80 uppercase font-semibold">Procesado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: PERFIL DEL DOCENTE */}
            {activeTab === 'profile' && (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">Perfil Profesional del Docente</h2>
                  <p className="text-xs text-slate-400">
                    Información académica y datos de cobro por PayPal o transferencia bancaria.
                  </p>
                </div>

                <div className="bg-[#040e1d] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-800">
                    {instructor.avatarUrl ? (
                      <img
                        src={instructor.avatarUrl}
                        alt={instructor.displayName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-xl shrink-0">
                        {instructor.displayName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') || 'DOC'}
                      </div>
                    )}
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-base font-black text-white">{instructor.displayName}</h3>
                      <p className="text-xs text-cyan-400 font-bold">{instructor.specialty}</p>
                      <p className="text-xs text-slate-400">{instructor.email} • {instructor.phone}</p>
                      <div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-900/60 text-[11px] font-bold cursor-pointer transition-colors mt-1">
                          <Upload className="w-3 h-3" />
                          <span>Subir / Cambiar Foto de Perfil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newUrl = reader.result as string;
                                  const updated = { ...instructor, avatarUrl: newUrl };
                                  setInstructor(updated);
                                  saveStoredInstructor(updated);
                                  showToast('¡Foto de perfil actualizada con éxito!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Biografía Profesional</label>
                      <textarea
                        rows={2}
                        value={instructor.bio}
                        onChange={(e) => setInstructor({ ...instructor, bio: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Banco Dominicano o Pasarela</label>
                        <input
                          type="text"
                          value={instructor.bankDetails?.bankName}
                          onChange={(e) => setInstructor({
                            ...instructor,
                            bankDetails: { ...instructor.bankDetails!, bankName: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Número de Cuenta / Correo PayPal</label>
                        <input
                          type="text"
                          value={instructor.bankDetails?.accountNumber}
                          onChange={(e) => setInstructor({
                            ...instructor,
                            bankDetails: { ...instructor.bankDetails!, accountNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        saveStoredInstructor(instructor);
                        showToast('Perfil de docente actualizado correctamente.');
                      }}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-md"
                    >
                      Guardar Cambios de Perfil
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FLOATING ACTION: CHATBOT DE ASISTENCIA PEDAGÓGICA */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Asistente Virtual para Profesores"
      >
        <Bot className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Asistente PCA</span>
      </button>

      {/* CHATBOT MODAL DE ASISTENCIA */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col h-[520px] overflow-hidden text-white">
            
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-cyan-950 via-slate-900 to-[#040e1d] border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>Asistente Pedagógico PCA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Soporte didáctico y académico para profesores</p>
                </div>
              </div>

              <button
                onClick={() => setIsChatbotOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Pills */}
            <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0">
              <button
                onClick={() => handleSendChatbotMessage('¿Cómo estructurar mi primer curso?')}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                💡 Estructurar curso
              </button>
              <button
                onClick={() => handleSendChatbotMessage('Redactar rúbrica de evaluación')}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                📝 Rúbrica práctica
              </button>
              <button
                onClick={() => handleSendChatbotMessage('¿Cómo funcionan las bonificaciones mensuales Pro Caribe?')}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                💰 Bonificaciones Pro
              </button>
              <button
                onClick={() => handleSendChatbotMessage('¿Cómo solicitar retiros a PayPal o Banco?')}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                💳 Cobros y Retiros
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
              {chatbotMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed text-xs shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-xs'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-slate-900/70 text-right' : 'text-slate-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isChatbotTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl p-2.5 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>El asistente está escribiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatbotMessage();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatbotInput}
                onChange={(e) => setChatbotInput(e.target.value)}
                placeholder="Pregunta sobre temarios, rúbricas o la plataforma..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: CREAR NUEVO CURSO (Req 2: 'Elige el precio de tus cursos' / Req 6: 49.99 to 150) */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewCourseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Creación de Curso</span>
              <h3 className="text-base font-black text-white mt-0.5">Crear Nuevo Curso para el Marketplace</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pasa por una revisión académica ágil antes de publicarse en la academia.
              </p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Título del Curso *</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Ej. Bartending y Coctelería para Resorts"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Idiomas & Hotelería">Idiomas & Hotelería</option>
                    <option value="Tecnología & Software">Tecnología & Software</option>
                    <option value="Gastronomía & Bares">Gastronomía & Bares</option>
                    <option value="Turismo & Buceo">Turismo & Buceo</option>
                    <option value="Negocios & Marketing">Negocios & Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nivel</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              {/* Req 2: 'Elige el precio de tus cursos' */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Elige el precio de tus cursos</label>
                  <span className="font-black text-cyan-400 text-sm">${newCoursePrice.toFixed(2)} USD</span>
                </div>
                <input
                  type="range"
                  min="49.99"
                  max="150"
                  step="1"
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Descripción y Objetivos de Aprendizaje</label>
                <textarea
                  rows={2}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Detalla qué habilidades aprenderán los estudiantes..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-101 transition-all cursor-pointer shadow-md"
              >
                Enviar a Revisión Académica
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REVISAR TAREA Y ASIGNAR NOTA */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setSelectedSubmissionForReview(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Libro de Calificaciones</span>
              <h3 className="text-sm font-black text-white mt-0.5">Evaluar Tarea: {selectedSubmissionForReview.studentName}</h3>
              <p className="text-[11px] text-slate-400">{selectedSubmissionForReview.topicTitle}</p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 mb-3 max-h-40 overflow-y-auto">
              <p className="font-bold text-slate-400 mb-1 text-[10px]">Entrega del Estudiante:</p>
              <p className="italic text-white text-xs leading-relaxed">"{selectedSubmissionForReview.submissionText}"</p>
              {selectedSubmissionForReview.attachmentName && (
                <div className="mt-2 pt-1.5 border-t border-slate-900 flex items-center gap-1.5 text-cyan-400 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Adjunto: {selectedSubmissionForReview.attachmentName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Calificación (0-100 pts)</label>
                  <span className="font-black text-cyan-400 text-sm">{reviewGradeInput} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={reviewGradeInput}
                  onChange={(e) => setReviewGradeInput(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Retroalimentación Pedagógica</label>
                <textarea
                  rows={2}
                  value={reviewFeedbackInput}
                  onChange={(e) => setReviewFeedbackInput(e.target.value)}
                  placeholder="Escribe observaciones para el estudiante..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={() => handleGradeSubmission(selectedSubmissionForReview.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-101 transition-all cursor-pointer shadow-md"
              >
                Guardar Calificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2.5: ASIGNAR NUEVA TAREA / PRÁCTICA */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setIsNewTaskModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Cátedra Docente</span>
              <h3 className="text-sm font-black text-white mt-0.5">Asignar Tarea o Práctica Evaluativa</h3>
              <p className="text-[11px] text-slate-400">
                La tarea aparecerá de inmediato en los pendientes del estudiante con notificación en tiempo real.
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Curso Asignado</label>
                <select
                  value={newTaskCourseId}
                  onChange={(e) => setNewTaskCourseId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Título de la Tarea / Caso Práctico</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej. Simulación de Diálogo de Concierge y Excursiones"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Fecha Límite</label>
                  <input
                    type="text"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    placeholder="Ej. Mañana, 11:59 PM"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Puntos Máximos</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Instrucciones & Guía del Ejercicio</label>
                <textarea
                  rows={3}
                  required
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Detalla qué deben entregar los alumnos (guión, audio, repositorio o texto de práctica)..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Rúbrica de Calificación</label>
                <input
                  type="text"
                  value={newTaskRubric}
                  onChange={(e) => setNewTaskRubric(e.target.value)}
                  placeholder="Ej. Vocabulario técnico (40%), cortesía (30%), resolución (30%)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black hover:scale-101 transition-all cursor-pointer shadow-md"
                >
                  Asignar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLICAR ANUNCIO */}
      {isNewAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setIsNewAnnouncementModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Tablón de Anuncios</span>
              <h3 className="text-sm font-black text-white mt-0.5">Publicar Aviso Oficial</h3>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Curso Destino</label>
                <select
                  value={announcementCourseId}
                  onChange={(e) => setAnnouncementCourseId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Título del Anuncio</label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Ej. Recordatorio de Examen Parcial el Viernes"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Prioridad</label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="normal">Normal / Informativo</option>
                  <option value="urgent">Urgente / Importante</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Contenido</label>
                <textarea
                  rows={3}
                  required
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  placeholder="Escribe el comunicado..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-101 transition-all cursor-pointer shadow-md"
              >
                Publicar Anuncio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SOLICITAR RETIRO (Req 5: PayPal o Transferencias Bancarias) */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#040e1d] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Retiro de Fondos</span>
              <h3 className="text-sm font-black text-white mt-0.5">Solicitar Transferencia de Ganancias</h3>
              <p className="text-xs text-slate-400">Balance disponible: ${instructor.balanceAvailable.toFixed(2)} USD</p>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Monto a Retirar (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2 w-3.5 h-3.5 text-emerald-400" />
                  <input
                    type="number"
                    min="20"
                    max={instructor.balanceAvailable}
                    step="10"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Método de Cobro (PayPal o Transferencia)</label>
                <select
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="PayPal Internacional (USD)">PayPal Internacional (USD)</option>
                  <option value="Transferencia Bancaria (Banco Popular Dominicano)">Transferencia Bancaria (Banco Popular Dominicano)</option>
                  <option value="Transferencia Bancaria (Banreservas)">Transferencia Bancaria (Banreservas)</option>
                  <option value="Transferencia Bancaria (Banco BHD)">Transferencia Bancaria (Banco BHD)</option>
                </select>
              </div>

              {/* Requirement 14: Dedicated PayPal Email field when PayPal is selected */}
              {payoutBank.includes('PayPal') ? (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Correo Electrónico de PayPal (PayPal Email) <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={payoutPaypalEmail}
                    onChange={(e) => setPayoutPaypalEmail(e.target.value)}
                    placeholder="Ej. profesor@gmail.com o pagos@paypal.com"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-xs"
                  />
                  <p className="text-[10px] text-emerald-400/90 mt-1">
                    Los pagos se transfieren en USD directamente a tu saldo de PayPal sin comisiones de intermediario.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Número de Cuenta Bancaria (RD$) *</label>
                  <input
                    type="text"
                    required
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="Ej. 7984321098"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-101 transition-all cursor-pointer shadow-md"
              >
                Confirmar y Transferir
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: SELECCIÓN DE CURSO & INICIO DE CLASE EN VIVO (Requirements 12 & 16) */}
      {isLiveSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#040e1d] border border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => {
                setIsLiveSetupModalOpen(false);
                setShowLiveConfirmDialog(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {!showLiveConfirmDialog ? (
              <>
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                      Cátedra en Vivo • Punta Cana Academy
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">Configurar Aula Virtual</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Elige el curso que impartirás y asigna un nombre para identificar esta sesión.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Curso Asignado *</label>
                    <select
                      value={selectedLiveCourseId}
                      onChange={(e) => setSelectedLiveCourseId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nombre de la Sección o Tema *</label>
                    <input
                      type="text"
                      value={liveSectionName}
                      onChange={(e) => setLiveSectionName(e.target.value)}
                      placeholder="Ej. Sección 1: Práctica Oral y Diálogos Hoteleros"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!liveSectionName.trim()) {
                        showToast('Por favor escribe el nombre de la sección.');
                        return;
                      }
                      setShowLiveConfirmDialog(true);
                    }}
                    className="w-full py-2.5 rounded-xl btn-gradient-cyan text-slate-950 font-black text-xs shadow-md cursor-pointer hover:scale-101 transition-all"
                  >
                    Continuar al Aula Virtual
                  </button>
                </div>
              </>
            ) : (
              /* Confirmation dialog (Requirement 16) */
              <div className="space-y-4 text-center py-1">
                <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg animate-pulse">
                  <Radio className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    ¿ESTÁS SEGURO QUE DESEAS INICIAR UNA CLASE EN VIVO?
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Se notificará a todos los estudiantes inscritos en: <br />
                    <strong className="text-cyan-300 block mt-1 font-bold">
                      {courses.find(c => c.id === selectedLiveCourseId)?.title}
                    </strong>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Sesión: "{liveSectionName}"
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLiveConfirmDialog(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmStartLiveSession}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Aceptar e Iniciar Clase
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 6: CONFIRMACIÓN PARA ELIMINAR CURSO (Requirement 10) */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#040e1d] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                ¿Eliminar este curso?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                ¿Estás seguro que deseas eliminar el curso <strong className="text-white">"{courseToDelete.title}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCourse(courseToDelete.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-black shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
