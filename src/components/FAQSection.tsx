import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Award, 
  Clock, 
  CreditCard,
  FileCheck
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'admisiones' | 'academia' | 'certificaciones' | 'pagos';
  question: string;
  answer: string;
  highlight?: string;
  icon: React.ElementType;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'prueba-12-dias',
    category: 'admisiones',
    question: '¿Cómo funciona exactamente la prueba gratuita de 12 días?',
    answer: 'Al registrarte en línea obtienes acceso ilimitado e inmediato al aula virtual y a los módulos introductorios de tu programa, además del derecho de asistir a dos clases presenciales en nuestro campus de Friusa. Durante estos 12 días puedes evaluar la metodología, interactuar con los docentes y comprobar la plataforma sin ningún compromiso de pago ni permanencia.',
    highlight: 'Acceso inmediato sin tarjeta de crédito obligatoria ni compromiso.',
    icon: Clock,
  },
  {
    id: 'ubicacion-presencial',
    category: 'academia',
    question: '¿Dónde está ubicada la sede presencial y qué facilidades tiene?',
    answer: 'Nuestro campus físico está ubicado en la Av. Estados Unidos 41201, Plaza Doña Bélgica, Local L5 (Segundo Nivel), en Friusa, Bávaro / Punta Cana. Las aulas cuentan con aire acondicionado de alta eficiencia, conectividad de fibra óptica dedicada, pantallas interactivas de proyección y parqueo vigilado.',
    highlight: 'Ubicación céntrica en Friusa con fácil acceso en transporte público.',
    icon: MapPin,
  },
  {
    id: 'validez-certificacion',
    category: 'certificaciones',
    question: '¿Qué validez tienen los certificados y cómo los verifican las empresas?',
    answer: 'Todos los diplomas y certificados emitidos por Punta Cana Academy cuentan con un código QR único e irrepetible enlazado a nuestra base de datos institucional. Cualquier empleador o departamento de Recursos Humanos de cadenas hoteleras, agencias o empresas de tecnología puede escanear el código para validar instantáneamente el nombre del graduado, las horas académicas cursadas y las competencias aprobadas.',
    highlight: 'Validación digital instantánea mediante código QR para Recursos Humanos.',
    icon: Award,
  },
  {
    id: 'turnos-rotativos',
    category: 'academia',
    question: 'Trabajo en hotelería con turnos rotativos, ¿puedo estudiar a mi propio ritmo?',
    answer: '¡Totalmente! Diseñamos nuestra metodología híbrida y 100% online pensando específicamente en la realidad laboral de la zona este. Si tu turno te impide asistir a una sesión presencial en Friusa, todas las clases quedan grabadas en alta definición en el aula virtual con acceso las 24 horas del día, los 7 días de la semana, para que avances a tu conveniencia sin perder el ritmo.',
    highlight: 'Flexibilidad 24/7 adaptada a turnos rotativos de resorts y aeropuertos.',
    icon: Clock,
  },
  {
    id: 'requisitos-admision',
    category: 'admisiones',
    question: '¿Cuáles son los requisitos para inscribirme en un curso o programa?',
    answer: 'Para ingresar solo necesitas ser mayor de 16 años, tener documento de identidad vigente (cédula de identidad dominicana o pasaporte) y un dispositivo con conexión a internet (teléfono inteligente, tableta o computadora). No exigimos títulos universitarios previos para los cursos de idiomas o tecnología básica, solo tu compromiso de aprender.',
    highlight: 'Inscripción ágil y 100% digital en menos de 3 minutos.',
    icon: FileCheck,
  },
  {
    id: 'metodos-pago',
    category: 'pagos',
    question: '¿Cuáles métodos de pago están disponibles?',
    answer: 'Aceptamos transferencias bancarias dominicanas a nuestras cuentas corporativas en Banco Popular Dominicano, Banreservas y Banco BHD; pagos seguros en línea con tarjetas de crédito/débito internacionales (Visa, MasterCard, American Express); y pagos en efectivo o tarjeta directamente en la recepción de nuestra sede en Friusa.',
    highlight: 'Transferencias bancarias locales en RD, tarjetas y caja presencial.',
    icon: CreditCard,
  },
  {
    id: 'bolsa-empleo',
    category: 'academia',
    question: '¿La academia me ayuda a conseguir empleo al finalizar?',
    answer: 'Sí. A través de nuestra Dirección Ejecutiva y de Negocios, mantenemos convenios activos con los principales complejos hoteleros, tour operadores y empresas de Bávaro y Punta Cana. Los egresados con calificaciones sobresalientes son canalizados de forma prioritaria a las vacantes de nuestra bolsa de trabajo y reciben talleres de simulación de entrevistas en inglés.',
    highlight: 'Convenios directos con cadenas hoteleras y preparación para entrevistas.',
    icon: Award,
  },
  {
    id: 'nivel-ingles-inicio',
    category: 'admisiones',
    question: '¿Qué pasa si empiezo desde cero en inglés o en programación?',
    answer: 'Todos nuestros programas cuentan con niveles de nivelación (A1 para idiomas o fundamentos desde cero en tecnología). Al momento de tu admisión realizamos una evaluación diagnóstica sin costo para ubicarte en el grupo correspondiente a tu nivel real, asegurando que aprendas con compañeros de tu mismo nivel.',
    highlight: 'Prueba de nivelación diagnóstica sin costo al comenzar.',
    icon: CheckCircle2,
  },
];

