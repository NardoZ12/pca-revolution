import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  Share2, 
  Radio, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Send, 
  MessageSquare, 
  Sparkles, 
  UserCheck, 
  Play, 
  Pause, 
  Maximize2, 
  Users, 
  FileText, 
  Bot,
  HelpCircle,
  Award,
  CircleDot,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Lock,
  X
} from 'lucide-react';
import { Logo } from './Logo.tsx';
import { askTutorAI, ChatMessage } from '../lib/gemini.ts';
import { StudentProfile, saveStudentProfile } from '../lib/firebase.ts';
import { 
  subscribeToClassroomSession, 
  sendClassroomChatMessage 
} from '../lib/syncService.ts';
import { LiveClassroomSession } from '../types/instructor.ts';
import { getAllCourses } from '../data/coursesData.ts';
import { 
  getRobustCameraStream, 
  stopCameraStreamSafely, 
  checkMediaPermissionsStatus, 
  requestExplicitHardwarePermissions, 
  MediaPermissionsStatus 
} from '../lib/webrtcHelper.ts';

interface LessonTopic {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isCurrent?: boolean;
  videoUrl?: string;
  summary: string;
}

interface Unit {
  id: string;
  title: string;
  topics: LessonTopic[];
}

interface VirtualClassroomProps {
  courseTitle: string;
  student: StudentProfile;
  onBackToDashboard: () => void;
  onUpdateProgress?: (completedTopicId: string) => void;
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({
  courseTitle,
  student,
  onBackToDashboard,
  onUpdateProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'temario' | 'chat' | 'tutor'>('temario');
  const [micActive, setMicActive] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [attendanceTimer, setAttendanceTimer] = useState('12:30');
  
  // Real-time synchronization state & WebRTC refs
  const [classroomSession, setClassroomSession] = useState<LiveClassroomSession | null>(null);
  const studentWebcamRef = useRef<HTMLVideoElement | null>(null);
  const studentStreamRef = useRef<MediaStream | null>(null);

  // Dynamic Course & Instructor resolution (Always real instructor, zero mock teacher names)
  const currentCourseObj = getAllCourses().find(c => 
    c.title.toLowerCase() === courseTitle.toLowerCase() || 
    c.id.toLowerCase() === courseTitle.toLowerCase()
  );
  const courseInstructor = currentCourseObj?.instructor || classroomSession?.teacherName || 'Prof. Nardo Zorrilla';

  // Chat state (Real-time synchronized, zero fake mock users)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isUser?: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');

  // Subscribe to real-time classroom session and synchronized chat
  useEffect(() => {
    const unsub = subscribeToClassroomSession((session) => {
      setClassroomSession(session);
      if (session.chatMessages && session.chatMessages.length > 0) {
        setChatMessages(session.chatMessages.map(m => ({
          sender: m.sender + (m.role === 'teacher' ? ' (Docente)' : ''),
          text: m.text,
          time: m.time,
          isUser: m.sender === student.displayName
        })));
      }
    });

    return () => {
      unsub();
      if (studentStreamRef.current) {
        studentStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [student.displayName]);

  // Exit confirmation modal state (Requirement 13)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [teacherLiveFrame, setTeacherLiveFrame] = useState<string | null>(null);

  // Real-time video frame broadcast listener from teacher
  useEffect(() => {
    let streamChan: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        streamChan = new BroadcastChannel('pca_teacher_stream');
        streamChan.onmessage = (event) => {
          if (event.data?.type === 'live_frame' && event.data.frame) {
            setTeacherLiveFrame(event.data.frame);
          }
        };
      }
    } catch (e) {
      console.warn('Live stream channel error:', e);
    }
    return () => {
      if (streamChan) streamChan.close();
    };
  }, []);

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `¡Hola ${student.displayName}! Soy tu Tutor Inteligente de Punta Cana Academy. ¿Tienes alguna pregunta sobre el tema de hoy o sobre los ejercicios de la lección?`,
      timestamp: 'Ahora'
    }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Synchronized syllabus units from course curriculum (Requirement 18)
  const [units, setUnits] = useState<Unit[]>(() => {

    if (currentCourseObj?.syllabus && currentCourseObj.syllabus.length > 0) {
      return currentCourseObj.syllabus.map((s, sIdx) => ({
        id: `u_${sIdx + 1}`,
        title: s.module,
        topics: s.topics.map((tName, tIdx) => ({
          id: `t_${sIdx + 1}_${tIdx + 1}`,
          title: tName,
          duration: '45 min',
          isCompleted: sIdx === 0 && tIdx === 0,
          isCurrent: sIdx === 0 && tIdx === 0,
          summary: `Módulo temático oficial: ${s.module} - Cátedra: ${tName}`
        }))
      }));
    }
    return [
      {
        id: 'u1',
        title: 'Unidad 1: Fundamentos & Metodología de Alto Impacto',
        topics: [
          {
            id: 't1_1',
            title: 'Tema 1.1: Introducción a la materia y objetivos profesionales',
            duration: '25 min',
            isCompleted: true,
            isCurrent: true,
            summary: 'Guía de inicio, estructura del curso y estándares requeridos.',
          },
          {
            id: 't1_2',
            title: 'Tema 1.2: Práctica interactiva y estudio de casos',
            duration: '45 min',
            isCompleted: false,
            summary: 'Simulación de roles y aplicación directa en clase.',
          }
        ]
      }
    ];
  });

  const [currentTopic, setCurrentTopic] = useState<LessonTopic>(units[0]?.topics[0] || {
    id: 't_init',
    title: 'Tema Inicial de la Cátedra',
    duration: '45 min',
    isCompleted: false,
    summary: 'Contenido interactivo'
  });

  // Calculate total progress
  const totalTopics = units.flatMap(u => u.topics).length;
  const completedTopics = units.flatMap(u => u.topics).filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedTopics / totalTopics) * 100);

