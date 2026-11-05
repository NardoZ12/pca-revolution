import React, { useState, useMemo } from 'react';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  MapPin, 
  Award, 
  Clock, 
  CreditCard, 
  FileCheck,
  CheckCircle2,
  Briefcase,
  Laptop,
  GraduationCap
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'admisiones' | 'academia' | 'certificaciones' | 'pagos';
  question: string;
  answer: string;
  highlight?: string;
  icon: React.ElementType;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'prueba-12-dias',
    category: 'admisiones',
    question: '¿Cómo funciona exactamente la prueba gratuita de 12 días?',
    answer: 'Al registrarte en línea obtienes acceso ilimitado e inmediato al aula virtual y a los módulos introductorios de tu programa, además del derecho de asistir a dos clases presenciales en nuestro campus de Friusa. Durante estos 12 días puedes evaluar la metodología, interactuar con los docentes y comprobar la plataforma sin ningún compromiso de pago ni permanencia.',
    highlight: 'Acceso inmediato sin tarjeta de crédito obligatoria ni compromiso.',
    icon: Clock,
  },
  {
    id: 'ubicacion-presencial',
    category: 'academia',
    question: '¿Dónde está ubicada la sede presencial y qué facilidades tiene?',
    answer: 'Nuestro campus físico está ubicado en la Av. Estados Unidos 41201, Plaza Doña Bélgica, Local L5 (Segundo Nivel), en Friusa, Bávaro / Punta Cana. Las aulas cuentan con aire acondicionado de alta eficiencia, conectividad de fibra óptica dedicada, pantallas interactivas de proyección y parqueo vigilado.',
    highlight: 'Ubicación céntrica en Friusa con fácil acceso en transporte público.',
    icon: MapPin,
  },
  {
    id: 'validez-certificacion',
    category: 'certificaciones',
    question: '¿Qué validez tienen los certificados y cómo los verifican las empresas?',
    answer: 'Todos los diplomas y certificados emitidos por Punta Cana Academy cuentan con un código QR único e irrepetible enlazado a nuestra base de datos institucional. Cualquier empleador o departamento de Recursos Humanos de cadenas hoteleras, agencias o empresas de tecnología puede escanear el código para validar instantáneamente el nombre del graduado, las horas académicas cursadas y las competencias aprobadas.',
    highlight: 'Validación digital instantánea mediante código QR para Recursos Humanos.',
    icon: Award,
  },
  {
    id: 'turnos-rotativos',
    category: 'academia',
    question: 'Trabajo en hotelería con turnos rotativos, ¿puedo estudiar a mi propio ritmo?',
    answer: '¡Totalmente! Diseñamos nuestra metodología híbrida y 100% online pensando específicamente en la realidad laboral de la zona este. Si tu turno te impide asistir a una sesión presencial en Friusa, todas las clases quedan grabadas en alta definición en el aula virtual con acceso las 24 horas del día, los 7 días de la semana, para que avances a tu conveniencia sin perder el ritmo.',
    highlight: 'Flexibilidad 24/7 adaptada a turnos rotativos de resorts y aeropuertos.',
    icon: Laptop,
  },
  {
    id: 'requisitos-admision',
    category: 'admisiones',
    question: '¿Cuáles son los requisitos para inscribirme en un curso o programa?',
    answer: 'Para ingresar solo necesitas ser mayor de 16 años, tener documento de identidad vigente (cédula de identidad dominicana o pasaporte) y un dispositivo con conexión a internet (teléfono inteligente, tableta o computadora). No exigimos títulos universitarios previos para los cursos de idiomas o tecnología básica, solo tu compromiso de aprender.',
    highlight: 'Proceso de admisión simplificado 100% digital.',
    icon: FileCheck,
  },
  {
    id: 'metodos-pago-rd',
    category: 'pagos',
    question: '¿Qué métodos de pago aceptan en República Dominicana?',
    answer: 'Aceptamos transferencias bancarias nacionales en pesos dominicanos (DOP) y dólares (USD) a través de Banco Popular Dominicano, BHD y Banreservas. También puedes pagar con tarjetas de crédito/débito locales o internacionales (Visa, Mastercard), o en efectivo directamente en la secretaría académica de nuestra sede en Friusa.',
    highlight: 'Transferencias Banco Popular, BHD, Banreservas, tarjetas y efectivo.',
    icon: CreditCard,
  },
  {
    id: 'bolsa-empleo-convenios',
    category: 'certificaciones',
    question: '¿Tienen convenios o bolsa de empleo para egresados?',
    answer: 'Sí. A través de nuestra Dirección Académica y de Negocios mantenemos alianzas estratégicas con hoteles, aerolíneas, operadores turísticos y empresas tech de Punta Cana, Bávaro, Uvero Alto y Cap Cana. Los egresados destacados tienen prioridad en procesos de selección para recepcionistas bilingües, agentes de atención al huésped, supervisores y desarrolladores junior.',
    highlight: 'Conexión directa con empresas empleadoras de la región este.',
    icon: Briefcase,
  },
  {
    id: 'nivel-ingles-inicio',
    category: 'admisiones',
    question: '¿Qué pasa si empiezo desde cero en inglés o en programación?',
    answer: 'Todos nuestros programas cuentan con módulos de nivelación (A1 para idiomas y lógica básica en tecnología). Al momento de tu admisión realizamos una evaluación diagnóstica sin costo para ubicarte en el grupo correspondiente a tu nivel real, asegurando que aprendas paso a paso junto a compañeros con tu mismo nivel.',
    highlight: 'Evaluación diagnóstica sin costo al comenzar.',
    icon: CheckCircle2,
  },
  {
    id: 'cambio-modalidad',
    category: 'academia',
    question: '¿Puedo alternar entre clases presenciales en Friusa y clases online?',
    answer: 'Sí. Nuestra modalidad es verdaderamente híbrida: puedes cursar la teoría y laboratorios desde la comodidad de tu hogar y acudir a la sede de Friusa para talleres de inmersión conversacional o soporte docente personalizado, o viceversa, sin costo adicional ni trámites engorrosos.',
    highlight: 'Libertad de alternar entre campus presencial y plataforma online.',
    icon: GraduationCap,
  },
  {
    id: 'soporte-docente',
    category: 'academia',
    question: '¿Cómo recibo ayuda si tengo dudas durante mis clases o proyectos?',
    answer: 'Cada programa cuenta con tutores dedicados que responden dudas a través de la mesa de ayuda del aula virtual, canales de mensajería y sesiones de asesoría académica programadas semanalmente. Además, en la sede física de Friusa dispones de horarios de consulta presencial directa con los profesores titulares.',
    highlight: 'Mesa de ayuda digital permanente y asesorías presenciales semanales.',
    icon: HelpCircle,
  }
];

