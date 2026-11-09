/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection.tsx';
import { PricingView } from './components/PricingView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CoursesSection } from './components/CoursesSection.tsx';
import { CourseDetailPage } from './components/CourseDetailPage.tsx';
import { CoursesCatalogPage } from './components/CoursesCatalogPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { 
  PrivacyPolicyPage, 
  TermsOfServicePage, 
  CareersPage, 
  HelpCenterPage 
} from './components/LegalAndSupportPages.tsx';
import { Footer } from './components/Footer.tsx';
import { GoogleReviewsSection } from './components/GoogleReviewsSection.tsx';
import { ServicesFeaturesSection } from './components/ServicesFeaturesSection.tsx';
import { FAQPage } from './components/FAQPage.tsx';
import { PaymentGatewayModal } from './components/PaymentGatewayModal.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { VirtualClassroom } from './components/VirtualClassroom.tsx';
import { CourseCurriculumPlayer } from './components/CourseCurriculumPlayer.tsx';
import { Course, COURSES_LIST, getAllCourses } from './data/coursesData.ts';
import { StudentProfile, auth, fbSignOut } from './lib/firebase.ts';
import { Layers, GraduationCap, CreditCard, LogIn, ChevronDown } from 'lucide-react';
import { TeacherLandingPage } from './components/teacher/TeacherLandingPage.tsx';
import { TeacherDashboard } from './components/teacher/TeacherDashboard.tsx';
import { TeacherAuthModal } from './components/teacher/TeacherAuthModal.tsx';
import { InstructorProfile } from './types/instructor.ts';
import { getStoredInstructor } from './data/instructorData.ts';

type ActivePage = 'home' | 'courses' | 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'careers' | 'help' | 'dashboard' | 'classroom' | 'curriculum';

