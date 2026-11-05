import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, ExternalLink, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  initials: string;
  role: string;
  date: string;
  rating: number;
  text: string;
  tag: string;
  verified: boolean;
  likes: number;
}

const GOOGLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Yomaira Santana',
    initials: 'YS',
    role: 'Egresada de Inglés Hotelero • Friusa',
    date: 'Hace 2 semanas',
    rating: 5,
    text: 'Tomé el curso de Inglés para Hotelería y la experiencia ha sido inmejorable. Las instalaciones en Friusa son muy cómodas y los profesores se enfocan en la fluidez real para atender turistas. ¡Conseguí trabajo en un resort de Bávaro a las tres semanas de terminar!',
    tag: 'Inglés Hotelero',
    verified: true,
    likes: 14,
  },
  {
    id: '2',
    author: 'Carlos Manuel Rivas',
    initials: 'CR',
    role: 'Estudiante Online • Desarrollo Web',
    date: 'Hace 3 semanas',
    rating: 5,
    text: 'Excelente academia. El aula virtual es súper intuitiva y la flexibilidad de estudiar a mi ritmo mientras trabajo en turno rotativo en hotelería me ayudó muchísimo. El soporte del equipo de admisión siempre es rápido por WhatsApp.',
    tag: 'Tecnología & Web',
    verified: true,
    likes: 9,
  },
  {
    id: '3',
    author: 'Lic. Jean Carlos Peña',
    initials: 'JP',
    role: 'Participante Master Class AI • Bávaro',
    date: 'Hace 1 mes',
    rating: 5,
    text: 'El diplomado de Inteligencia Artificial para Empresas superó mis expectativas. Los directores Nardo y Daysi están sumamente comprometidos con la excelencia académica. El certificado con verificación QR fue aceptado de inmediato por mi empresa.',
    tag: 'Inteligencia Artificial',
    verified: true,
    likes: 21,
  },
  {
    id: '4',
    author: 'Marielis De Los Santos',
    initials: 'MD',
    role: 'Alumna Sede Friusa • Inglés B2',
    date: 'Hace 1 mes',
    rating: 5,
    text: 'La mejor decisión educativa que he tomado este año. Clases presenciales dinámicas en Plaza Doña Bélgica con aire acondicionado, tecnología de proyección y ambiente muy profesional. La prueba de 12 días me convenció de inscribirme.',
    tag: 'Sede Friusa',
    verified: true,
    likes: 12,
  },
  {
    id: '5',
    author: 'David Almonte',
    initials: 'DA',
    role: 'Egresado de Programación Full-Stack',
    date: 'Hace 2 meses',
    rating: 5,
    text: 'Aprender desarrollo de software con profesores que realmente trabajan en la industria hace toda la diferencia. Los proyectos prácticos para el portafolio me permitieron conseguir mis primeros contratos remotos desde Punta Cana.',
    tag: 'Bolsa de Empleo',
    verified: true,
    likes: 18,
  },
  {
    id: '6',
    author: 'Ing. Patricia Méndez',
    initials: 'PM',
    role: 'Estudiante Virtual • Punta Cana',
    date: 'Hace 2 meses',
    rating: 5,
    text: 'La calidad del contenido y el acompañamiento docente son de nivel internacional. No hay otra academia en la región este con este estándar tecnológico y metodológico. Totalmente recomendada para quienes buscan superarse.',
    tag: 'Calidad Académica',
    verified: true,
    likes: 15,
  },
];

export const GoogleReviewsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('Todos');

  const categories = ['Todos', 'Inglés Hotelero', 'Tecnología & Web', 'Inteligencia Artificial', 'Sede Friusa'];

  const filteredReviews = filter === 'Todos' 
    ? GOOGLE_REVIEWS 
    : GOOGLE_REVIEWS.filter(r => r.tag === filter);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#020713] border-t border-cyan-950/40 selection:bg-cyan-500/30 font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[350px] bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[300px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-center lg:text-left max-w-2xl">
            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass text-xs font-bold text-white mb-3 border border-cyan-500/30 shadow-lg">
              {/* Google G multi-color icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-extrabold text-cyan-300">Google Reviews</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-400 font-extrabold">4.9 / 5.0</span>
              <span className="text-[11px] text-slate-300 hidden sm:inline">(+180 opiniones)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Lo que opinan nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">estudiantes</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
              Testimonios reales y verificados de alumnos en nuestra sede presencial en Friusa y en nuestra plataforma virtual en toda la República Dominicana.
            </p>
          </div>

          {/* Google Score Box */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-cyan-500/30 flex items-center gap-4 shrink-0 shadow-xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-cyan-300 leading-none">4.9</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">de 5</span>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-[#FBBC04] text-[#FBBC04]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Puntuación Oficial en Google Maps</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">
                Punta Cana Academy • Friusa, Bávaro
              </div>
            </div>
          </div>
        </div>

        {/* Categories / Tag Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === cat
                  ? 'btn-gradient-cyan text-slate-950 shadow-md'
                  : 'liquid-glass text-slate-300 hover:text-white hover:border-cyan-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="liquid-glass rounded-3xl p-6 sm:p-7 border border-cyan-900/40 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
            >
              <div>
                {/* Header of review: avatar, author, verified badge & Google G */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-sky-800 text-white font-extrabold text-sm flex items-center justify-center border border-cyan-400/40 shadow-sm shrink-0">
                      {rev.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5 leading-snug">
                        {rev.verified && (
                          <span title="Reseña verificada" className="inline-flex">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight">
                        {rev.role}
                      </div>
                    </div>
                  </div>

                  {/* Google small icon */}
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10" title="Reseña de Google">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Card Footer: Category badge & Helpful */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  {rev.tag}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <ThumbsUp className="w-3 h-3 text-cyan-400" />
                  <span>Útil ({rev.likes})</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to View on Google Maps */}
        <div className="mt-12 text-center">
          <a
            href="https://maps.google.com/?q=Punta+Cana+Academy+Friusa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full liquid-glass border border-cyan-500/40 hover:border-cyan-300 text-xs sm:text-sm font-bold text-white transition-all hover:bg-cyan-950/40 shadow-xl group cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Ver todas las opiniones en Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
