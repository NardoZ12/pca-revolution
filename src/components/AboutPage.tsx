import React from 'react';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { 
  ArrowLeft, 
  GraduationCap, 
  Target, 
  Compass, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  HeartHandshake
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenCourses: () => void;
  onOpenContact: () => void;
  onOpenLogin?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBack,
  onOpenPricing,
  onOpenCourses,
  onOpenContact,
  onOpenLogin,
}) => {
  const leadershipTeam = [
    {
      name: 'Nardo Zorrilla',
      role: 'Fundador & Director Ejecutivo',
      image: '/assets/aistudio/Nardo_58f46d18.jpg',
      badge: 'Liderazgo & Visión',
      bio: 'Visionario y emprendedor apasionado por la transformación educativa en la República Dominicana. Nardo fundó Punta Cana Academy con el propósito de conectar el talento local del este con las oportunidades globales del turismo y la industria tecnológica.',
      quote: '“El Caribe no solo es el mejor destino turístico del mundo, es una cuna de talento listo para construir el futuro digital.”',
    },
    {
      name: 'Daysi Polanco',
      role: 'Directora Académica',
      image: '/assets/aistudio/Daysi_e2b0372c.jpg',
      badge: 'Máster RRHH & Lic. Mercadeo',
      bio: 'Máster en Recursos Humanos y Licenciada en Mercadeo. Especialista en alta dirección de equipos pedagógicos, metodologías de inmersión y diseño curricular bilingüe de vanguardia. Daysi lidera el cuerpo docente de Punta Cana Academy asegurando programas de excelencia alineados a las exigencias corporativas y turísticas actuales.',
      quote: '“Enseñar con rigor humano y enfoque práctico es el camino más directo para desbloquear el potencial ilimitado de nuestros estudiantes.”',
    },
    {
      name: 'Adeyri Zorrilla',
      role: 'Ejecutiva de Negocios',
      image: '/assets/aistudio/Adeyri_5ab35af6.jpg',
      badge: 'Licenciada en Derecho',
      bio: 'Licenciada en Derecho con amplia experiencia en desarrollo de negocios, alianzas institucionales, consultoría contractual y relaciones corporativas. Adeyri gestiona los convenios estratégicos con cadenas hoteleras, aerolíneas y empresas para impulsar la inserción laboral de nuestros graduados.',
      quote: '“Construir puentes sólidos entre la academia y el sector empresarial es la clave para abrir oportunidades profesionales de alto impacto.”',
    },
    {
      name: 'Nephthaly Khadidjah',
      role: 'Gerente de Operaciones & Experiencia Estudiantil',
      image: '/assets/aistudio/Nephthaly_31d1872b.jpg',
      badge: 'Gestión Institucional',
      bio: 'Líder en gestión operativa hotelera y relaciones corporativas en la zona de Punta Cana y Bávaro. Nephthaly coordina la experiencia presencial en nuestro campus de Friusa, alianzas con cadenas hoteleras y la bolsa de empleo para graduados.',
      quote: '“Cada estudiante que cruza nuestras puertas en Friusa recibe acompañamiento personalizado para garantizar su éxito profesional y laboral.”',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      {/* Top Header */}
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

      {/* Hero Banner */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-cyan-950/40">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-[#020713] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Punta Cana Academy</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
            Somos la academia híbrida más moderna del Caribe. Combinamos aulas presenciales de vanguardia en Friusa (Punta Cana) con un campus virtual interactivo para preparar a los líderes del turismo, la programación y los negocios del mañana.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
        {/* Mission & Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Nuestra Misión</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Empoderar a profesionales y jóvenes de la región con formación práctica de clase mundial en idiomas, tecnología y dirección hotelera, acelerando su desarrollo económico y laboral.
            </p>
          </div>

          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-sky-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Nuestra Visión</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidarnos como el polo de innovación educativa y talento digital referente en todo el Caribe y Centroamérica, uniendo la excelencia académica con el dinamismo turístico de Punta Cana.
            </p>
          </div>

          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Comunidad & Empleo</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Convenios directos con cadenas hoteleras de lujo, aerolíneas y empresas de desarrollo de software para canalizar de forma prioritaria a nuestros egresados certificados.
            </p>
          </div>
        </div>

        {/* Leadership Team Profiles (Requirement 2) */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 border border-cyan-400/30">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Equipo Directivo & Fundacional</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Liderazgo comprometido con tu éxito
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Detrás de Punta Cana Academy hay un equipo con vasta experiencia en educación internacional, gestión hotelera y tecnología.
            </p>
          </div>

          {/* 4 Leadership Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {leadershipTeam.map((member, idx) => (
              <div
                key={idx}
                className="liquid-glass-deep rounded-3xl p-6 sm:p-8 border border-cyan-500/30 flex flex-col justify-between shadow-2xl relative group hover:border-cyan-400 transition-all"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 sm:h-72 object-cover object-top rounded-2xl border border-cyan-500/30 group-hover:scale-102 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-cyan-950/90 text-cyan-300 text-[10px] font-bold px-3 py-1 rounded-full border border-cyan-400/40 backdrop-blur-md">
                      {member.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
                    {member.role}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                </div>

                {/* Quote Box */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 italic text-xs text-cyan-200 leading-relaxed">
                  {member.quote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus & Facilities Callout */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-cyan-500/30 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
          <div className="lg:w-1/2 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Campus Presencial en Friusa
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Espacios diseñados para el aprendizaje inmersivo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ubicados en Plaza Doña Bélgica, en el corazón de Friusa, nuestras instalaciones cuentan con laboratorios climatizados, estaciones de trabajo con fibra óptica de alta velocidad y áreas de networking colaborativo.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Salas multimedia con acústica optimizada para idiomas</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Laboratorios de programación y sistemas de computación de alto rendimiento</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Acompañamiento docente presencial de lunes a sábado</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80"
              alt="Aula de Punta Cana Academy"
              className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-cyan-500/30 shadow-xl"
            />
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <Footer
        onNavigateHome={onBack}
        onNavigateCourses={onOpenCourses}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={onOpenContact}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