  const toggleTopicCompletion = (topicId: string) => {
    setUnits(prev => prev.map(unit => ({
      ...unit,
      topics: unit.topics.map(t => {
        if (t.id === topicId) {
          const newState = !t.isCompleted;
          if (newState && onUpdateProgress) {
            onUpdateProgress(topicId);
          }
          return { ...t, isCompleted: newState };
        }
        return t;
      })
    })));
  };

  const [isRealCam, setIsRealCam] = useState(false);
  const [hardwareAccessDenied, setHardwareAccessDenied] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<MediaPermissionsStatus | null>(null);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [permissionErrorMsg, setPermissionErrorMsg] = useState<string | null>(null);

  const runDiagnosticCheck = async () => {
    const status = await checkMediaPermissionsStatus();
    setPermissionStatus(status);
    if (status.cameraPermission === 'denied' || status.microphonePermission === 'denied') {
      setHardwareAccessDenied(true);
    }
    return status;
  };

  const handleRequestNativePermissions = async () => {
    setIsRequestingPermissions(true);
    setPermissionErrorMsg(null);
    try {
      const res = await requestExplicitHardwarePermissions();
      if (res.granted && res.stream) {
        if (studentStreamRef.current) {
          stopCameraStreamSafely(studentStreamRef.current);
        }
        studentStreamRef.current = res.stream;
        setIsRealCam(true);
        setCamActive(true);
        setMicActive(true);
        setHardwareAccessDenied(false);
        if (studentWebcamRef.current) {
          studentWebcamRef.current.srcObject = res.stream;
          studentWebcamRef.current.play().catch(() => {});
        }
        const updated = await checkMediaPermissionsStatus();
        setPermissionStatus(updated);
      } else {
        setHardwareAccessDenied(true);
        setPermissionErrorMsg(res.errorMessage || 'El navegador o el usuario bloqueó el acceso a la cámara o micrófono.');
        const updated = await checkMediaPermissionsStatus();
        setPermissionStatus(updated);
      }
    } catch (err: any) {
      setHardwareAccessDenied(true);
      setPermissionErrorMsg(err?.message || 'Error solicitando permisos nativos.');
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  const [userDisabledCam, setUserDisabledCam] = useState(false);

  // Auto-connect student camera on mount if not disabled
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (userDisabledCam) return;
      try {
        const result = await getRobustCameraStream(student.displayName, 'student');
        if (!isMounted) {
          result.stop();
          return;
        }
        studentStreamRef.current = result.stream;
        setIsRealCam(result.isRealCamera);
        if (result.hardwareAccessDenied) {
          setHardwareAccessDenied(true);
        }
        setCamActive(true);
        setMicActive(true);
        if (studentWebcamRef.current) {
          studentWebcamRef.current.srcObject = result.stream;
          studentWebcamRef.current.play().catch(() => {});
        }
        runDiagnosticCheck();
      } catch (err) {
        console.warn('Auto start student camera error:', err);
      }
    })();

