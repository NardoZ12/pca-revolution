import React, { useState, useEffect, useRef } from 'react';
import { Course, getAllCourses } from '../data/coursesData.ts';
import { 
  Clock, 
  ArrowRight, 
  Check, 
  Award,
  Globe2,
  Code2,
  Compass,
  Bot,
  Sparkles
} from 'lucide-react';

interface AnimatedCourseCardProps {
  course: Course;
  index: number;
  onSelectCourse: (course: Course) => void;
  onOpenPricing?: () => void;
  onOpenSignUp?: (target: string) => void;
}

const AnimatedCourseCard: React.FC<AnimatedCourseCardProps> = ({ course, index, onSelectCourse, onOpenPricing, onOpenSignUp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(cardEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  const delayMs = (index % 3) * 80;

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
      onClick={() => onSelectCourse(course)}
      className={`liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-700 ease-out border border-cyan-900/30 group relative cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 blur-none'
          : 'opacity-0 translate-y-12 scale-[0.97] blur-[2px] pointer-events-none'
      } hover:scale-[1.015] hover:border-cyan-400/50 hover:bg-cyan-950/20 shadow-xl`}
    >
      <div>
        {/* Cover Thumbnail Preview */}
        <div className="relative rounded-2xl overflow-hidden mb-4 h-44 sm:h-48 border border-cyan-500/20">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-black/20 pointer-events-none" />

          {/* Etiqueta de Certificación Oficial */}
          <div className="absolute top-3 left-3 bg-cyan-950/95 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-400/50 shadow-md flex items-center gap-1 backdrop-blur-md">
            <Award className="w-3 h-3 text-cyan-400" />
            <span>Certificación Oficial</span>
          </div>

          {course.badge && (
            <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md">
              {course.badge}
            </span>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-bold text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            {course.category === 'Idiomas' && <Globe2 className="w-3.5 h-3.5 text-cyan-400" />}
            {course.category === 'Tecnología' && <Code2 className="w-3.5 h-3.5 text-sky-400" />}
            {course.category === 'Turismo y Hotelería' && <Compass className="w-3.5 h-3.5 text-amber-400" />}
            {course.category === 'Inteligencia Artificial' && <Bot className="w-3.5 h-3.5 text-cyan-300" />}
            {course.category === 'Liderazgo' && <Award className="w-3.5 h-3.5 text-purple-400" />}
            <span>{course.category}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
          {course.title}
        </h3>

        {/* Description in slate-300 */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Highlights */}
        <div className="space-y-1.5 mb-5 pt-2 border-t border-cyan-950/40">
          {course.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Meta & Pricing */}
      <div className="pt-4 border-t border-cyan-950/40 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-white bg-cyan-950/50 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
            <span className="text-cyan-300 text-[11px]">Modalidad</span>
            <span>Híbrida</span>
          </div>
        </div>

        {/* Price & Gold Button: Gratis con Pro Caribe */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Precio Individual:</span>
            <span className="text-sm font-black text-cyan-300">$79.99 USD</span>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSignUp) {
                onOpenSignUp('Membresía Pro Caribe');
              } else if (onOpenPricing) {
                onOpenPricing();
              }
            }}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-amber-200"
            title="Totalmente gratis con tu membresía activa del Plan Pro Caribe"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>Gratis con Pro Caribe</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCourse(course);
          }}
          className="w-full py-2.5 rounded-full btn-gradient-cyan text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>Ver cursos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface CoursesSectionProps {
  onSelectCourse: (course: Course) => void;
  onNavigateCatalog: () => void;
  onOpenPricing: () => void;
  onOpenSignUp?: (target: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ 
  onSelectCourse, 
  onNavigateCatalog,
  onOpenPricing,
  onOpenSignUp
}) => {
  // Requirement 2: Show only a preview on the index page (first 3 courses), and button "Ver más cursos"
  const previewCourses = getAllCourses().slice(0, 3);

  return (
    <section className="relative z-20 py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto selection:bg-cyan-500/30 font-sans">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Construye tu futuro <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Hoy mismo.</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
          Punta Cana Academy combina aprendizaje práctico, acompañamiento docente y flexibilidad para preparar a estudiantes y profesionales del turismo, tecnología y negocios.
        </p>
      </div>

      {/* Course Cards Preview Grid (Top 3 on Index) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
        {previewCourses.map((course, index) => (
          <AnimatedCourseCard
            key={course.id}
            course={course}
            index={index}
            onSelectCourse={onSelectCourse}
            onOpenPricing={onOpenPricing}
            onOpenSignUp={onOpenSignUp}
          />
        ))}
      </div>

      {/* Requirement 2: Botón 'Ver más cursos' que lleva a la página dedicada a los cursos */}
      <div className="flex justify-center">
        <button
          onClick={onNavigateCatalog}
          className="btn-gradient-cyan rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-slate-950 text-xs sm:text-sm font-extrabold shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
        >
          <span>Ver más cursos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