interface FAQSectionProps {
  onOpenSignUp?: () => void;
  onOpenContact?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenSignUp,
  onOpenContact,
}) => {
  const [openId, setOpenId] = useState<string>('prueba-12-dias');
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? '' : id));
  };

  const categories = [
    { id: 'todos', label: 'Todas las preguntas' },
    { id: 'admisiones', label: 'Admisiones & Prueba' },
    { id: 'academia', label: 'Metodología & Campus' },
    { id: 'certificaciones', label: 'Certificaciones' },
    { id: 'pagos', label: 'Pagos & Planes' },
  ];

  const filteredFaqs = activeCategory === 'todos'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  return (
    <section id="faq-section" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#020713] border-t border-cyan-950/40 selection:bg-cyan-500/30 font-sans">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 border border-cyan-400/30">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Preguntas Frecuentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Resolvemos tus dudas sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Punta Cana Academy</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
            Conoce todo sobre nuestra sede en Friusa, el proceso de admisión en línea, la prueba gratuita de 12 días y la validez laboral de tus certificados.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'btn-gradient-cyan text-slate-950 shadow-md scale-102'
                  : 'liquid-glass text-slate-300 hover:text-white hover:border-cyan-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 sm:space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const IconComponent = faq.icon;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'liquid-glass-deep border-2 border-cyan-400/70 shadow-2xl shadow-cyan-950/40'
                    : 'liquid-glass border border-cyan-900/40 hover:border-cyan-500/40'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-white/5 text-slate-400 group-hover:text-cyan-400 border border-white/5'
                    }`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`text-sm sm:text-base font-bold transition-colors ${
                      isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-cyan-400 text-slate-950 rotate-180 shadow-sm' 
                      : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expandable Content */}
                {isOpen && (
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-cyan-900/40 animate-in fade-in duration-200">
                    <p className="mb-3.5 sm:mb-4">
                      {faq.answer}
                    </p>

                    {faq.highlight && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{faq.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact / Direct Support Bar */}
        <div className="mt-12 sm:mt-16 liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ¿Tienes alguna otra duda o consulta especial?
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Nuestro equipo de admisiones en Friusa te responde en tiempo real por WhatsApp o teléfono.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://wa.me/18099631185?text=Hola%20Punta%20Cana%20Academy,%20tengo%20una%20pregunta%20sobre%20la%20admisi%C3%B3n%20y%20cursos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient-cyan px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chatear (+1 809 963-1185)</span>
            </a>

            {onOpenSignUp && (
              <button
                onClick={onOpenSignUp}
                className="liquid-glass px-5 py-2.5 rounded-full text-xs font-bold text-white border border-cyan-500/30 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Iniciar 12 Días Gratis
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
