import React from 'react';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { ArrowLeft, ShieldCheck, FileText, Briefcase, HelpCircle, CheckCircle2, Mail, Phone } from 'lucide-react';

interface SubPageProps {
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenCourses: () => void;
  onOpenFAQ?: () => void;
}

export const PrivacyPolicyPage: React.FC<SubPageProps> = ({ onBack, onOpenPricing, onOpenCourses }) => {
  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <button onClick={onOpenCourses} className="btn-gradient-cyan px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
            Ver Cursos
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-bold text-cyan-300 mb-3 border border-cyan-500/30">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Seguridad y Privacidad de Datos</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Última actualización: 1 de Noviembre de 2026 • Punta Cana Academy
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed liquid-glass rounded-3xl p-6 sm:p-10 border border-cyan-900/40">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Compromiso de Protección de Datos</h2>
            <p>
              En Punta Cana Academy (en adelante, &ldquo;la Academia&rdquo;), respetamos profundamente la confidencialidad de nuestros alumnos, postulantes y visitantes. Esta política rige la recopilación, almacenamiento y tratamiento de información en nuestras instalaciones físicas en Friusa (Plaza Doña Bélgica) y en nuestra plataforma digital interactiva.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Información que Recopilamos</h2>
            <p>
              Recopilamos únicamente los datos necesarios para brindar servicios educativos de excelencia:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Datos de contacto e identificación: nombre, correo electrónico, número telefónico / WhatsApp.</li>
              <li>Historial académico, calificaciones y asistencias a clases presenciales y virtuales.</li>
              <li>Preferencias de cursos, niveles de idiomas e intereses de desarrollo profesional.</li>
              <li>Datos de autenticación segura (Passkeys biométricas o credenciales cifradas).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Finalidad del Tratamiento</h2>
            <p>
              Tus datos se utilizan con fines exclusivamente académicos y de gestión estudiantil: matrícula, expedición de diplomas y certificados oficiales, comunicación de avisos docentes y canalización a nuestra bolsa de empleo con cadenas hoteleras aliadas (siempre con tu consentimiento expreso).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. No Venta de Datos</h2>
            <p>
              Punta Cana Academy jamás vende, alquila o comparte bases de datos con terceros para fines comerciales o de mercadeo no solicitado.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Contacto del Oficial de Privacidad</h2>
            <p>
              Para ejercer tus derechos de acceso, rectificación o eliminación de datos, puedes comunicarte a: <a href="mailto:puntacanaacademy.info@gmail.com" className="text-cyan-400 font-bold hover:underline">puntacanaacademy.info@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigateCourses={onOpenCourses} onNavigatePricing={onOpenPricing} />
    </div>
  );
};

export const TermsOfServicePage: React.FC<SubPageProps> = ({ onBack, onOpenPricing, onOpenCourses }) => {
  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <button onClick={onOpenCourses} className="btn-gradient-cyan px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
            Ver Cursos
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-bold text-cyan-300 mb-3 border border-cyan-500/30">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Condiciones Académicas</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Términos y Condiciones de Servicio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Punta Cana Academy • Sede Friusa & Plataforma Digital
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed liquid-glass rounded-3xl p-6 sm:p-10 border border-cyan-900/40">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Admisión y Matrícula</h2>
            <p>
              El ingreso a los programas presenciales e híbridos de Punta Cana Academy se realiza mediante registro y aceptación del reglamento estudiantil. Los cupos para las clases presenciales en Friusa son limitados para mantener grupos reducidos y garantizar atención personalizada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Período de Prueba de 12 Días</h2>
            <p>
              El plan de prueba gratuita otorga acceso irrestricto durante doce (12) días calendario consecutivos para evaluar la metodología docente, interactuar con el campus virtual y asistir a clases muestra en Friusa. No existe permanencia forzosa y el usuario puede cancelar en cualquier momento dentro de ese período.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Requisitos de Certificación Oficial</h2>
            <p>
              Para recibir el diploma oficial y acreditado de cualquier curso, el estudiante debe cumplir con un mínimo del 80% de asistencia o visualización de módulos, aprobar las evaluaciones prácticas y defender satisfactoriamente el proyecto final.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Conducta en Campus Físico y Virtual</h2>
            <p>
              Mantenemos una política de respeto mutuo, inclusión y colaboración activa tanto en las aulas de Plaza Doña Bélgica como en los grupos de estudio digitales. Cualquier conducta contraria a estos valores conllevará la suspensión de los privilegios académicos.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigateCourses={onOpenCourses} onNavigatePricing={onOpenPricing} />
    </div>
  );
};

