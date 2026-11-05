import React, { useState } from 'react';
import { Course } from '../data/coursesData.ts';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  MapPin, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  GraduationCap,
  Briefcase,
  Target,
  FileCheck,
  Lock,
  Sparkles
} from 'lucide-react';
import { SecurityBadges } from './SecurityBadges.tsx';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: (courseTitle?: string) => void;
  onSelectOtherCourse: (course: Course) => void;
  allCourses: Course[];
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  onBack,
  onOpenPricing,
  onOpenLogin,
  onOpenSignUp,
  onSelectOtherCourse,
  allCourses,
}) => {
  const [activeTab, setActiveTab] = useState<'descripcion' | 'temario' | 'instructor'>('descripcion');

  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
              <span className="hidden sm:inline">Volver al Catálogo</span>
              <span className="sm:hidden">Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          {/* Centered Logo on Mobile (only icon), full text on desktop */}
          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenLogin}
              className="hidden sm:inline-block text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 cursor-pointer"
            >
              Ingresar
            </button>
            <button
              onClick={() => onOpenSignUp(course.title)}
              className="btn-gradient-cyan px-4 sm:px-5 py-2 rounded-full text-xs md:text-sm font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              Inscribirme
            </button>
          </div>
        </div>
      </header>

      {/* Main Course Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-400 mb-6 overflow-hidden">
          <button onClick={onBack} className="hover:text-cyan-400 transition-colors shrink-0">Cursos</button>
          <span>/</span>
          <span className="text-cyan-400 font-medium shrink-0">{course.category}</span>
          <span>/</span>
          <span className="text-slate-300 truncate">{course.title}</span>
        </nav>

        {/* Hero Section of Course */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left Column: Title & Key Details & Deep Extended Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                Nivel: {course.level}
              </span>
              {/* Etiqueta de Certificación Oficial */}
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                Certificación Oficial Incluida
              </span>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              {course.subtitle}
            </p>

            {/* Meta Row: Student count removed as requested in #7 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-cyan-950/40">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">{course.duration}</div>
                  <div className="text-[11px] text-slate-400">Duración del Curso</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Friusa & Virtual</div>
                  <div className="text-[11px] text-slate-400">Modalidad Híbrida</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Oficial</div>
                  <div className="text-[11px] text-slate-400">Certificación Avalada</div>
                </div>
              </div>
            </div>

            {/* Instructor Quick Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl liquid-glass border border-cyan-900/30">
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 shrink-0 shadow-md"
              />
              <div>
                <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  Docente Titular
                </div>
                <div className="text-base font-bold text-white">
                  {course.instructor}
                </div>
                <div className="text-xs text-slate-300">
                  {course.instructorRole}
                </div>
              </div>
            </div>

            {/* Comprehensive Description in Desktop under Docente Titular */}
            <div className="space-y-6 pt-4">
              <div className="liquid-glass rounded-3xl p-6 sm:p-7 border border-cyan-900/40">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Visión Integral y Metodología Académica
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {course.longDescription}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  En Punta Cana Academy nuestro enfoque no es meramente teórico. Cada estudiante combina sesiones presenciales en nuestras instalaciones de Plaza Doña Bélgica (Friusa) con prácticas inmersivas en entornos hoteleros y laboratorios digitales. Los grupos reducidos garantizan retroalimentación constante del docente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl liquid-glass border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Perfil del Egresado</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Capacitado para integrarse de inmediato en posiciones clave de resorts 5 estrellas, agencias multinacionales o proyectos remotos internacionales con estándares globales.
                  </p>
                </div>

                <div className="p-5 rounded-2xl liquid-glass border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Acreditación Incluida</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Al completar los módulos y el proyecto final recibirás el diploma acreditado con código de verificación QR y validez internacional para tu currículum.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cover Photo & Fast Subscription CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 group">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-black/30 pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20">
                <span className="flex items-center gap-1.5 text-cyan-300 truncate">
                  <GraduationCap className="w-4 h-4 shrink-0" /> Punta Cana Academy
                </span>
                <span className="text-emerald-300 text-[11px] shrink-0">
                  Friusa & Online
                </span>
              </div>
            </div>

            {/* Prominent Membership Box */}
            <div className="liquid-glass-deep rounded-3xl p-6 sm:p-7 border border-cyan-500/40 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Membresía Oficial PCA
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/30">
                  12 Días Gratis
                </span>
              </div>

              {/* Price & Gold Button: Gratis con Pro Caribe */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-cyan-500/20 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Precio Individual del Curso</span>
                  <span className="text-xl font-black text-cyan-300">$79.99 USD</span>
                </div>
                
                {/* Gold Premium Button: Gratis con Pro Caribe */}
                <button
                  onClick={onOpenPricing}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
                  title="Totalmente gratis con tu membresía activa del Plan Pro Caribe"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Gratis con Pro Caribe</span>
                </button>
              </div>

              {/* Title: 'Inicia tu Prueba Hoy Mismo' (Req 4) */}
              <div className="text-xl sm:text-2xl font-black text-white mb-2">
                Inicia tu Prueba <span className="text-cyan-400">Hoy Mismo</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Con tu prueba gratuita de 12 días tienes acceso completo a las <strong>2 primeras unidades</strong> del curso.
              </p>
              
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-slate-300 mb-4 space-y-1.5">
                <div className="flex items-start gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><strong>Prueba Gratuita:</strong> Incluye Unidades 1 y 2 con diapositivas, videos y evaluaciones.</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-300">
                  <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><strong>Exclusivo Pro Caribe:</strong> Unidades avanzadas (3+), chat en vivo con profesores y herramientas IA.</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Button triggers registration modal */}
                <button
                  onClick={() => onOpenSignUp(course.title)}
                  className="w-full btn-gradient-cyan py-3.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Activar 12 Días Gratis</span>
                </button>
                <button
                  onClick={onOpenPricing}
                  className="w-full py-2.5 rounded-full liquid-glass text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-center"
                >
                  Ver todos los Planes de Membresía
                </button>
              </div>

              {/* Cancela cuando quieras with Security Badges (Req 5) */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-300 mb-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Sin permanencia
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cancela cuando quieras
                  </span>
                </div>

                {/* 3 Golden Security Badges (100% Transparent & Photorealistic 3D Gold) */}
                <div className="flex items-center justify-center py-1">
                  <SecurityBadges size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 border-b border-cyan-950/40 pb-4 mb-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('descripcion')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'descripcion'
                  ? 'btn-gradient-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Lo que aprenderás
            </button>
            <button
              onClick={() => setActiveTab('temario')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'temario'
                  ? 'btn-gradient-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Plan de Estudios (Temario)
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'instructor'
                  ? 'btn-gradient-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Sobre el Docente
            </button>
          </div>

          {/* TAB 1 */}
          {activeTab === 'descripcion' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="liquid-glass-deep rounded-3xl p-6 sm:p-8 border border-cyan-900/30">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                  Competencias Principales que Dominarás
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400 font-bold">
                        ✓
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg">
                  <Award className="w-7 sm:w-8 h-7 sm:h-8" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                    Certificación Oficial Punta Cana Academy
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {course.certification}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 */}
          {activeTab === 'temario' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs sm:text-sm text-slate-300 mb-2">
                El contenido está estructurado progresivamente en módulos prácticos con laboratorios en tiempo real.
              </div>
              <div className="space-y-4">
                {course.syllabus.map((item, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-2xl p-5 sm:p-6 border border-cyan-900/30 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        {item.module}
                      </h4>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 self-start sm:self-auto">
                        {item.duration}
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
                      {item.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3 */}
          {activeTab === 'instructor' && (
            <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/30 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover border-4 border-cyan-400 shadow-xl shrink-0"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {course.instructor}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300 font-semibold mb-3">
                    {course.instructorRole}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Especialista de alto calibre con más de 12 años de trayectoria capacitando equipos en República Dominicana, Estados Unidos y Latinoamérica. Pionero en metodologías de educación activa y mentoría personalizada para asegurar tu inserción laboral inmediata.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Explore More Courses */}
        <div className="pt-10 border-t border-cyan-950/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Otros Cursos Disponibles
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Aprende múltiples habilidades con la misma membresía de Punta Cana Academy.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {allCourses
              .filter((c) => c.id !== course.id)
              .slice(0, 3)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectOtherCourse(c)}
                  className="liquid-glass rounded-2xl p-4 sm:p-5 border border-cyan-900/30 hover:border-cyan-400/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={c.coverImage}
                      alt={c.title}
                      className="w-full h-32 sm:h-36 object-cover rounded-xl mb-3 group-hover:scale-102 transition-transform"
                    />
                    <div className="text-[11px] font-mono text-cyan-400 mb-1">
                      {c.category}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                    <span>{c.duration}</span>
                    <span className="text-cyan-400 font-semibold group-hover:underline">
                      Ver cursos
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <Footer
        onNavigateHome={onBack}
        onNavigateCourses={() => onBack()}
        onNavigatePricing={onOpenPricing}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