export default function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [showPricing, setShowPricing] = useState(false);
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  
  const [paymentGatewayState, setPaymentGatewayState] = useState<{
    isOpen: boolean;
    target?: string | null;
  }>({ isOpen: false, target: null });

  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
    target?: string | null;
    initialEmail?: string;
  }>({ isOpen: false, mode: 'signin', target: null, initialEmail: '' });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeClassroomCourse, setActiveClassroomCourse] = useState<string>('Inglés Bilingüe & Inmersión para Hotelería y Negocios');
  const [activeCurriculumCourseId, setActiveCurriculumCourseId] = useState<string | undefined>(undefined);
  const [activeCurriculumCourseTitle, setActiveCurriculumCourseTitle] = useState<string | undefined>(undefined);

  // Teacher / Instructors Hub State
  const [portalMode, setPortalMode] = useState<'student' | 'instructor'>(() => {
    return (localStorage.getItem('pca_portal_mode') as 'student' | 'instructor') || 'student';
  });
  const [activeInstructor, setActiveInstructor] = useState<InstructorProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pca_active_instructor');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const [teacherView, setTeacherView] = useState<'landing' | 'dashboard'>('landing');
  const [teacherAuthModalState, setTeacherAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
  }>({ isOpen: false, mode: 'signup' });

  // Load stored student session on start and purge any legacy mock courses
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pca_active_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.enrolledCourses)) {
          parsed.enrolledCourses = parsed.enrolledCourses.filter(
            (c: string) => 
              c !== 'ingles-bilingue-hoteleria' && 
              c !== 'full-stack-web-dev' && 
              c !== 'ia-para-negocios' && 
              c !== 'ai-masterclass-negocios'
          );
          if (parsed.averageGrade === 95 || parsed.averageGrade === 96 || parsed.averageGrade === 98) {
            parsed.averageGrade = 0;
          }
          parsed.completedLessons = [];
          parsed.completedExams = 0;
          localStorage.setItem('pca_active_student', JSON.stringify(parsed));
        }
        setActiveStudent(parsed);
      }
    } catch (e) {
      console.warn('Could not parse local student profile:', e);
    }
  }, []);

  const navigateTo = (page: ActivePage) => {
    setSelectedCourse(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPaymentGateway = (targetItem?: string | null) => {
    setPaymentGatewayState({
      isOpen: true,
      target: targetItem || 'Prueba 12 Días',
    });
  };

  const openSignUpModal = (targetItem?: string | null, email?: string) => {
    setAuthModalState({
      isOpen: true,
      mode: 'signup',
      target: targetItem || 'Prueba 12 Días',
      initialEmail: email || '',
    });
  };

  const openLoginModal = () => {
    setAuthModalState({
      isOpen: true,
      mode: 'signin',
      target: null,
      initialEmail: '',
    });
  };

  const handleStudentAuthSuccess = (student: StudentProfile) => {
    setActiveStudent(student);
    setPaymentGatewayState({ isOpen: false, target: null });
    setAuthModalState({ isOpen: false, mode: 'signin', target: null });
    setShowPricing(false);
    setSelectedCourse(null);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterClassroom = (courseTitle: string) => {
    setActiveClassroomCourse(courseTitle);
    setCurrentPage('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    fbSignOut(auth).catch(() => {});
    localStorage.removeItem('pca_active_student');
    setActiveStudent(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToInstructorPortal = () => {
    setPortalMode('instructor');
    localStorage.setItem('pca_portal_mode', 'instructor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToStudentPortal = () => {
    setPortalMode('student');
    localStorage.setItem('pca_portal_mode', 'student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeacherAuthSuccess = (instructorProfile: InstructorProfile) => {
    setActiveInstructor(instructorProfile);
    setTeacherView('dashboard');
    setTeacherAuthModalState({ isOpen: false, mode: 'signin' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeacherLogout = () => {
    localStorage.removeItem('pca_active_instructor');
    setActiveInstructor(null);
    setTeacherView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleCustomOpenLogin = () => openLoginModal();
    window.addEventListener('open-login-modal', handleCustomOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleCustomOpenLogin);
  }, []);

  // Default fallback student if user opens dashboard without prior session
  const currentOrFallbackStudent: StudentProfile = activeStudent || {
    uid: 'stu_demo_01',
    email: 'estudiante@puntacanaacademy.com',
    displayName: 'Estudiante',
    role: 'student',
    plan: 'free_trial',
    trialStartDate: new Date().toISOString(),
    trialExpiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    enrolledCourses: [],
    attendanceRate: 100,
    averageGrade: 0,
    completedLessons: [],
    completedExams: 0,
  };

  // 0. TEACHER PORTAL / INSTRUCTORS HUB (Dedicated experience for teachers and creators)
  if (portalMode === 'instructor') {
    if (teacherView === 'dashboard') {
      return (
        <>
          <TeacherDashboard
            instructor={activeInstructor}
            onLogout={handleTeacherLogout}
            onBackToHome={() => {
              setTeacherView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToStudentPortal={handleSwitchToStudentPortal}
          />
          <TeacherAuthModal
            isOpen={teacherAuthModalState.isOpen}
            initialMode={teacherAuthModalState.mode}
            onClose={() => setTeacherAuthModalState({ isOpen: false, mode: 'signup' })}
            onSuccess={handleTeacherAuthSuccess}
          />
        </>
      );
    }

    return (
      <>
        <TeacherLandingPage
          activeInstructor={activeInstructor}
          onOpenRegister={() => setTeacherAuthModalState({ isOpen: true, mode: 'signup' })}
          onOpenLogin={() => setTeacherAuthModalState({ isOpen: true, mode: 'signin' })}
          onOpenDashboard={() => {
            if (!activeInstructor) {
              const defaultInst = getStoredInstructor();
              setActiveInstructor(defaultInst);
            }
            setTeacherView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToStudentPortal={handleSwitchToStudentPortal}
        />
        <TeacherAuthModal
          isOpen={teacherAuthModalState.isOpen}
          initialMode={teacherAuthModalState.mode}
          onClose={() => setTeacherAuthModalState({ isOpen: false, mode: 'signup' })}
          onSuccess={handleTeacherAuthSuccess}
        />
      </>
    );
  }

  // 1. VIRTUAL CLASSROOM (Aula Virtual estilo Schoola con video, chat y temario)
  if (currentPage === 'classroom') {
    return (
      <VirtualClassroom
        courseTitle={activeClassroomCourse}
        student={currentOrFallbackStudent}
        onBackToDashboard={() => {
          setCurrentPage('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 2. DEDICATED COURSE CURRICULUM & AUTO-LEARNING PLAYER (Unidades, Temas, Diapositivas, Videos, Quizzes y Prácticas)
  if (currentPage === 'curriculum') {
    return (
      <CourseCurriculumPlayer
        courseId={activeCurriculumCourseId}
        courseTitle={activeCurriculumCourseTitle}
        student={currentOrFallbackStudent}
        onBackToDashboard={() => {
          setCurrentPage('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEnterLiveClassroom={(title) => {
          setActiveClassroomCourse(title);
          setCurrentPage('classroom');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onProgressUpdated={(newPercentage) => {
          if (activeStudent) {
            const updated = {
              ...activeStudent,
              averageGrade: Math.max(activeStudent.averageGrade || 90, 95)
            };
            setActiveStudent(updated);
            localStorage.setItem('pca_active_student', JSON.stringify(updated));
          }
        }}
      />
    );
  }

  // 3. STUDENT DASHBOARD (Fiel a image_53bfb756.png con métricas, calendario y accesos)
  if (currentPage === 'dashboard') {
    return (
      <StudentDashboard
        student={currentOrFallbackStudent}
        onEnterClassroom={handleEnterClassroom}
        onLogout={handleLogout}
        onBackToHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPaymentGateway={openPaymentGateway}
        onUpdateStudent={(updated) => {
          setActiveStudent(updated);
          localStorage.setItem('pca_active_student', JSON.stringify(updated));
        }}
        onOpenCurriculum={(cId, cTitle) => {
          if (cId) setActiveCurriculumCourseId(cId);
          if (cTitle) setActiveCurriculumCourseTitle(cTitle);
          setCurrentPage('curriculum');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenInstructorPortal={handleSwitchToInstructorPortal}
      />
    );
  }

  // 3. If viewing an individual Course Detail Page
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-[#020713] text-white">
        <CourseDetailPage
          course={selectedCourse}
          onBack={() => {
            setSelectedCourse(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPricing={() => setShowPricing(true)}
          onOpenLogin={openLoginModal}
          onOpenSignUp={(courseTitle) => openSignUpModal(courseTitle || selectedCourse.title)}
          onSelectOtherCourse={(course) => {
            setSelectedCourse(course);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          allCourses={getAllCourses()}
        />

        {showPricing && (
          <PricingView
            onClose={() => setShowPricing(false)}
            onGoHome={() => navigateTo('home')}
            onSelectCourse={() => {
              setShowPricing(false);
              navigateTo('courses');
            }}
            onOpenSignUp={(planName) => {
              setShowPricing(false);
              openSignUpModal(planName);
            }}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateContact={() => navigateTo('contact')}
            onNavigatePrivacy={() => navigateTo('privacy')}
            onNavigateTerms={() => navigateTo('terms')}
            onNavigateCareers={() => navigateTo('careers')}
            onNavigateHelp={() => navigateTo('help')}
          />
        )}

        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          initialEmail={authModalState.initialEmail}
          targetPlanOrCourse={authModalState.target}
          onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
          onSuccess={handleStudentAuthSuccess}
          onOpenPaymentGateway={openPaymentGateway}
        />

        <PaymentGatewayModal
          isOpen={paymentGatewayState.isOpen}
          targetPlanOrCourse={paymentGatewayState.target}
          onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
          onSuccess={handleStudentAuthSuccess}
        />
      </div>
    );
  }

  // 4. Dedicated Courses Catalog Page
  if (currentPage === 'courses') {
    return (
      <>
        <CoursesCatalogPage
          onBack={() => navigateTo('home')}
          onSelectCourse={(course) => {
            setSelectedCourse(course);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPricing={() => setShowPricing(true)}
          onOpenLogin={openLoginModal}
          onOpenSignUp={() => openSignUpModal('Cursos Oficiales')}
          onOpenContact={() => navigateTo('contact')}
        />
        {showPricing && (
          <PricingView
            onClose={() => setShowPricing(false)}
            onGoHome={() => navigateTo('home')}
            onSelectCourse={() => {
              setShowPricing(false);
              navigateTo('courses');
            }}
            onOpenSignUp={(planName) => {
              setShowPricing(false);
              openSignUpModal(planName);
            }}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateContact={() => navigateTo('contact')}
            onNavigatePrivacy={() => navigateTo('privacy')}
            onNavigateTerms={() => navigateTo('terms')}
            onNavigateCareers={() => navigateTo('careers')}
            onNavigateHelp={() => navigateTo('help')}
          />
        )}
        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          initialEmail={authModalState.initialEmail}
          targetPlanOrCourse={authModalState.target}
          onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
          onSuccess={handleStudentAuthSuccess}
          onOpenPaymentGateway={openPaymentGateway}
        />
        <PaymentGatewayModal
          isOpen={paymentGatewayState.isOpen}
          targetPlanOrCourse={paymentGatewayState.target}
          onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
          onSuccess={handleStudentAuthSuccess}
        />
      </>
    );
  }

  // 5. Contact Page
  if (currentPage === 'contact') {
    return (
      <>
        <ContactPage
          onBack={() => navigateTo('home')}
          onOpenPricing={() => setShowPricing(true)}
          onOpenCourses={() => navigateTo('courses')}
          onOpenLogin={openLoginModal}
        />
        {showPricing && (
          <PricingView
            onClose={() => setShowPricing(false)}
            onGoHome={() => navigateTo('home')}
            onSelectCourse={() => {
              setShowPricing(false);
              navigateTo('courses');
            }}
            onOpenSignUp={(planName) => {
              setShowPricing(false);
              openSignUpModal(planName);
            }}
          />
        )}
        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          initialEmail={authModalState.initialEmail}
          targetPlanOrCourse={authModalState.target}
          onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
          onSuccess={handleStudentAuthSuccess}
          onOpenPaymentGateway={openPaymentGateway}
        />
        <PaymentGatewayModal
          isOpen={paymentGatewayState.isOpen}
          targetPlanOrCourse={paymentGatewayState.target}
          onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
          onSuccess={handleStudentAuthSuccess}
        />
      </>
    );
  }

  // 6. About Page (Nosotros)
  if (currentPage === 'about') {
    return (
      <>
        <AboutPage
          onBack={() => navigateTo('home')}
          onOpenPricing={() => setShowPricing(true)}
          onOpenCourses={() => navigateTo('courses')}
          onOpenContact={() => navigateTo('contact')}
          onOpenLogin={openLoginModal}
        />
        {showPricing && (
          <PricingView
            onClose={() => setShowPricing(false)}
            onGoHome={() => navigateTo('home')}
            onSelectCourse={() => {
              setShowPricing(false);
              navigateTo('courses');
            }}
            onOpenSignUp={(planName) => {
              setShowPricing(false);
              openSignUpModal(planName);
            }}
          />
        )}
        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          initialEmail={authModalState.initialEmail}
          targetPlanOrCourse={authModalState.target}
          onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
          onSuccess={handleStudentAuthSuccess}
          onOpenPaymentGateway={openPaymentGateway}
        />
        <PaymentGatewayModal
          isOpen={paymentGatewayState.isOpen}
          targetPlanOrCourse={paymentGatewayState.target}
          onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
          onSuccess={handleStudentAuthSuccess}
        />
      </>
    );
  }

  // 7. Footer Subpages
  if (currentPage === 'privacy') {
    return (
      <PrivacyPolicyPage
        onBack={() => navigateTo('home')}
        onOpenPricing={() => setShowPricing(true)}
        onOpenCourses={() => navigateTo('courses')}
      />
    );
  }

  if (currentPage === 'terms') {
    return (
      <TermsOfServicePage
        onBack={() => navigateTo('home')}
        onOpenPricing={() => setShowPricing(true)}
        onOpenCourses={() => navigateTo('courses')}
      />
    );
  }

  if (currentPage === 'careers') {
    return (
      <CareersPage
        onBack={() => navigateTo('home')}
        onOpenPricing={() => setShowPricing(true)}
        onOpenCourses={() => navigateTo('courses')}
      />
    );
  }

  if (currentPage === 'help') {
    return (
      <HelpCenterPage
        onBack={() => navigateTo('home')}
        onOpenPricing={() => setShowPricing(true)}
        onOpenCourses={() => navigateTo('courses')}
        onOpenFAQ={() => navigateTo('faq')}
      />
    );
  }

  if (currentPage === 'faq') {
    return (
      <>
        <FAQPage
          onBack={() => navigateTo('home')}
          onOpenPricing={() => setShowPricing(true)}
          onOpenCourses={() => navigateTo('courses')}
          onOpenAbout={() => navigateTo('about')}
          onOpenContact={() => navigateTo('contact')}
          onOpenSignUp={() => openSignUpModal('Prueba Gratuita 12 Días')}
          onNavigatePrivacy={() => navigateTo('privacy')}
          onNavigateTerms={() => navigateTo('terms')}
          onNavigateCareers={() => navigateTo('careers')}
          onNavigateHelp={() => navigateTo('help')}
          onOpenLogin={openLoginModal}
        />
        {showPricing && (
          <PricingView
            onClose={() => setShowPricing(false)}
            onGoHome={() => navigateTo('home')}
            onSelectCourse={() => {
              setShowPricing(false);
              navigateTo('courses');
            }}
            onOpenSignUp={(planName) => {
              setShowPricing(false);
              openSignUpModal(planName);
            }}
          />
        )}
        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          initialEmail={authModalState.initialEmail}
          targetPlanOrCourse={authModalState.target}
          onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
          onSuccess={handleStudentAuthSuccess}
          onOpenPaymentGateway={openPaymentGateway}
        />
        <PaymentGatewayModal
          isOpen={paymentGatewayState.isOpen}
          targetPlanOrCourse={paymentGatewayState.target}
          onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
          onSuccess={handleStudentAuthSuccess}
        />
      </>
    );
  }

  // 8. Default Home View
  return (
    <div className="min-h-screen bg-[#020713] text-white relative font-sans selection:bg-cyan-500/30">
      {/* Primary Hero Section with Background Looping Video */}
      <HeroSection
        onOpenPricing={() => setShowPricing(true)}
        onOpenLogin={openLoginModal}
        onOpenSignUp={(email) => openSignUpModal('Prueba Gratuita 12 Días', email)}
        onOpenCoursesCatalog={() => navigateTo('courses')}
        onOpenAbout={() => navigateTo('about')}
        onOpenContact={() => navigateTo('contact')}
        onOpenFAQ={() => navigateTo('faq')}
        student={activeStudent}
        onOpenDashboard={() => navigateTo('dashboard')}
        onOpenInstructorPortal={handleSwitchToInstructorPortal}
      />

      {/* Button below hero: 'Explorar Cursos Oficiales' */}
      <div className="relative -mt-10 sm:-mt-16 pb-6 sm:pb-8 flex flex-col items-center justify-center z-20 px-4">
        <button
          onClick={() => navigateTo('courses')}
          className="liquid-glass rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all hover:bg-cyan-950/40 cursor-pointer shadow-xl border border-cyan-500/30 group"
        >
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span>Explorar Cursos Oficiales</span>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Index Preview: 3 courses preview + 'Ver más cursos' button */}
      <div id="courses-section" className="relative z-10 border-t border-cyan-950/50 bg-[#020713]">
        <CoursesSection
          onSelectCourse={(course) => {
            setSelectedCourse(course);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateCatalog={() => navigateTo('courses')}
          onOpenPricing={() => setShowPricing(true)}
          onOpenSignUp={(target) => openSignUpModal(target)}
        />
      </div>

      {/* Services and Campus Features Section */}
      <ServicesFeaturesSection
        onOpenSignUp={() => openSignUpModal('Admisión en Línea')}
        onOpenContact={() => navigateTo('contact')}
      />

      {/* Google Reviews Section */}
      <GoogleReviewsSection />

      {/* Main Page Footer with relocated rounded navigator bar */}
      <Footer
        onNavigateHome={() => navigateTo('home')}
        onNavigateCourses={() => navigateTo('courses')}
        onNavigatePricing={() => setShowPricing(true)}
        onNavigateAbout={() => navigateTo('about')}
        onNavigateContact={() => navigateTo('contact')}
        onNavigateFAQ={() => navigateTo('faq')}
        onNavigatePrivacy={() => navigateTo('privacy')}
        onNavigateTerms={() => navigateTo('terms')}
        onNavigateCareers={() => navigateTo('careers')}
        onNavigateHelp={() => navigateTo('help')}
        onOpenLogin={openLoginModal}
        onOpenInstructorPortal={handleSwitchToInstructorPortal}
      />

      {/* Pricing View Modal */}
      {showPricing && (
        <PricingView
          onClose={() => setShowPricing(false)}
          onGoHome={() => {
            setShowPricing(false);
            navigateTo('home');
          }}
          onSelectCourse={() => {
            setShowPricing(false);
            navigateTo('courses');
          }}
          onOpenSignUp={(planName) => {
            setShowPricing(false);
            openSignUpModal(planName);
          }}
          onNavigateAbout={() => {
            setShowPricing(false);
            navigateTo('about');
          }}
          onNavigateContact={() => {
            setShowPricing(false);
            navigateTo('contact');
          }}
          onNavigatePrivacy={() => {
            setShowPricing(false);
            navigateTo('privacy');
          }}
          onNavigateTerms={() => {
            setShowPricing(false);
            navigateTo('terms');
          }}
          onNavigateCareers={() => {
            setShowPricing(false);
            navigateTo('careers');
          }}
          onNavigateHelp={() => {
            setShowPricing(false);
            navigateTo('help');
          }}
        />
      )}

      {/* Keylight & Punta Cana Academy Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        initialEmail={authModalState.initialEmail}
        targetPlanOrCourse={authModalState.target}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'signin', target: null, initialEmail: '' })}
        onSuccess={handleStudentAuthSuccess}
        onOpenPaymentGateway={openPaymentGateway}
      />

      {/* Fast & Secure Payment Gateway Modal (Apple Pay, Google Pay, Credit/Debit Card) */}
      <PaymentGatewayModal
        isOpen={paymentGatewayState.isOpen}
        targetPlanOrCourse={paymentGatewayState.target}
        onClose={() => setPaymentGatewayState({ isOpen: false, target: null })}
        onSuccess={handleStudentAuthSuccess}
      />
    </div>
  );
}