export const CareersPage: React.FC<SubPageProps> = ({ onBack, onOpenPricing, onOpenCourses }) => {
  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <button onClick={onOpenCourses} className="btn-gradient-cyan px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
            Ver Cursos
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-bold text-cyan-300 mb-3 border border-cyan-500/30">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Oportunidades de Empleo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Trabaja con Nosotros
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
            Únete a la facultad y al equipo de innovación que está transformando la educación en Punta Cana y el Caribe.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Presencial Friusa / Híbrido</span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">Profesor(a) de Inglés Conversacional & Hospitalidad</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Buscamos docentes con pronunciación nativa o C2 demostrable con experiencia en capacitación de personal hotelero y diplomacia.
              </p>
            </div>
            <a
              href="mailto:info@puntacanaacademy.com?subject=Postulacion:%20Profesor%20de%20Ingles"
              className="btn-gradient-cyan px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 shrink-0"
            >
              Postularme
            </a>
          </div>

          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Online / Remoto</span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">Mentor(a) Full-Stack (React, TypeScript & AI)</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Ingenieros de software activos con deseo de guiar a nuevos talentos a través de laboratorios prácticos y revisión de código.
              </p>
            </div>
            <a
              href="mailto:info@puntacanaacademy.com?subject=Postulacion:%20Mentor%20Full-Stack"
              className="btn-gradient-cyan px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 shrink-0"
            >
              Postularme
            </a>
          </div>

          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Presencial Friusa</span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">Coordinador(a) de Admisiones & Atención Estudiantil</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Profesional proactivo(a) para atención en recepción, asesoría de inscripciones y seguimiento a matriculados en campus.
              </p>
            </div>
            <a
              href="mailto:info@puntacanaacademy.com?subject=Postulacion:%20Coordinador%20Admisiones"
              className="btn-gradient-cyan px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 shrink-0"
            >
              Postularme
            </a>
          </div>
        </div>

        <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 text-center space-y-3">
          <h4 className="text-base font-bold text-white">¿No ves tu puesto pero crees que puedes aportar?</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Envía tu currículum y portafolio a <a href="mailto:info@puntacanaacademy.com" className="text-cyan-400 font-bold hover:underline">info@puntacanaacademy.com</a> indicando en qué área te gustaría colaborar.
          </p>
        </div>
      </main>

      <Footer onNavigateCourses={onOpenCourses} onNavigatePricing={onOpenPricing} />
    </div>
  );
};

export const HelpCenterPage: React.FC<SubPageProps> = ({ onBack, onOpenPricing, onOpenCourses, onOpenFAQ }) => {
  const faqs = [
    {
      q: '¿Dónde están ubicadas las clases presenciales?',
      a: 'Nuestra sede presencial se encuentra en Av. Estados Unidos 41201, Plaza Doña Bélgica, Local L5 (Segundo Nivel), en Friusa, Bávaro / Punta Cana. Contamos con estacionamiento y fácil acceso al transporte público.',
    },
    {
      q: '¿Cómo funciona la prueba gratuita de 12 días?',
      a: 'Al registrarte en el plan de prueba, obtienes acceso completo a la plataforma digital y derecho a asistir a dos clases presenciales en Friusa durante 12 días continuos. Si decides no continuar, puedes cancelar sin costo alguno.',
    },
    {
      q: '¿Los certificados tienen validez laboral?',
      a: 'Sí. Todos los egresados reciben un certificado digital verificable con código QR que valida las horas académicas, los proyectos realizados y las competencias adquiridas.',
    },
    {
      q: '¿Qué modalidades de pago aceptan?',
      a: 'Aceptamos transferencias bancarias dominicanas (Banco Popular, Banreservas, BHD), tarjetas de crédito/débito internacionales, y pagos en efectivo en la caja de nuestra sede en Friusa.',
    },
    {
      q: '¿Puedo cambiar de curso o modalidad durante mis estudios?',
      a: 'Por supuesto. Nuestra política de flexibilidad te permite combinar clases presenciales en Friusa y sesiones virtuales según tu disponibilidad laboral.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020713] text-white selection:bg-cyan-500/30 font-sans">
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-[#020713]/85 border-b border-cyan-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          </div>

          <div className="flex items-center justify-center">
            <Logo onClick={onBack} size="sm" hideTextOnMobile={true} />
          </div>

          <button onClick={onOpenCourses} className="btn-gradient-cyan px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
            Ver Cursos
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-bold text-cyan-300 mb-3 border border-cyan-500/30">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Centro de Ayuda</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Preguntas Frecuentes & Soporte
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Resolvemos tus dudas sobre admisión, metodología híbrida y pagos.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-5 sm:p-6 border border-cyan-900/40 space-y-2">
              <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  Q
                </span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="liquid-glass-deep rounded-3xl p-6 sm:p-8 border border-cyan-500/30 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">¿Aún tienes dudas?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Escríbenos directamente por WhatsApp o llama a nuestra oficina en Friusa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/18099631185"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient-cyan px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 flex items-center gap-2"
            >
              Chatear por WhatsApp (+1 809 963-1185)
            </a>
            <a
              href="mailto:info@puntacanaacademy.com"
              className="liquid-glass px-6 py-2.5 rounded-full text-xs font-bold text-white border border-cyan-500/30 hover:bg-white/10"
            >
              Enviar Correo
            </a>
          </div>
        </div>
      </main>

      <Footer onNavigateCourses={onOpenCourses} onNavigatePricing={onOpenPricing} onNavigateFAQ={onOpenFAQ} />
    </div>
  );
};
