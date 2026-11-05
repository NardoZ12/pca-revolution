import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { X, Check, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { Badge100Secure, BadgeTrustedCustomers, BadgeSecureCheckout } from './SecurityBadges.tsx';

interface PricingViewProps {
  onClose: () => void;
  onGoHome?: () => void;
  onSelectCourse?: () => void;
  onOpenSignUp?: (planName?: string) => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onNavigateCareers?: () => void;
  onNavigateHelp?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ 
  onClose, 
  onGoHome, 
  onSelectCourse,
  onOpenSignUp,
  onNavigateAbout,
  onNavigateContact,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateCareers,
  onNavigateHelp,
}) => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  const plans = [
    {
      id: 'free',
      name: 'Inicia tu Prueba Hoy Mismo',
      priceMonthly: 'Gratis por 12 Días',
      priceYearly: 'Gratis por 12 Días',
      priceSubtext: 'Válido exclusivamente por 12 días sin costo ($0.00)',
      badge: 'Prueba de 12 Días',
      description: 'Prueba la metodología de Punta Cana Academy con acceso a las 2 primeras unidades de tus cursos.',
      features: [
        'Acceso completo a las 2 primeras unidades de temario',
        'Material didáctico, diapositivas descargables y quizzes',
        'Hasta 2 clases presenciales en campus Friusa',
        'Unidades 3+, chat en vivo y tutoría IA exclusivas en Pro Caribe',
        'Sin permanencia obligatoria, cancela con un clic',
      ],
      popular: false,
      buttonText: 'Activar 12 Días Gratis',
    },
    {
      id: 'standard',
      name: 'Membresía Estándar',
      priceMonthly: '$9,99/m',
      priceYearly: '$7,99/m',
      priceSubtext: isYearly ? 'Facturado anualmente ($95.88/año)' : 'Facturación mensual flexible',
      badge: 'Flexible',
      description: 'Para estudiantes y profesionales que avanzan a su propio ritmo con acompañamiento virtual.',
      features: [
        'Acceso a todos los cursos virtuales en video HD',
        'Tutorías grupales semanales en vivo',
        'Laboratorios prácticos y proyectos corregidos',
        'Certificado digital verificado por cada curso',
        'Descuento del 15% en talleres presenciales',
      ],
      popular: false,
      buttonText: 'Elegir Estándar',
    },
    {
      id: 'pro',
      name: 'Membresía Pro Caribe',
      priceMonthly: '$19,99/m',
      priceYearly: '$15,99/m',
      priceSubtext: isYearly ? 'Facturado anualmente ($191.88/año)' : 'Facturación mensual con garantía',
      badge: 'Más Recomendado',
      description: 'La experiencia completa: clases presenciales ilimitadas en Friusa, mentoría 1-a-1 y bolsa de empleo.',
      features: [
        'Pase ilimitado presencial en el campus de Friusa',
        'Acceso total a todos los cursos (Idiomas, Tech, AI, Turismo)',
        'Mentoría individual 1-a-1 quincenal',
        'Acceso prioritario a la bolsa de empleo hotelera y remota',
        'Certificación ejecutiva con valor curricular oficial',
      ],
      popular: true,
      buttonText: 'Elegir Pro Caribe',
    },
  ];

  const handlePlanSelect = (planName: string) => {
    if (onOpenSignUp) {
      onOpenSignUp(planName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      {/* Background cyan/sky glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[500px] h-[400px] bg-sky-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
          {/* Header */}
          <header className="w-full flex justify-between items-center pt-2 pb-6 sm:pb-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <Logo onClick={onGoHome || onClose} size="sm" hideTextOnMobile={true} />
            </div>

            <div className="liquid-glass rounded-full px-4 sm:px-5 py-2 hidden sm:flex items-center gap-4 sm:gap-6 shadow-2xl backdrop-blur-xl border border-cyan-500/20">
              <button
                onClick={onGoHome || onClose}
                className="text-slate-300 hover:text-cyan-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <span className="text-cyan-300 font-bold text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                Planes
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSelectCourse?.();
                }}
                className="text-slate-300 hover:text-cyan-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cursos
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar planes"
              className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center transition-colors text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Title Area */}
          <div className="text-center relative my-4 sm:my-6 max-w-3xl mx-auto px-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 border border-cyan-400/30">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Planes & Membresías Punta Cana Academy</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4 leading-tight">
              Aprende sin límites con una membresía flexible
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Elige el plan ideal para tu crecimiento profesional. Inicia con nuestro plan gratuito de 12 días sin necesidad de tarjeta de crédito obligatoria.
            </p>
          </div>

          {/* Pricing Cards Grid (Requirement 3: pt-6 and overflow-visible ensures badges are NEVER cut off!) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 my-8 sm:my-10 pt-4 max-w-6xl mx-auto w-full">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`liquid-glass-deep !overflow-visible rounded-3xl p-6 sm:p-7 pt-9 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer border ${
                    plan.popular
                      ? 'border-cyan-400/80 shadow-[0_0_50px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                      : 'border-cyan-900/40 hover:border-cyan-500/40'
                  } ${isSelected ? 'scale-[1.01]' : ''}`}
                >
                  {/* Badge: with z-20 and overflow-visible on parent so it never gets cropped! */}
                  {plan.badge && (
                    <div
                      className={`absolute -top-3.5 right-6 z-20 text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-xl flex items-center gap-1.5 ${
                        plan.popular
                          ? 'btn-gradient-cyan text-slate-950'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      }`}
                    >
                      <Zap className="w-3 h-3 text-cyan-400" /> {plan.badge}
                    </div>
                  )}

                  <div>
                    {/* Category Title */}
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-1">
                      {plan.name}
                    </span>

                    {/* Price */}
                    <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                      {isYearly ? plan.priceYearly : plan.priceMonthly}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mb-4">
                      {plan.priceSubtext}
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 min-h-[44px]">
                      {plan.description}
                    </p>

                    <div className="w-full h-px bg-cyan-950/60 mb-6" />

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                          <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirement 4: Button leads to registration with email and data */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan.name);
                    }}
                    className={`w-full py-3.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                      plan.popular
                        ? 'btn-gradient-cyan text-slate-950 hover:scale-[1.02]'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-cyan-500/30'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Security & Guarantee Trust Bar with Golden Badges (Req 5) */}
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl liquid-glass border border-cyan-500/30 text-center">
            <div className="flex items-center justify-center gap-3 text-xs text-slate-300 font-semibold mb-3">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Transacciones Encriptadas SSL 256-Bit
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                Cancela cuando quieras sin cargos
              </span>
            </div>
            
            {/* 3 Golden Badges (100% Transparent & Photorealistic) */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 pt-1">
              <div className="flex flex-col items-center gap-1">
                <Badge100Secure className="w-12 h-12 sm:w-14 sm:h-14" />
                <span className="text-[10px] text-amber-300/90 font-bold tracking-tight">100% Seguro</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BadgeTrustedCustomers className="w-12 h-12 sm:w-14 sm:h-14" />
                <span className="text-[10px] text-amber-300/90 font-bold tracking-tight">Confianza Total</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BadgeSecureCheckout className="w-12 h-12 sm:w-14 sm:h-14" />
                <span className="text-[10px] text-amber-300/90 font-bold tracking-tight">Checkout Protegido</span>
              </div>
            </div>
          </div>

          {/* Yearly Toggle Controls */}
          <div className="max-w-xl mx-auto flex items-center justify-center gap-4 py-4 mb-8 sm:mb-12">
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="flex items-center gap-3 cursor-pointer group"
              role="switch"
              aria-checked={isYearly}
            >
              <span className={`text-xs font-semibold ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
                Mensual
              </span>
              <div
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  isYearly ? 'bg-gradient-to-r from-cyan-400 to-sky-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
              </div>
              <span className={`text-xs font-semibold ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                Facturación Anual
              </span>
            </button>
            <span className="bg-cyan-500/20 text-cyan-300 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Ahorra 20%
            </span>
          </div>
        </div>

        {/* Footer */}
        <Footer
          onNavigateCourses={() => {
            onClose();
            onSelectCourse?.();
          }}
          onNavigatePricing={() => {}}
          onNavigateAbout={() => {
            onClose();
            onNavigateAbout?.();
          }}
          onNavigateContact={() => {
            onClose();
            onNavigateContact?.();
          }}
          onNavigatePrivacy={() => {
            onClose();
            onNavigatePrivacy?.();
          }}
          onNavigateTerms={() => {
            onClose();
            onNavigateTerms?.();
          }}
          onNavigateCareers={() => {
            onClose();
            onNavigateCareers?.();
          }}
          onNavigateHelp={() => {
            onClose();
            onNavigateHelp?.();
          }}
        />
      </div>
    </div>
  );
};