interface FAQPageProps {
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenCourses: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenSignUp: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  onNavigateCareers: () => void;
  onNavigateHelp: () => void;
  onOpenLogin?: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({
  onBack,
  onOpenPricing,
  onOpenCourses,
  onOpenAbout,
  onOpenContact,
  onOpenSignUp,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateCareers,
  onNavigateHelp,
  onOpenLogin,
}) => {
  const [openId, setOpenId] = useState<string>('prueba-12-dias');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? '' : id));
  };

  const categories = [
    { id: 'todos', label: 'Todas las preguntas' },
    { id: 'admisiones', label: 'Admisiones & Prueba' },
    { id: 'academia', label: 'Metodología & Campus' },
    { id: 'certificaciones', label: 'Certificaciones' },
    { id: 'pagos', label: 'Pagos & Planes' },
  ];

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.highlight && item.highlight.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      {/* Sticky Header with centered logo on mobile and back button */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
              <span>Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          {/* Centered Logo on Mobile (only icon), full text on desktop */}
          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenCourses}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1 cursor-pointer"
            >
              Cursos
            </button>
            <button
              onClick={onOpenAbout}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1 cursor-pointer"
            >
              Nosotros
            </button>
            <button
              onClick={onOpenContact}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1 cursor-pointer"
            >
              Contacto
            </button>
            <button
              onClick={onOpenPricing}
              className="btn-gradient-cyan px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              Planes
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Dark Cinematic Aesthetic */}
      <div className="relative py-14 sm:py-20 px-4 sm:px-6 text-center overflow-hidden border-b border-cyan-950/40">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-[#020713] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase shadow-md">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Centro de Respuestas Oficial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Preguntas Frecuentes &{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-sky-400">
              Respuestas Claras
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre las inscripciones, la sede en Friusa, la prueba gratuita de 12 días, certificaciones con validación QR y metodologías de estudio.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative liquid-glass rounded-2xl border border-cyan-500/30 shadow-2xl p-1.5 flex items-center">
              <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por palabra clave (ej. prueba, certificado, friusa, horarios, pago)..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'btn-gradient-cyan text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'liquid-glass text-slate-300 hover:text-white hover:border-cyan-500/40 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Count & Notice */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
          <span>Mostrando {filteredFAQs.length} {filteredFAQs.length === 1 ? 'pregunta' : 'preguntas'}</span>
          {searchQuery && (
            <span className="text-cyan-400">Filtrado por: "{searchQuery}"</span>
          )}
        </div>

        {/* Accordion List */}
        {filteredFAQs.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center border border-cyan-950/60 space-y-4">
            <HelpCircle className="w-10 h-10 text-cyan-400/60 mx-auto" />
            <h3 className="text-base font-bold text-white">No encontramos preguntas que coincidan con tu búsqueda</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Intenta con otros términos o comunícate directamente con nuestro equipo de admisiones en Friusa por WhatsApp.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
                className="btn-gradient-cyan px-5 py-2 rounded-full text-xs font-bold text-slate-950 cursor-pointer"
              >
                Ver todas las preguntas
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFAQs.map(item => {
              const isOpen = openId === item.id;
              const IconComponent = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-300 border ${
                    isOpen
                      ? 'liquid-glass-deep border-cyan-400/50 shadow-xl shadow-cyan-500/10'
                      : 'liquid-glass border-cyan-950/60 hover:border-cyan-500/30'
                  }`}
                >
                  {/* Accordion Header / Trigger */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full px-5 py-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-md'
                            : 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                        {item.question}
                      </span>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-cyan-400 text-slate-950'
                          : 'bg-white/5 text-slate-300 group-hover:bg-white/10'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-cyan-950/40 animate-fadeIn">
                      <p className="mt-2 text-slate-200">
                        {item.answer}
                      </p>

                      {item.highlight && (
                        <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-cyan-200 font-medium">
                            {item.highlight}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Direct Support Banner */}
        <div className="mt-14 liquid-glass-deep rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ¿Tienes una consulta específica o no encuentras tu respuesta?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Nuestro equipo de admisiones en Friusa te atiende directamente por WhatsApp o vía llamada telefónica.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/18099631185?text=Hola%20Punta%20Cana%20Academy,%20tengo%20una%20pregunta%20sobre%20la%20admisi%C3%B3n%20y%20cursos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient-cyan px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chatear (+1 809 963-1185)</span>
            </a>

            <button
              onClick={onOpenSignUp}
              className="liquid-glass px-5 py-2.5 rounded-full text-xs font-bold text-white border border-cyan-500/30 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto text-center"
            >
              Iniciar 12 Días Gratis
            </button>
          </div>
        </div>
      </main>

      {/* Dedicated Page Footer */}
      <Footer
        onNavigateHome={onBack}
        onNavigateCourses={onOpenCourses}
        onNavigatePricing={onOpenPricing}
        onNavigateAbout={onOpenAbout}
        onNavigateContact={onOpenContact}
        onNavigateFAQ={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePrivacy={onNavigatePrivacy}
        onNavigateTerms={onNavigateTerms}
        onNavigateCareers={onNavigateCareers}
        onNavigateHelp={onNavigateHelp}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
