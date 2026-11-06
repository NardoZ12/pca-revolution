import React, { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo.tsx';
import { ArrowRight, CheckCircle2, Menu, X } from 'lucide-react';

interface HeroSectionProps {
  onOpenPricing: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: (email?: string) => void;
  onOpenCoursesCatalog: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenFAQ: () => void;
  student?: any;
  onOpenDashboard?: () => void;
  onOpenInstructorPortal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPricing,
  onOpenLogin,
  onOpenSignUp,
  onOpenCoursesCatalog,
  onOpenAbout,
  onOpenContact,
  onOpenFAQ,
  student,
  onOpenDashboard,
  onOpenInstructorPortal,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom JS requestAnimationFrame fade helper
  const fadeVideoTo = (
    targetOpacity: number,
    durationMs: number,
    onComplete?: () => void
  ) => {
    const video = videoRef.current;
    if (!video) return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const currentStyleOpacity = parseFloat(video.style.opacity);
    const startOpacity = isNaN(currentStyleOpacity) ? 0 : currentStyleOpacity;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const newOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

      if (video) {
        video.style.opacity = newOpacity.toString();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';

    const handleLoadedOrPlay = () => {
      fadeVideoTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeVideoTo(0, 500);
      }
    };

    const handleEnded = () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      video.style.opacity = '0';

      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        fadingOutRef.current = false;
        video
          .play()
          .then(() => {
            fadeVideoTo(1, 500);
          })
          .catch((err) => {
            console.warn('Video replay error:', err);
          });
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedOrPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch(() => {
      const handleFirstInteraction = () => {
        video.play().then(() => fadeVideoTo(1, 500)).catch(() => {});
        window.removeEventListener('click', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction, { once: true });
    });

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      video.removeEventListener('loadeddata', handleLoadedOrPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    onOpenSignUp(email.trim());
  };

  return (
    <div className="relative min-h-[92vh] md:min-h-screen bg-[#020713] overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30 font-sans">
      {/* Background Looping Video with 17% crop translation */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Cinematic dark blue vignette overlay with cyan light leaks */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020713]/85 via-[#020713]/40 to-[#020713]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Navigation bar with centered logo in mobile and removed outside Inscribirse button */}
      <header className="relative z-30 px-3 sm:px-6 py-4 sm:py-6 w-full">
        <div className="liquid-glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between max-w-5xl mx-auto shadow-2xl border border-cyan-500/20 relative">
          
          {/* DESKTOP Left Side: Logo + Nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

            <nav className="flex items-center gap-5 lg:gap-8 whitespace-nowrap">
              <button
                onClick={onOpenCoursesCatalog}
                className="text-slate-300 hover:text-cyan-400 transition-colors text-xs lg:text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Cursos
              </button>
              <button
                onClick={onOpenAbout}
                className="text-slate-300 hover:text-cyan-400 transition-colors text-xs lg:text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Nosotros
              </button>
              <button
                onClick={onOpenContact}
                className="text-slate-300 hover:text-cyan-400 transition-colors text-xs lg:text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Contacto
              </button>
              <button
                onClick={onOpenPricing}
                className="text-slate-300 hover:text-cyan-400 transition-colors text-xs lg:text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Planes
              </button>
            </nav>
          </div>

          {/* MOBILE: Center the academy name & logo (Requirement 1) */}
          <div className="md:hidden flex-1 flex items-center justify-center pl-7">
            <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </div>

          {/* DESKTOP Right Side: Ingresar & Inscribirse OR Mi Dashboard */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {student && onOpenDashboard ? (
              <button
                onClick={onOpenDashboard}
                className="btn-gradient-cyan rounded-full px-5 py-2 text-slate-950 text-xs sm:text-sm font-black shadow-md cursor-pointer whitespace-nowrap flex items-center gap-2 hover:scale-102 transition-all"
              >
                <span>Mi Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm font-semibold px-2 py-1 cursor-pointer"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => onOpenSignUp()}
                  className="btn-gradient-cyan rounded-full px-5 py-2 text-slate-950 text-xs sm:text-sm font-bold shadow-md cursor-pointer whitespace-nowrap"
                >
                  Inscribirse
                </button>
              </>
            )}
          </div>

          {/* MOBILE Right Side: Hamburger Button ONLY (Requirement 1: 'inscribirse' button removed from outside) */}
          <div className="md:hidden flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/20 cursor-pointer transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Inscribirse inside */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto max-w-sm liquid-glass-deep rounded-2xl p-4 border border-cyan-500/30 space-y-3 animate-fadeIn shadow-2xl">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCoursesCatalog();
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-xl"
            >
              Cursos Oficiales
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-xl"
            >
              Nosotros
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-xl"
            >
              Contacto
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFAQ();
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-xl flex items-center justify-between"
            >
              <span>Preguntas Frecuentes (FAQ)</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">Nuevo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPricing();
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-xl"
            >
              Planes de Membresía
            </button>
            {onOpenInstructorPortal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInstructorPortal();
                }}
                className="w-full text-left py-2 px-3 text-sm font-bold text-cyan-400 hover:bg-cyan-950/40 rounded-xl flex items-center justify-between"
              >
                <span>Instructors Hub (Enseña y Gana Dinero Extra)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">Docentes</span>
              </button>
            )}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {student && onOpenDashboard ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-black btn-gradient-cyan text-slate-950 text-center cursor-pointer shadow-md"
                >
                  Entrar a Mi Dashboard ({student.displayName || 'Estudiante'})
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold liquid-glass text-white text-center cursor-pointer"
                  >
                    Ingresar
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSignUp();
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold btn-gradient-cyan text-slate-950 text-center cursor-pointer"
                  >
                    Inscribirme
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero content area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12 text-center md:-translate-y-[6%]">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tight drop-shadow-2xl select-none uppercase max-w-4xl leading-tight">
          ES TIEMPO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">CRECER</span>
        </h1>

        <div className="max-w-xl w-full space-y-4 px-2 sm:px-0">
          {/* Email input bar with cyan liquid glass border */}
          <form
            onSubmit={handleSubscribe}
            className="liquid-glass rounded-full pl-4 sm:pl-6 pr-2 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 backdrop-blur-md transition-all border border-cyan-500/30 focus-within:ring-2 focus-within:ring-cyan-400/50"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
              className="text-white placeholder:text-slate-400 text-sm sm:text-base bg-transparent outline-none flex-1 w-full font-normal"
            />
            <button
              type="submit"
              aria-label="Suscribirse al boletín"
              className="btn-gradient-cyan rounded-full p-2.5 sm:p-3 text-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md"
            >
              {isSubscribed ? (
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-950" />
              ) : (
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </button>
          </form>

          {isSubscribed && (
            <p className="text-xs text-cyan-300 font-bold animate-fadeIn">
              ¡Gracias por suscribirte! Te hemos enviado la guía académica de Punta Cana Academy.
            </p>
          )}

          {/* Subtitle text in slate-300 */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2 sm:px-4 font-normal max-w-lg mx-auto">
            Punta Cana Academy combina aprendizaje práctico, acompañamiento docente y flexibilidad para preparar a estudiantes y profesionales del turismo, tecnología y negocios.
          </p>

          {/* Botón Obtén una prueba gratis (leads to sign-up registration) */}
          <div className="pt-2 sm:pt-4 flex justify-center">
            <button
              onClick={() => onOpenSignUp()}
              className="btn-gradient-cyan rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-slate-950 text-xs sm:text-sm font-extrabold shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Obtén una prueba gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <div className="h-6 sm:h-8" />
    </div>
  );
};