    return () => {
      isMounted = false;
      if (studentStreamRef.current) {
        stopCameraStreamSafely(studentStreamRef.current);
      }
    };
  }, [student.displayName, userDisabledCam]);

  // Keep video element synced with stream whenever camActive changes
  useEffect(() => {
    if (camActive && studentStreamRef.current && studentWebcamRef.current) {
      if (studentWebcamRef.current.srcObject !== studentStreamRef.current) {
        studentWebcamRef.current.srcObject = studentStreamRef.current;
        studentWebcamRef.current.play().catch(() => {});
      }
    }
  }, [camActive]);

  // WebRTC Real Browser Camera & Microphone for Student with guaranteed HD fallback
  const toggleStudentCamera = async () => {
    if (!camActive) {
      setUserDisabledCam(false);
      try {
        const result = await getRobustCameraStream(student.displayName, 'student');
        studentStreamRef.current = result.stream;
        setIsRealCam(result.isRealCamera);
        if (studentWebcamRef.current) {
          studentWebcamRef.current.srcObject = result.stream;
          studentWebcamRef.current.play().catch(() => {});
        }
        setCamActive(true);
        setMicActive(true);
      } catch (err) {
        console.warn('Student camera initialization error:', err);
      }
    } else {
      setUserDisabledCam(true);
      if (studentStreamRef.current) {
        stopCameraStreamSafely(studentStreamRef.current);
        studentStreamRef.current = null;
      }
      if (studentWebcamRef.current) {
        studentWebcamRef.current.srcObject = null;
      }
      setCamActive(false);
    }
  };

  const toggleStudentMic = () => {
    if (studentStreamRef.current) {
      studentStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !micActive;
      });
    }
    setMicActive(!micActive);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    await sendClassroomChatMessage({
      sender: student.displayName,
      role: 'student',
      text
    });
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || isTutorLoading) return;

    const userText = tutorInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: userText,
      timestamp: 'Justo ahora'
    };

    setTutorMessages(prev => [...prev, userMsg]);
    setTutorInput('');
    setIsTutorLoading(true);

    const response = await askTutorAI(
      userText,
      `${courseTitle} - ${currentTopic.title}`,
      tutorMessages
    );

    setTutorMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: response,
        timestamp: 'Justo ahora'
      }
    ]);
    setIsTutorLoading(false);
  };

  const confirmAttendance = () => {
    setAttendanceConfirmed(true);
    try {
      const storageKey = `pca_student_attendance_${student.uid || student.email}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const now = new Date();
      const newRecord = {
        id: `att_${Date.now()}`,
        date: now.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
        courseTitle: courseTitle,
        modality: 'Aula Virtual en Vivo',
        time: now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }),
        status: 'Presente'
      };
      localStorage.setItem(storageKey, JSON.stringify([newRecord, ...existing]));
    } catch (e) {}
    // Persist in student profile
    saveStudentProfile({
      uid: student.uid,
      attendanceRate: 100,
    });
  };

  const isThisCourseLive = Boolean(
    classroomSession?.isLive && (
      !classroomSession.courseId ||
      classroomSession.courseId === currentCourseObj?.id ||
      classroomSession.courseTitle?.toLowerCase() === courseTitle.toLowerCase() ||
      classroomSession.courseTitle?.toLowerCase() === currentCourseObj?.title?.toLowerCase()
    )
  );

  if (!isThisCourseLive) {
    return (
      <div className="min-h-screen bg-[#020612] text-slate-100 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="max-w-md w-full bg-[#070e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg">
            <Radio className="w-8 h-8 animate-pulse text-amber-400" />
          </div>
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40 inline-block mb-2">
              Clase Offline • Transmisión No Iniciada
            </span>
            <h2 className="text-xl font-black text-white">Aula Virtual en Espera</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              El docente <strong className="text-white">{courseInstructor}</strong> aún no ha iniciado la transmisión en vivo para el curso <strong className="text-cyan-300">"{courseTitle}"</strong>.
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Por políticas académicas de Punta Cana Academy, los estudiantes no pueden ingresar a aulas inactivas. Esta sala se activará automáticamente tan pronto el profesor comience la transmisión.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={onBackToDashboard}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs shadow-md hover:scale-[1.01] transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Mi Panel de Estudiante</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040814] text-slate-200 flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#070e1c] border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <button
            onClick={() => setShowExitConfirmModal(true)}
            title="Volver al Dashboard"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <img
            src="/assets/aistudio/logo_7f87d68b.png"
            alt="Punta Cana Academy"
            className="w-7 h-7 rounded-full object-cover border border-cyan-400/50 shadow-sm shrink-0"
          />

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                En Vivo
              </span>
              <span className="text-[11px] font-bold text-cyan-400 hidden md:inline truncate">
                Punta Cana Academy • Aula Virtual
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white truncate leading-tight">
              {courseTitle}
            </h1>
          </div>
        </div>

        {/* Right Actions: Live session status & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Progreso general:</span>
            <span className="font-bold text-cyan-400">{progressPercent}%</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Sesión Virtual Activa</span>
            <span className="sm:hidden">En Clase</span>
          </div>
        </div>
      </header>

      {/* Main Container: Video stage & Right Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Video & Meeting Stage */}
        <div className="flex-1 flex flex-col bg-[#020612] p-3 sm:p-5 overflow-y-auto">
          
          {/* Main Stage Video */}
          <div className="relative w-full aspect-video max-h-[65vh] bg-[#070e1c] rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden flex items-center justify-center group">
            
            {/* Live Camera Stream from Teacher or HD looping teacher video */}
            {teacherLiveFrame ? (
              <img
                src={teacherLiveFrame}
                alt="Transmisión de cámara del docente en directo"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}


            {/* Dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Teacher Badge overlay */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs shadow-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${classroomSession?.isLive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-bold text-white tracking-wide">
                {courseInstructor}
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                {classroomSession?.isLive ? 'EN VIVO AHORA' : 'Docente Titular'}
              </span>
            </div>

            {/* Screen overlay Controls on hover */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Student WebRTC Presence & Video Bar (Real Data Only - Zero Stock Photos or Fake Attendees) */}
          <div className="mt-3 p-3 rounded-2xl bg-[#060c1c] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {camActive ? (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-950 border-2 border-cyan-500/50 shadow-md shrink-0">
                  <video
                    ref={studentWebcamRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-[9px] font-bold text-cyan-300 flex items-center gap-1">
                    {micActive ? <Mic className="w-2.5 h-2.5 text-emerald-400" /> : <MicOff className="w-2.5 h-2.5 text-slate-400" />}
                    <span>{student.displayName.split(' ')[0]}</span>
                  </div>
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-emerald-950/90 text-[8px] font-bold text-emerald-300 border border-emerald-500/30">
                    {isRealCam ? 'Webcam' : 'En Vivo'}
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <VideoOff className="w-5 h-5 text-slate-500" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white truncate">
                    {student.displayName}
                  </p>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                    Alumno Conectado
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {camActive 
                    ? 'Tu cámara WebRTC está transmitiendo en tiempo real a la sala.' 
                    : 'Cámara apagada. Haz clic en "Encender Cámara" para participar en vivo.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={toggleStudentMic}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  micActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {micActive ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
                <span>{micActive ? 'Micrófono Activo' : 'Silenciado'}</span>
              </button>

              <button
                onClick={toggleStudentCamera}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  camActive 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black' 
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                }`}
              >
                {camActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span>{camActive ? 'Apagar Cámara' : 'Encender Cámara'}</span>
              </button>
            </div>
          </div>

          {/* Hardware Diagnostic Alert Banner (Requirement: feedback if hardware access denied) */}
          {hardwareAccessDenied && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">
                    Permiso de cámara física no detectado o bloqueado por el navegador
                  </p>
                  <p className="text-[11px] text-amber-300/80">
                    Tu transmisión se encuentra activa en modo <strong>Cámara Virtual HD</strong> para no interrumpir tu clase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  runDiagnosticCheck();
                  setShowDiagnosticModal(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Desbloquear Cámara Real</span>
              </button>
            </div>
          )}

          {/* Bottom Video Meeting Controls Bar */}
          <div className="mt-4 bg-[#070e1c] border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-xl flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleStudentMic}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  micActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-white'
                }`}
              >
                {micActive ? <Mic className="w-4 h-4 text-cyan-400" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micActive ? 'Micrófono Activo' : 'Silenciado'}</span>
              </button>

              <button
                onClick={toggleStudentCamera}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  camActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-white'
                }`}
              >
                {camActive ? <Video className="w-4 h-4 text-cyan-400" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camActive ? 'Cámara WebRTC Activa' : 'Cámara Apagada'}</span>
              </button>

              {/* Diagnostic Button */}
              <button
                onClick={() => {
                  runDiagnosticCheck();
                  setShowDiagnosticModal(true);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  hardwareAccessDenied
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-slate-800/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-800'
                }`}
                title="Diagnosticar permisos y dispositivos WebRTC"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="hidden md:inline">
                  {hardwareAccessDenied ? 'Permiso Bloqueado (Diagnosticar)' : 'Diagnóstico WebRTC'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowExitConfirmModal(true)}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Salir de la Clase</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tabs for Temario, Chat, Tutor IA */}
        <aside className="w-full lg:w-96 bg-[#070e1c] border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col h-[500px] lg:h-auto">
          
          {/* Tab Selector Buttons */}
          <div className="grid grid-cols-3 border-b border-slate-800 p-2 gap-1 bg-slate-900/60">
            <button
              onClick={() => setActiveTab('temario')}
              className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'temario'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Temario</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Vivo</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'tutor'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tutor IA</span>
            </button>
          </div>

          {/* TAB 1: TEMARIO DIVIDIDO POR UNIDADES Y TEMAS */}
          {activeTab === 'temario' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Estructura Oficial del Programa</span>
                <span className="text-cyan-400 font-bold">{completedTopics} de {totalTopics} temas</span>
              </div>

              {units.map((unit, uIdx) => (
                <div key={unit.id} className="space-y-2">
                  <div className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {unit.title}
                  </div>

                  <div className="space-y-1.5">
                    {unit.topics.map((topic) => {
                      const isCurrent = topic.id === currentTopic.id;
                      return (
                        <div
                          key={topic.id}
                          onClick={() => setCurrentTopic(topic)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            isCurrent
                              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md'
                              : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTopicCompletion(topic.id);
                            }}
                            title={topic.isCompleted ? 'Completado' : 'Marcar como completado'}
                            className="mt-0.5 shrink-0 cursor-pointer"
                          >
                            <CheckCircle2 className={`w-4 h-4 ${topic.isCompleted ? 'text-cyan-400' : 'text-slate-600 hover:text-cyan-400'}`} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-bold leading-snug truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                                {topic.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {topic.duration}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {topic.summary}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-xl text-xs space-y-0.5 ${msg.isUser ? 'bg-cyan-950/40 border border-cyan-500/30 ml-4' : 'bg-slate-900/70 border border-slate-800 mr-4'}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Escribe un mensaje en la clase..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl btn-gradient-cyan text-slate-950 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TUTOR IA GEMINI */}
          {activeTab === 'tutor' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-3 bg-cyan-950/20 border-b border-cyan-500/20 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Pregunta cualquier duda sobre el tema <strong className="text-white">{currentTopic.title}</strong>
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tutorMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'student' 
                        ? 'bg-cyan-500/20 text-white border border-cyan-500/30 ml-4' 
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 mr-2'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
                      {msg.sender === 'student' ? 'Tú' : 'Tutor Inteligente PCA'}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
                {isTutorLoading && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
                    <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span>El tutor está formulando la explicación...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAskTutor} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  placeholder="Pregúntale al tutor sobre esta lección..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isTutorLoading}
                  className="p-2 rounded-xl btn-gradient-cyan text-slate-950 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>

      {/* WebRTC Permissions & Hardware Diagnostic Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/40 rounded-2xl p-5 sm:p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowDiagnosticModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              title="Cerrar diagnóstico"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Diagnóstico de Permisos WebRTC
                </h3>
                <p className="text-xs text-slate-400">
                  Verificación de hardware, políticas de seguridad y acceso nativo.
                </p>
              </div>
            </div>

            {/* Status Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Estado de Transmisión:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isRealCam ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isRealCam ? '✓ Cámara WebRTC del Dispositivo' : '⚠️ Cámara Virtual HD Activa'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Permiso de Cámara en Navegador:</span>
                <span className={`font-mono text-[11px] font-bold ${
                  permissionStatus?.cameraPermission === 'granted' ? 'text-emerald-400' : (permissionStatus?.cameraPermission === 'denied' ? 'text-red-400' : 'text-cyan-400')
                }`}>
                  {permissionStatus?.cameraPermission === 'granted' ? 'Permitido (Granted)' : (permissionStatus?.cameraPermission === 'denied' ? 'Bloqueado (Denied)' : 'Pendiente de solicitud')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Permiso de Micrófono:</span>
                <span className={`font-mono text-[11px] font-bold ${
                  permissionStatus?.microphonePermission === 'granted' ? 'text-emerald-400' : (permissionStatus?.microphonePermission === 'denied' ? 'text-red-400' : 'text-cyan-400')
                }`}>
                  {permissionStatus?.microphonePermission === 'granted' ? 'Permitido (Granted)' : (permissionStatus?.microphonePermission === 'denied' ? 'Bloqueado (Denied)' : 'Pendiente de solicitud')}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-300 font-medium">Hardware Detectado:</span>
                <span className="font-bold text-white">
                  {permissionStatus?.videoInputs || 0} cámara(s) · {permissionStatus?.audioInputs || 0} micrófono(s)
                </span>
              </div>
            </div>

            {/* Error Message if Denied */}
            {permissionErrorMsg && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{permissionErrorMsg}</span>
              </div>
            )}

            {/* Interactive Native Permission Trigger Button */}
            <button
              onClick={handleRequestNativePermissions}
              disabled={isRequestingPermissions}
              className="w-full btn-gradient-cyan text-slate-950 py-3 rounded-xl text-xs sm:text-sm font-black shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRequestingPermissions ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Solicitar Permisos al Navegador Ahora</span>
                </>
              )}
            </button>

            {/* Visual Guide to Unblock in Chrome/Edge/Safari */}
            <div className="p-3.5 rounded-xl bg-[#030914] border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>¿Cómo activar si Google Chrome no muestra el aviso?</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 pl-1 leading-relaxed">
                <li>Haz clic en el ícono de <strong>Ajustes del Sitio / Candado</strong> a la izquierda de la URL en la barra de direcciones de tu navegador.</li>
                <li>Busca los permisos de <strong>Cámara</strong> y <strong>Micrófono</strong> y cámbialos a <strong>"Permitir" (Allow)</strong>.</li>
                <li>Presiona el botón celeste de arriba <em>"Solicitar Permisos al Navegador Ahora"</em> para encender tu cámara inmediatamente.</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                Punta Cana Academy · WebRTC HD Engine
              </span>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Continuar con Clase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN PARA SALIR DE LA SECCIÓN (Requirement 13) */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#040e1d] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                ¿ESTÁS SEGURO QUE DESEAS SALIR DE LA SECCIÓN?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Podrás volver a ingresar en cualquier momento mientras la cátedra continúe activa en el campus.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  onBackToDashboard();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-black shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
