import React, { useState } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Presentation, 
  HelpCircle, 
  Globe, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  MessageSquare,
  Award,
  PlayCircle
} from 'lucide-react';
import { Logo } from '../Logo.tsx';
import { InstructorProfile } from '../../types/instructor.ts';

interface TeacherLandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  onSwitchToStudentPortal: () => void;
  activeInstructor: InstructorProfile | null;
}

export const TeacherLandingPage: React.FC<TeacherLandingPageProps> = ({
  onOpenRegister,
  onOpenLogin,
  onOpenDashboard,
  onSwitchToStudentPortal,
  activeInstructor,
}) => {
  // Earnings Calculator State (Course price slider + students)
  const [coursePrice, setCoursePrice] = useState<number>(79.99);
  const [studentsCount, setStudentsCount] = useState<number>(30);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSkill, setContactSkill] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Pure course sales calculation (Req 4: Pro Caribe royalties removed from calculator)
  const grossDirectSales = coursePrice * studentsCount;
  const teacherDirectShare = grossDirectSales * 0.65; // internal net share
  const totalMonthlyEstimatedEarnings = teacherDirectShare;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactSkill('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030d1a] text-white selection:bg-cyan-500/30 font-sans">
      {/* Top Portal Switch Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-b border-cyan-500/20 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-200">Portal Oficial de Instructores & Creadores</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-cyan-300/90">Inscripción gratuita • Genera ingresos extra en dólares</span>
          </div>

          <button
            onClick={onSwitchToStudentPortal}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer group whitespace-nowrap"
          >
            <span>Ir al Portal de Estudiantes</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Header - Clean, non-overlapping, with no percent, no dead links, and unobstructed buttons (Req 1, 3, 5) */}
      <header className="sticky top-0 z-40 bg-[#030d1a]/95 backdrop-blur-md border-b border-cyan-900/40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 overflow-visible">
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <div className="hidden sm:flex flex-col border-l border-cyan-900/60 pl-3">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-400 leading-none whitespace-nowrap">
                Instructors Hub
              </span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5 whitespace-nowrap">
                Enseña y Gana Dinero Extra
              </span>
            </div>
          </div>

          {/* Clean Navigation Links - Removed Herramientas de Docente, Preguntas Frecuentes y Porcentaje (Req 1) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 whitespace-nowrap">
            <a href="#modelo" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Cómo Funciona
            </a>
            <a href="#calculadora" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Calculadora
            </a>
            <a href="#pro-caribe" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Plan Pro Caribe
            </a>
          </nav>

          {/* Right Actions - Button text fixed to 'Registro Gratis' and guaranteed visible without truncation (Req 5) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 whitespace-nowrap">
            {activeInstructor ? (
              <button
                onClick={onOpenDashboard}
                className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Dashboard Docente</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onOpenRegister}
                  className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
                >
                  Registro Gratis
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Punta Cana Academy • Instructors Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Cualquier habilidad que tengas,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500">
              la puedes enseñar y ganar dinero extra
            </span>{' '}
            con nosotros
          </h1>

          {/* Req 2: 'Elige el precio de tus cursos' (No entre 49 y 150) & Req 3: 'Bonificaciones mensuales' (No 10% fondo) */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Convierte tus conocimientos en idiomas, hotelería, programación, buceo, cocina, marketing o negocios en cursos rentables. 
            <strong> Registro 100% gratuito</strong>, <strong>elige el precio de tus cursos</strong>, genera atractivos ingresos extra en dólares y recibe <strong>bonificaciones mensuales</strong> con el Plan Pro Caribe.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={activeInstructor ? onOpenDashboard : onOpenRegister}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{activeInstructor ? 'Ir a Mi Dashboard' : 'Empezar a Enseñar Gratis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#calculadora"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>Calcular Ingresos Estimados</span>
            </a>
          </div>

          {/* Quick Metrics Bar - Req 2 & Req 3 strictly applied */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Costo de Registro</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">Gratis</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Inscripción libre para docentes</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ingresos Extra</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">En Dólares</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Vía PayPal o Banco Dominicano</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tus Cursos</p>
              <p className="text-base sm:text-lg font-black text-slate-200 mt-1">Elige el precio de tus cursos</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Control total de tus contenidos</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Plan Pro Caribe</p>
              <p className="text-base sm:text-lg font-black text-teal-300 mt-1">Bonificaciones mensuales</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Ingresos adicionales continuos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Revenue Calculator - Req 2 (solo debe salir 'elige el precio de tus cursos') & Req 4 (eliminemos las regalias procaribe del calculo) */}
      <section id="calculadora" className="py-14 bg-[#041224] border-y border-cyan-950/60 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Simulador de Ingresos</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">Calculadora de Ganancias para Docentes</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              Elige el precio de tus cursos y proyecta la cantidad estimada de alumnos matriculados.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Sliders Input (Course price + Students only - Pro Caribe removed from calculation) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-200">
                    Elige el precio de tus cursos
                  </label>
                  <span className="text-base font-black text-cyan-400">${coursePrice.toFixed(2)} USD</span>
                </div>
                <input
                  type="range"
                  min="49.99"
                  max="150"
                  step="1"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                  <span>Precio Mínimo</span>
                  <span>Precio Máximo</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-200">
                    Alumnos estimados matriculados en tus cursos
                  </label>
                  <span className="text-base font-black text-cyan-400">{studentsCount} alumnos</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={studentsCount}
                  onChange={(e) => setStudentsCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>5 alumnos</span>
                  <span>200 alumnos</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Los pagos a profesores se realizan de manera puntual a través de <strong>PayPal</strong> o <strong>Transferencias Bancarias</strong> directas a tu cuenta.
                </span>
              </div>
            </div>

            {/* Live Breakdown Result (Calculated purely from course sales) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#06182c] to-[#040e1d] border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Total Estimado de Ganancias</p>
              
              <div className="mt-3 mb-5 pb-5 border-b border-slate-800">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                  ${totalMonthlyEstimatedEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-400 block mt-1">USD estimados de ingresos extra</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Volumen Total Facturado:</span>
                  <span className="font-semibold text-slate-200">${grossDirectSales.toFixed(2)} USD</span>
                </div>

                <div className="flex justify-between items-center text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="font-bold">Ganancia Neta por Ventas:</span>
                  <span className="font-black">+${teacherDirectShare.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                </div>

                <div className="flex justify-between items-center text-slate-400 pt-1 text-[11px]">
                  <span>Métodos de Retiro:</span>
                  <span className="font-semibold text-cyan-300">PayPal & Transferencia Bancaria</span>
                </div>
              </div>

              <button
                onClick={activeInstructor ? onOpenDashboard : onOpenRegister}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>{activeInstructor ? 'Entrar a Mi Dashboard' : 'Empezar a Generar Ingresos Extra'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Caribe Section Explanation - Req 3: strictly 'Bonificaciones mensuales', Req 4: kept exclusively here */}
      <section id="pro-caribe" className="py-14 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Bonificaciones mensuales • Plan Pro Caribe</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Bonificaciones mensuales con el Plan Pro Caribe
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Nuestros estudiantes inscritos en la membresía <strong>Pro Caribe</strong> tienen acceso a los cursos aprobados. 
                A cambio, tú ofreces sesiones de asesoría didáctica y clases virtuales en el horario que mejor te convenga, recibiendo <strong>bonificaciones mensuales</strong> continuas directamente transferidas a tu cuenta.
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ingresos extra recurrentes mes a mes además de las ventas directas de tus cursos.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Horarios 100% flexibles: programas tus clases virtuales y asesorías según tu disponibilidad.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pagos garantizados y procesados a través de PayPal o Transferencia Bancaria.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#040e1c] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>¿Cómo funcionan las Bonificaciones mensuales?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada mes se calcula una compensación adicional para los profesores activos cuyos cursos son tomados por miembros del Plan Pro Caribe y que ofrecen tutorías en vivo.
              </p>
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Tipo de ingreso:</span>
                  <span className="font-bold text-teal-300">Bonificaciones mensuales continuas</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Canales de pago:</span>
                  <span className="font-bold text-cyan-400">PayPal o Transferencia Bancaria</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Frecuencia:</span>
                  <span className="font-bold text-slate-200">Día 1 de cada mes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="modelo" className="py-14 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Paso a Paso</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">Cómo empezar a enseñar en 4 simples pasos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative">
            <span className="text-3xl font-black text-cyan-500/30">01</span>
            <h4 className="text-sm font-bold text-white mt-1">Registro Gratis</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Crea tu perfil docente en 1 minuto indicando tu especialidad y tu cuenta de PayPal o transferencia bancaria.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative">
            <span className="text-3xl font-black text-cyan-500/30">02</span>
            <h4 className="text-sm font-bold text-white mt-1">Crea tu Curso y Temario</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Elige el precio de tus cursos con total libertad, redacta unidades y sube tus diapositivas, videos y prácticas.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative">
            <span className="text-3xl font-black text-cyan-500/30">03</span>
            <h4 className="text-sm font-bold text-white mt-1">Revisión Académica Ágil</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Nuestro equipo pedagógico valida el contenido en menos de 24 horas y se publica de inmediato en el Marketplace.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative">
            <span className="text-3xl font-black text-cyan-500/30">04</span>
            <h4 className="text-sm font-bold text-white mt-1">Enseña y Gana Dinero Extra</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Recibe tus ingresos netos directamente transferidos a PayPal o a tu cuenta bancaria dominicana o internacional.
            </p>
          </div>
        </div>
      </section>

      {/* Teacher Contact Form */}
      <section id="contacto" className="py-14 max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-b from-slate-900 to-[#040e1d] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Contacto & Asesoría Pedagógica</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">¿Tienes preguntas antes de empezar?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Escríbenos y nuestro equipo de coordinación docente en Punta Cana te guiará para estructurar tu curso con éxito.
            </p>

            {contactSubmitted ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Mensaje recibido con éxito! Un coordinador académico te contactará en breve.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-6 space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Lic. o Ing. Nombre"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="docente@ejemplo.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">¿Qué habilidad o materia deseas enseñar?</label>
                  <input
                    type="text"
                    value={contactSkill}
                    onChange={(e) => setContactSkill(e.target.value)}
                    placeholder="Ej. Bartending para Resorts, Inglés Front Desk, Programación con Python..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje o Consulta</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Cuéntanos brevemente sobre tu experiencia..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs hover:scale-101 transition-all cursor-pointer shadow-md"
                >
                  Enviar Consulta a Coordinación Docente
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Dedicated Instructor Footer */}
      <footer className="bg-[#020710] border-t border-slate-800 py-10 px-4 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <div>
              <p className="font-bold text-white text-xs">Punta Cana Academy Instructors Hub</p>
              <p className="text-[11px] text-slate-500">Plataforma oficial para creadores y docentes de la República Dominicana</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <a href="#modelo" className="hover:text-cyan-400 transition-colors">Cómo Funciona</a>
            <a href="#calculadora" className="hover:text-cyan-400 transition-colors">Calculadora</a>
            <a href="#pro-caribe" className="hover:text-cyan-400 transition-colors">Plan Pro Caribe</a>
            <button
              onClick={onSwitchToStudentPortal}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              Volver al Portal Estudiantes
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Punta Cana Academy Inc. Todos los derechos reservados.</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Sede Friusa & Campus Virtual Bávaro-Punta Cana</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
