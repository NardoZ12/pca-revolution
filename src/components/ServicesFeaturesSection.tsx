import React from 'react';
import { 
  FileCheck, 
  Clock, 
  Monitor, 
  Award, 
  Briefcase, 
  ArrowRight,
  Headphones
} from 'lucide-react';

interface ServicesFeaturesSectionProps {
  onOpenSignUp?: () => void;
  onOpenContact?: () => void;
}

export const ServicesFeaturesSection: React.FC<ServicesFeaturesSectionProps> = ({
  onOpenSignUp,
  onOpenContact,
}) => {
  const services = [
    {
      title: 'Admisión en Línea',
      badge: '100% Digital & Inmediato',
      description: 'Proceso de registro ágil desde cualquier dispositivo móvil o computadora. Matrícula instantánea con acceso a tu prueba de 12 días sin papeleos ni filas.',
      icon: FileCheck,
      color: 'from-cyan-400 to-sky-500',
      accentColor: 'bg-cyan-400',
    },
    {
      title: 'Clases a tu Ritmo 100% Online',
      badge: 'Flexibilidad de Horarios',
      description: 'Aprende según tu disponibilidad de tiempo. Plataforma disponible las 24 horas del día para compatibilizar el estudio con tus turnos laborales en hotelería o negocios.',
      icon: Clock,
      color: 'from-sky-400 to-blue-500',
      accentColor: 'bg-sky-400',
    },
    {
      title: 'Aula Virtual Moderna',
      badge: 'Campus Interactivo & Soporte',
      description: 'Entorno digital de alta velocidad con laboratorios prácticos, recursos descargables, foros con docentes y mesa de ayuda permanente para resolver cualquier duda.',
      icon: Headphones,
      color: 'from-cyan-300 to-teal-400',
      accentColor: 'bg-amber-400',
    },
    {
      title: 'Certificación Oficial',
      badge: 'Código QR Verificable',
      description: 'Diplomas y certificados oficiales que respaldan tus competencias y horas académicas ante cadenas hoteleras, corporaciones y empresas tecnológicas del país.',
      icon: Award,
      color: 'from-amber-300 to-yellow-500',
      accentColor: 'bg-cyan-400',
    },
    {
      title: 'Inmersión en el Campo Laboral',
      badge: 'Bolsa de Empleo & Pasantías',
      description: 'Vinculación directa con los principales empleadores de Punta Cana y Bávaro. Asesoría para entrevistas en inglés, preparación de CV y canalización a vacantes prioritarias.',
      icon: Briefcase,
      color: 'from-emerald-400 to-cyan-500',
      accentColor: 'bg-sky-400',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#020713] border-t border-cyan-950/40 selection:bg-cyan-500/30 font-sans">
      {/* Background ambient light */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-sky-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 border border-cyan-400/30">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Servicios & Metodología Integral</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Todo lo que necesitas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">crecer</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
            Diseñamos una experiencia formativa moderna que combina la cercanía presencial en nuestra sede de Friusa con la comodidad de nuestra aula virtual.
          </p>
        </div>

        {/* 5 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1 ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Icon Card styled like reference image_a3ec1478.png */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl liquid-glass-deep border border-cyan-500/40 flex items-center justify-center mb-6 text-cyan-300 group-hover:scale-105 group-hover:border-cyan-300 transition-all shadow-lg">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
                  </div>

                  {/* Badge */}
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                    {item.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Accent Line matching reference yellow/cyan bar */}
                  <div className={`w-12 h-1 rounded-full ${item.accentColor} mb-4 group-hover:w-16 transition-all duration-300`} />

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subfooter in card */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Punta Cana Academy</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Card */}
        <div className="mt-12 sm:mt-16 liquid-glass-deep rounded-3xl p-6 sm:p-10 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-center md:text-left max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              ¿Listo para dar el siguiente paso en tu carrera?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inscríbete hoy en cualquiera de nuestros programas y disfruta de 12 días de acceso gratuito para comprobar nuestra calidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onOpenSignUp && (
              <button
                onClick={onOpenSignUp}
                className="btn-gradient-cyan px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-slate-950 shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
              >
                Inscribirme Ahora (12 Días Gratis)
              </button>
            )}
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="liquid-glass px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white border border-cyan-500/30 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Hablar con Admisiones
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
