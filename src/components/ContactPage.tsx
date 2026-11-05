import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { Footer } from './Footer.tsx';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Clock
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
  onOpenPricing: () => void;
  onOpenCourses: () => void;
  onOpenLogin?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBack,
  onOpenPricing,
  onOpenCourses,
  onOpenLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Información General');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSubmitted(false);
      alert('¡Gracias! Tu mensaje ha sido recibido por el equipo de admisiones de Punta Cana Academy.');
    }, 1500);
  };

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
              onClick={onOpenPricing}
              className="btn-gradient-cyan px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              Planes
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Contact Us theme */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-cyan-950/40">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-[#020713] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            ¿Tienes preguntas sobre nuestras clases presenciales en Friusa o nuestra modalidad online? Estamos a tu disposición para ayudarte a elegir el mejor camino para tu futuro.
          </p>
        </div>
      </div>

      {/* Main Content: 2 Columns matching screenshot image_843bbb8e.png */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Get In Touch */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Comunícate con Nosotros
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Visítanos en nuestras instalaciones en Plaza Doña Bélgica o contáctanos por WhatsApp, teléfono o correo electrónico. Nuestro equipo responde en menos de 24 horas.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-start gap-4 border border-cyan-900/40">
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Teléfono & WhatsApp
                  </div>
                  <a
                    href="tel:+18099631185"
                    className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                  >
                    +1 (809) 963-1185
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Lunes a Viernes: 8:00 AM - 8:00 PM
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-start gap-4 border border-cyan-900/40">
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Correo Electrónico
                  </div>
                  <a
                    href="mailto:info@puntacanaacademy.com"
                    className="text-base font-bold text-white hover:text-cyan-400 transition-colors break-all"
                  >
                    info@puntacanaacademy.com
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Admisiones, empresas y tutorías
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-start gap-4 border border-cyan-900/40">
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sede Presencial
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    Av. Estados Unidos 41201, Plaza Doña Belgica<br />
                    Local L5, Segundo Nivel, Punta Cana 23000 (Friusa)
                  </div>
                  <div className="text-xs text-cyan-400 mt-1">
                    República Dominicana
                  </div>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-start gap-4 border border-cyan-900/40">
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Instagram Oficial
                  </div>
                  <a
                    href="https://instagram.com/puntacanaacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                  >
                    @puntacanaacademy
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Noticias, eventos y proyectos estudiantiles
                  </div>
                </div>
              </div>
            </div>

            {/* Social media links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Síguenos en Redes Sociales
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/puntacanaacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/puntacanaacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/puntacanaacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="liquid-glass-deep rounded-3xl p-6 sm:p-8 md:p-10 border border-cyan-500/30 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white mb-2">
                  Envíanos un Mensaje
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Completa los campos a continuación y te responderemos inmediatamente con el programa detallado y las opciones de becas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (829) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Curso de Interés
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
                    >
                      <option value="Inglés Bilingüe">Inglés Bilingüe & Hotelería</option>
                      <option value="Programación Web">Programación Web Full-Stack</option>
                      <option value="Hotelería de Lujo">Gestión de Hotelería de Lujo</option>
                      <option value="Inteligencia Artificial">AI Master Class</option>
                      <option value="Liderazgo">Liderazgo Ejecutivo</option>
                      <option value="Membresía General">Planes de Membresía</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Mensaje o Consulta *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full py-4 rounded-full btn-gradient-cyan text-slate-950 text-sm font-extrabold shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                      <span>Mensaje Enviado con Éxito</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section matching image_843bbb8e.png */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Ubicación de Nuestra Sede en Friusa
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Plaza Doña Bélgica, Local L5, Segundo Nivel. Av. Estados Unidos, Punta Cana 23000.
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Plaza+Dona+Belgica+Punta+Cana"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full liquid-glass text-xs font-bold text-cyan-300 hover:text-white border border-cyan-500/30 text-center"
            >
              Abrir en Google Maps →
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl h-80 relative group">
            <iframe
              title="Mapa de Punta Cana Academy - Plaza Doña Bélgica Friusa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.2452391030386!2d-68.4239845239775!3d18.65306638246473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea8ebba9c0e66eb%3A0x643cf655160d70eb!2sFriusa%2C%20Bavaro%2023000%2C%20Dominican%20Republic!5e0!3m2!1sen!2sus!4v1714589000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.15)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <Footer
        onNavigateHome={onBack}
        onNavigateCourses={onOpenCourses}
        onNavigatePricing={onOpenPricing}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
