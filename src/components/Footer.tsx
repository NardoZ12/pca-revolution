import React from 'react';
import { Logo } from './Logo.tsx';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone,
  Layers,
  GraduationCap,
  CreditCard,
  LogIn
} from 'lucide-react';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateCourses?: (category?: string) => void;
  onNavigatePricing?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateFAQ?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onNavigateCareers?: () => void;
  onNavigateHelp?: () => void;
  onOpenLogin?: () => void;
  onOpenInstructorPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCourses,
  onNavigatePricing,
  onNavigateAbout,
  onNavigateContact,
  onNavigateFAQ,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateCareers,
  onNavigateHelp,
  onOpenLogin,
  onOpenInstructorPortal,
}) => {
  return (
    <footer className="relative z-20 bg-[#020713] text-white border-t border-cyan-900/30 pt-12 sm:pt-16 pb-12 px-4 sm:px-6 selection:bg-cyan-500/30 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12 sm:mb-16">
          {/* Column 1: Brand & Bio & Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Logo size="md" />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
              La academia híbrida más moderna del Caribe. Aprende inglés y tecnología con clases presenciales en Friusa o desde cualquier lugar del mundo.
            </p>

            {/* Social Icons: Instagram, Facebook, LinkedIn */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/puntacanaacademy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Punta Cana Academy"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all cursor-pointer shadow-md"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://facebook.com/puntacanaacademy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Punta Cana Academy"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all cursor-pointer shadow-md"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://linkedin.com/company/puntacanaacademy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Punta Cana Academy"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all cursor-pointer shadow-md"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Explorar (2 cols) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Explorar
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigateCourses?.('Idiomas')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Cursos de Idiomas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCourses?.('Tecnología')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Cursos de Tecnología
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCourses?.('Inteligencia Artificial')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  AI Master Class
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigatePricing}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Planes y Precios
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Sobre Nosotros
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Soporte (2 cols) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Soporte
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  onClick={onNavigateFAQ}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left font-medium text-cyan-300"
                >
                  Preguntas Frecuentes (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHelp}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Ayuda y Soporte
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigatePrivacy}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateTerms}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Términos de Servicio
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateCareers}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Trabaja con nosotros
                </button>
              </li>
              {onOpenInstructorPortal && (
                <li>
                  <button
                    onClick={onOpenInstructorPortal}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Instructors Hub (Enseña y Gana Dinero Extra)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded font-black border border-cyan-500/30">Docentes</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Visítanos (3 cols) with updated phone +1 809 963-1185 and email info@puntacanaacademy.com */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Visítanos
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <button
                  onClick={onNavigateContact}
                  className="text-left leading-snug hover:text-cyan-400 transition-colors"
                >
                  Av. Estados Unidos 41201<br />
                  Plaza Doña Belgica, Local L5<br />
                  Segundo Nivel, Punta Cana 23000
                </button>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="mailto:info@puntacanaacademy.com"
                  className="hover:text-cyan-400 transition-colors break-all"
                >
                  info@puntacanaacademy.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="tel:+18099631185"
                  className="hover:text-cyan-400 transition-colors font-semibold"
                >
                  +1 (809) 963-1185
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Navigator Pill Bar with rounded borders */}
        <div className="flex items-center justify-center mb-8 px-2 sm:px-4">
          <nav
            aria-label="Navegación rápida de pie de página"
            className="inline-flex items-center gap-1.5 sm:gap-2.5 p-1.5 rounded-full liquid-glass border border-cyan-500/30 shadow-2xl backdrop-blur-xl max-w-full overflow-x-auto"
          >
            <button
              onClick={onNavigateHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
              title="Ir al Inicio"
              className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => onNavigateCourses?.()}
              title="Ver Catálogo Completo de Cursos"
              className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Cursos</span>
            </button>

            <button
              onClick={onNavigatePricing}
              title="Planes de Membresía"
              className="btn-gradient-cyan px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 shrink-0 whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>Planes</span>
            </button>

            <button
              onClick={() => {
                if (onOpenLogin) {
                  onOpenLogin();
                } else {
                  window.dispatchEvent(new CustomEvent('open-login-modal'));
                }
              }}
              title="Ingresar a la academia"
              className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap shadow-sm hover:scale-102"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="shrink-0 whitespace-nowrap">Ingresar</span>
            </button>
          </nav>
        </div>

        {/* Copyright divider & quick links */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Punta Cana Academy. Todos los derechos reservados.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={onNavigateFAQ}
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Preguntas Frecuentes (FAQ)
            </button>
            <span>•</span>
            <button
              onClick={onNavigatePrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacidad
            </button>
            <span>•</span>
            <button
              onClick={onNavigateTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Términos
            </button>
            <span>•</span>
            <button
              onClick={onNavigateContact}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contacto Friusa
            </button>
            {onOpenInstructorPortal && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenInstructorPortal}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
                >
                  Portal Profesores (Instructors Hub)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action Button with updated number +1 809 963 1185 */}
      <a
        href="https://wa.me/18099631185?text=Hola%20Punta%20Cana%20Academy,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos%20y%20membres%C3%ADas"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Chatear por WhatsApp (+1 809 963-1185)"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </footer>
  );
};
