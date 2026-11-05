import React, { useState } from 'react';
import { Course, COURSES_LIST } from '../data/coursesData.ts';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { 
  ArrowLeft, 
  Clock, 
  ArrowRight, 
  Check, 
  Search, 
  Award,
  Globe2,
  Code2,
  Compass,
  Bot,
  Sparkles
} from 'lucide-react';

interface CoursesCatalogPageProps {
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
  onOpenPricing: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenContact: () => void;
}

export const CoursesCatalogPage: React.FC<CoursesCatalogPageProps> = ({
  onBack,
  onSelectCourse,
  onOpenPricing,
  onOpenLogin,
  onOpenSignUp,
  onOpenContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Todos', 'Idiomas', 'Tecnología', 'Turismo y Hotelería', 'Inteligencia Artificial', 'Liderazgo'];

  const filteredCourses = COURSES_LIST.filter((c) => {
    const matchesCat = selectedCategory === 'Todos' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
              <span className="hidden sm:inline">Inicio</span>
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
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1 cursor-pointer"
            >
              Ingresar
            </button>
            <button
              onClick={onOpenSignUp}
              className="btn-gradient-cyan px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              Inscribirme
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative py-14 sm:py-20 px-4 sm:px-6 text-center overflow-hidden border-b border-cyan-950/40">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-[#020713] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Catálogo Oficial de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Cursos</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Explora todos nuestros programas con certificación oficial avalada. Modalidad presencial en nuestra sede de Friusa (Plaza Doña Bélgica) y campus virtual interactivo.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="liquid-glass rounded-3xl sm:rounded-full p-2.5 sm:px-6 sm:py-3 mb-10 sm:mb-12 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-cyan-500/30">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'btn-gradient-cyan text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por curso o tema..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* All Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-cyan-900/30 group relative cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-950/20 shadow-xl transition-all"
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

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {course.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-1.5 mb-5 pt-2 border-t border-cyan-950/40">
                  {course.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Pricing (Req 2: Price + Gold SE PRO CARIBE button) */}
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
                      onOpenPricing();
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
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No encontramos cursos que coincidan con &ldquo;{searchQuery}&rdquo;. Intenta otra búsqueda o categoría.
          </div>
        )}
      </main>

      {/* Dedicated Footer */}
      <Footer
        onNavigateHome={onBack}
        onNavigateCourses={() => {}}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={onOpenContact}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
