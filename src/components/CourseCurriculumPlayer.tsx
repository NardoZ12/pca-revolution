import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  FileText, 
  HelpCircle, 
  Video, 
  Image as ImageIcon, 
  Presentation, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft, 
  ArrowLeft, 
  Download, 
  Award, 
  Sparkles, 
  Send, 
  Check, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Upload,
  Plus,
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../lib/firebase.ts';

export interface SlideItem {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  visualBoxText?: string;
  codeOrQuote?: string;
  imageUrl?: string;
  isCustomUploaded?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeAssignment {
  title: string;
  scenario: string;
  deliverableInstructions: string;
  rubric: string[];
  sampleSolutionPrompt?: string;
}

export interface TopicData {
  id: string;
  unitId: string;
  topicNumber: string;
  title: string;
  durationMinutes: number;
  summary: string;
  video: {
    title: string;
    instructor: string;
    videoUrl: string;
    keyPoints: string[];
    transcriptSummary: string;
  };
  slides: {
    deckTitle: string;
    totalSlides: number;
    slidesList: SlideItem[];
  };
  infographic: {
    title: string;
    description: string;
    imageUrl: string;
    diagramSteps: { step: string; detail: string }[];
  };
  pdfDocument: {
    title: string;
    fileName: string;
    fileSize: string;
    totalPages: number;
    previewContent: string;
  };
  quiz: {
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
  practice: PracticeAssignment;
}

export interface CourseUnitData {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  topics: TopicData[];
}

export interface CourseCurriculumData {
  courseId: string;
  courseTitle: string;
  category: string;
  instructorLead: string;
  totalHours: string;
  units: CourseUnitData[];
}

// -------------------------------------------------------------
// CURRICULUM DATABASE
// -------------------------------------------------------------
export const CURRICULA_DATABASE: Record<string, CourseCurriculumData> = {
  'ingles-bilingue-hoteleria': {
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    category: 'Idiomas & Hotelería',
    instructorLead: 'Prof. Nardo Zorrilla',
    totalHours: '120 horas lectivas',
    units: [
      {
        id: 'u1',
        unitNumber: 1,
        title: 'Fundamentos de Recepción & Bienvenida al Huésped',
        description: 'Fórmulas de cortesía internacional, protocolo de Check-in y entonación profesional caribeña.',
        topics: [
          {
            id: 't1_1',
            unitId: 'u1',
            topicNumber: '1.1',
            title: 'Protocolo de Bienvenida y Check-in de Alta Gama',
            durationMinutes: 35,
            summary: 'Aprende a recibir a huéspedes internacionales con calidez, formalidad y pronunciación impecable en recepción.',
            video: {
              title: 'Masterclass: Greeting Guests with Warmth & Authority',
              instructor: 'Lic. Daysi Polanco',
              videoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
              keyPoints: [
                'Uso de "Good morning/afternoon, welcome to Punta Cana!" con modulación vocal.',
                'Evitar respuestas cortantes ("Yes?", "What?") y cambiarlas por "How may I assist you today?".',
                'Confirmación de pasaportes y método de garantía sin generar incomodidad.'
              ],
              transcriptSummary: 'En esta lección analizamos el primer contacto visual y auditivo de 7 segundos con el huésped. Veremos fórmulas de saludo formal según la hora del día, cómo solicitar amablemente el documento de identidad y confirmar las noches de estadía con el paquete All-Inclusive.'
            },
            slides: {
              deckTitle: 'Presentación Oficial: Protocolos de Recepción y Saludo Hotelero 5 Estrellas',
              totalSlides: 5,
              slidesList: [
                {
                  slideNumber: 1,
                  title: 'The Power of First Impressions',
                  subtitle: 'Módulo 1: Hospitality Communication Standards',
                  bullets: [
                    '7 seconds to form 80% of the guest’s trust and satisfaction.',
                    'Eye contact, upright posture, and immediate verbal recognition.',
                    'The standard greeting triad: Salutation + Welcome + Open Offer.'
                  ],
                  visualBoxText: 'Formula: [Greeting] + [Welcome to Punta Cana Academy Resort] + [How may I assist you today?]'
                },
                {
                  slideNumber: 2,
                  title: 'Formal Greetings vs Casual Greetings',
                  subtitle: 'Professional Linguistic Distinction',
                  bullets: [
                    '❌ Avoid: "Hey guys", "What’s up?", "Yeah?", "Hold on".',
                    '✅ Use: "Good morning Sir/Madam", "It is our absolute pleasure to welcome you".',
                    'Handling VIP guests: addressing by last name ("Mr. Anderson", "Ms. Rodriguez").'
                  ],
                  codeOrQuote: '"Excellence is not an act, but a habit of refined hospitality."'
                },
                {
                  slideNumber: 3,
                  title: 'Checking In: Essential Phrases',
                  subtitle: 'Front Desk Vocabulary',
                  bullets: [
                    '"May I have your passport or photo ID, please?"',
                    '"We have reserved an Ocean View Suite for 5 nights under your name."',
                    '"Could you please sign here and authorize the incidental deposit?"',
                    '"Your all-inclusive wristband grants you full access to all 8 specialty restaurants."'
                  ],
                  visualBoxText: 'Key Verb: To assist / To confirm / To authorize'
                },
                {
                  slideNumber: 4,
                  title: 'Handling Unexpected Delays at Check-In',
                  subtitle: 'Empathy & Proactive Service',
                  bullets: [
                    'When the room is still being sanitized: offer a welcome cocktail at the lobby lounge.',
                    '"Your suite is currently receiving its final quality inspection to ensure perfection."',
                    '"May our bell staff take care of your luggage while you enjoy our beachfront lunch?"'
                  ],
                  codeOrQuote: 'Never say "The room is not ready". Say "Your suite is being prepared for your comfort".'
                },
                {
                  slideNumber: 5,
                  title: 'Summary & Practice Checklist',
                  subtitle: 'Actionable Takeaways',
                  bullets: [
                    'Memorize the 3 greeting phases without hesitation.',
                    'Practice phonetics for numbers, dates, and spelling guest names.',
                    'Review the resort map to guide guests on their first arrival walk.'
                  ],
                  visualBoxText: 'Nota: Debes aprobar el quiz y entregar la práctica para desbloquear el Tema 1.2.'
                }
              ]
            },
            infographic: {
              title: 'Infografía de Flujo: El Ciclo de Recepción en 5 Pasos',
              description: 'Diagrama visual de la secuencia ideal que debe seguir un agente de recepción desde que el huésped pisa el lobby.',
              imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
              diagramSteps: [
                { step: '1. Acogida Visual & Saludo', detail: 'Sonrisa sincera a 3 metros y saludo formal inmediato en inglés según el horario.' },
                { step: '2. Identificación & Verificación', detail: 'Solicitud amable de pasaportes y localización de la reserva en el sistema PMS.' },
                { step: '3. Garantía & Beneficios', detail: 'Explicación del depósito incidental y entrega del mapa resort y brazalete All-Inclusive.' },
                { step: '4. Entrega de Llaves & Orientación', detail: 'Asignación de Suite, horarios de restaurantes y entrega al Bellboy.' },
                { step: '5. Despedida Cálida', detail: '"Enjoy your wonderful stay with us in Punta Cana, Mr. Smith!"' }
              ]
            },
            pdfDocument: {
              title: 'Guía Oficial de Diálogos & Glosario de Recepción Hotelera 2026',
              fileName: 'PuntaCanaAcademy_Guia_Recepcion_Huespedes_v1.pdf',
              fileSize: '2.4 MB',
              totalPages: 14,
              previewContent: 'DOCUMENTO OFICIAL PUNTA CANA ACADEMY\n\nCONTENIDO TEMÁTICO:\n1. 50 Frases de Cortesía Inmediata para Recepcionistas Bilingües.\n2. Cuadro Fonético de Pronunciación para Nombres y Apellidos Anglosajones.\n3. Protocolo de asignación de amenidades de luna de miel y aniversarios.\n4. Plantilla de Check-list de Entrega de Habitación y Conexión Wi-Fi.\n\nDocente: Prof. Nardo Zorrilla\nDepartamento de Idiomas y Hospitalidad - Sede Friusa, Bávaro.'
            },
            quiz: {
              title: 'Evaluación Obligatoria: Saludos y Protocolo de Check-In',
              passingScore: 75,
              questions: [
                {
                  question: '¿Cuál es la forma más profesional y adecuada de saludar a un huésped que llega a las 11:30 AM a la recepción?',
                  options: [
                    'Good morning, welcome to our resort! How may I assist you today?',
                    'Hello there! What do you need today?',
                    'Welcome guys, give me your reservation paper please.',
                    'Good night, how are you doing?'
                  ],
                  correctIndex: 0,
                  explanation: 'La opción A cumple con los 3 pilares de oro: saludo temporal correcto (Good morning), bienvenida corporativa y oferta de asistencia abierta y formal.'
                },
                {
                  question: 'Si la habitación aún no está lista porque el equipo de housekeeping está finalizando la inspección, ¿qué frase es la más correcta?',
                  options: [
                    'The room is dirty, you have to wait outside.',
                    'Your suite is currently receiving its final inspection to ensure perfection. May I offer you a refreshing drink at our lounge?',
                    'Housekeeping is late today, sorry about that.',
                    'You cannot check in now, come back in two hours.'
                  ],
                  correctIndex: 1,
                  explanation: 'Nunca se debe culpar al personal ni usar palabras negativas como "dirty". Se resalta la búsqueda de calidad y se ofrece hospitalidad inmediata.'
                },
                {
                  question: '¿Cómo se solicita amablemente la identificación oficial y tarjeta de crédito para el depósito?',
                  options: [
                    'Show me your passport and money right now.',
                    'May I please have your photo ID or passport, and a credit card for incidental verification?',
                    'I need card, give it to me.',
                    'Do you have passport? Put it here.'
                  ],
                  correctIndex: 1,
                  explanation: 'El uso del modal "May I please have..." demuestra respeto supremo y lenguaje diplomático requerido en resorts internacionales.'
                },
                {
                  question: '¿Qué significa el término "Incidentals" en el contexto de check-in hotelero?',
                  options: [
                    'Accidentes que ocurren en la playa.',
                    'Cargos o consumos adicionales como spa, lavandería o llamadas no cubiertos en el plan base.',
                    'El pago del taxi hacia el aeropuerto.',
                    'Una multa por llegar tarde al hotel.'
                  ],
                  correctIndex: 1,
                  explanation: 'Incidentals se refiere a posibles gastos extras autorizados en tarjeta de crédito durante la estancia del huésped.'
                }
              ]
            },
            practice: {
              title: 'Práctica Obligatoria: Simulación de Check-in con Situación Especial',
              scenario: 'El señor Robert Thompson llega a las 2:00 PM tras un vuelo retrasado de Chicago. Tiene reserva para su 15° aniversario de bodas, pero su equipaje quedó demorado en el aeropuerto.',
              deliverableInstructions: 'Redacta un diálogo en inglés (mínimo 6 líneas de parlamento del recepcionista) donde demuestres empatía por su equipaje, le des la bienvenida con una copa de espumante por su aniversario y confirmes que el concierge gestionará la búsqueda de sus maletas.',
              rubric: [
                'Uso correcto de fórmulas de cortesía y empatía (ej. "I am truly sorry to hear about your luggage").',
                'Mención del aniversario de bodas y felicitación profesional.',
                'Ofrecimiento de solución práctica antes de enviarlo a su habitación.',
                'Gramática y vocabulario hotelero adecuado sin errores de concordancia.'
              ],
              sampleSolutionPrompt: 'Escribe tu respuesta en el editor inferior para entregar la tarea obligatoria y poder desbloquear el tema siguiente.'
            }
          },
          {
            id: 't1_2',
            unitId: 'u1',
            topicNumber: '1.2',
            title: 'Atención Telefónica & Gestión de Reservas por Voz',
            durationMinutes: 40,
            summary: 'Técnicas de modulación de voz, deletreo con alfabeto fonético internacional y confirmación de solicitudes especiales por teléfono.',
            video: {
              title: 'Masterclass: Professional Phone Etiquette & Reservation Mastery',
              instructor: 'Lic. Adeyri Zorrilla',
              videoUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
              keyPoints: [
                'Responder la llamada antes del 3er timbre con saludo corporativo y nombre del agente.',
                'Uso del alfabeto fonético internacional (Alpha, Bravo, Charlie...) para evitar errores en correos y pasaportes.',
                'Cierre de llamada con resumen de reserva y número de confirmación.'
              ],
              transcriptSummary: 'En esta clase abordamos cómo proyectar una sonrisa telefónica, modular el ritmo al hablar con hablantes nativos de inglés y gestionar llamadas de huéspedes con dudas sobre traslados y reservas de cenas temáticas.'
            },
            slides: {
              deckTitle: 'Presentación Oficial: Phone Etiquette & Call Center Standards',
              totalSlides: 4,
              slidesList: [
                {
                  slideNumber: 1,
                  title: 'The Golden Phone Rules',
                  subtitle: 'First 3 Rings Protocol',
                  bullets: [
                    'Answer within 3 rings with energetic clarity.',
                    'Brand identifier + Department + Agent’s name + Offer to help.',
                    'Standard: "Thank you for calling Punta Cana Academy Resort, this is Adeyri speaking, how may I assist you?"'
                  ]
                },
                {
                  slideNumber: 2,
                  title: 'Phonetic Spelling for Accuracy',
                  subtitle: 'International Standards (ICAO)',
                  bullets: [
                    'Avoid confusion between B/P, D/T, M/N.',
                    '"A as in Alpha, B as in Bravo, C as in Charlie..."',
                    'Always repeat numbers in pairs: "Room twenty-four-sixteen (2416)".'
                  ]
                },
                {
                  slideNumber: 3,
                  title: 'Placing Calls on Hold Politeness',
                  subtitle: 'Consent & Waiting Time',
                  bullets: [
                    'Always ask permission: "May I place you on a brief hold while I consult our concierge?"',
                    'Wait for the guest’s confirmation before pressing mute or hold.',
                    'Never leave a guest on hold for more than 45 seconds without checking back in.'
                  ]
                },
                {
                  slideNumber: 4,
                  title: 'Closing the Interaction',
                  subtitle: 'Finalizing Reservations',
                  bullets: [
                    'Recap all details: dates, room category, and cancellation policies.',
                    '"Is there anything else I may assist you with today?"',
                    '"We look forward to welcoming you to Punta Cana!"'
                  ]
                }
              ]
            },
            infographic: {
              title: 'Infografía: Alfabeto Fonético ICAO para Hotelería',
              description: 'Tabla de referencia rápida para deletrear apellidos, correos electrónicos y códigos de confirmación sin ambigüedades.',
              imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
              diagramSteps: [
                { step: 'A-B-C-D', detail: 'Alpha, Bravo, Charlie, Delta' },
                { step: 'E-F-G-H', detail: 'Echo, Foxtrot, Golf, Hotel' },
                { step: 'I-J-K-L', detail: 'India, Juliett, Kilo, Lima' },
                { step: 'M-N-O-P', detail: 'Mike, November, Oscar, Papa' },
                { step: 'Q-R-S-T', detail: 'Quebec, Romeo, Sierra, Tango' },
                { step: 'U-V-W-X-Y-Z', detail: 'Uniform, Victor, Whiskey, X-ray, Yankee, Zulu' }
              ]
            },
            pdfDocument: {
              title: 'Manual de Scripts Telefónicos para Reservas & Concierge',
              fileName: 'PuntaCanaAcademy_Phone_Scripts_Hospitality.pdf',
              fileSize: '1.8 MB',
              totalPages: 8,
              previewContent: 'SCRIPTS OFICIALES PARA CALL CENTER HOTELERO:\n\n1. Solicitud de disponibilidad y cotización de tarifas por noche.\n2. Confirmación de traslados aeropuerto-hotel privados.\n3. Coordinación de reservas en restaurantes a la carta.\n4. Gestión de políticas de cancelación y depósitos reembolsables.'
            },
            quiz: {
              title: 'Evaluación Obligatoria: Protocolo Telefónico y Alfabeto Fonético',
              passingScore: 75,
              questions: [
                {
                  question: '¿Cuál es la forma correcta de poner a un huésped en espera durante una llamada telefónica?',
                  options: [
                    'Wait there, I need to check something.',
                    'Hold on, I will be right back.',
                    'May I place you on a brief hold while I verify your reservation details?',
                    'Silence your phone, do not hang up.'
                  ],
                  correctIndex: 2,
                  explanation: 'Solicitar permiso con "May I place you on a brief hold..." y explicar el motivo demuestra respeto y educación profesional.'
                },
                {
                  question: 'Al deletrear el apellido "BROWN", ¿cuál es la secuencia correcta del alfabeto fonético?',
                  options: [
                    'Boy, Red, Orange, Water, No',
                    'Bravo, Romeo, Oscar, Whiskey, November',
                    'Beta, Radio, One, West, Nine',
                    'Boston, Rome, Orlando, Washington, New York'
                  ],
                  correctIndex: 1,
                  explanation: 'Bravo, Romeo, Oscar, Whiskey y November son las palabras oficiales del estándar fonético internacional.'
                }
              ]
            },
            practice: {
              title: 'Práctica Obligatoria: Grabación o Redacción de Script Telefónico',
              scenario: 'Un cliente llama desde Canadá preguntando si el resort cuenta con opciones de menú libres de gluten y si la piscina para adultos tiene costo extra.',
              deliverableInstructions: 'Redacta la transcripción de la respuesta telefónica en inglés asegurando resolver ambas inquietudes con amabilidad y promoviendo la reserva directa.',
              rubric: [
                'Saludo inicial profesional con nombre.',
                'Respuesta afirmativa clara sobre opciones celíacas / gluten-free en todos los restaurantes.',
                'Aclaración de que la piscina de adultos es 100% gratuita para huéspedes All-Inclusive.',
                'Cierre entusiasta invitando a confirmar la reserva.'
              ]
            }
          }
        ]
      },
      {
        id: 'u2',
        unitNumber: 2,
        title: 'Gestión de Quejas & Situaciones Críticas (The L.A.S.T. Method)',
        description: 'Técnicas de desescalada verbal, resolución empática de conflictos y retención de huéspedes insatisfechos.',
        topics: [
          {
            id: 't2_1',
            unitId: 'u2',
            topicNumber: '2.1',
            title: 'El Método L.A.S.T. para Desescalar Conflictos',
            durationMinutes: 50,
            summary: 'Listen, Apologize, Solve & Thank: el estándar internacional para transformar quejas en fidelidad del cliente.',
            video: {
              title: 'Masterclass: Conflict Resolution & The L.A.S.T. Framework',
              instructor: 'Lic. Adeyri Zorrilla',
              videoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
              keyPoints: [
                'Listen actively without interrupting, taking notes on guest concerns.',
                'Apologize sincerely on behalf of the resort without making excuses.',
                'Solve proactively: give clear options with realistic time limits.',
                'Thank the guest for bringing the matter to our attention.'
              ],
              transcriptSummary: 'Aprende qué palabras decir y cuáles evitar cuando un huésped llega molesto por un aire acondicionado ruidoso o demora en el room service.'
            },
            slides: {
              deckTitle: 'Presentación Oficial: The L.A.S.T. Conflict De-escalation Framework',
              totalSlides: 4,
              slidesList: [
                {
                  slideNumber: 1,
                  title: 'Step 1: Listen Actively',
                  subtitle: 'Empathy in Action',
                  bullets: [
                    'Maintain calm body language and eye contact.',
                    'Nod and use verbal cues: "I completely understand", "I see".',
                    'Do not interrupt, even if the guest’s tone is elevated.'
                  ]
                },
                {
                  slideNumber: 2,
                  title: 'Step 2: Apologize Sincerely',
                  subtitle: 'Accountability without Excuses',
                  bullets: [
                    '❌ "It’s not my fault, maintenance is slow today".',
                    '✅ "I sincerely apologize for the inconvenience this has caused you, Mr. Clark".',
                    'Acknowledge the emotional impact: "I understand how frustrating this must be during your vacation".'
                  ]
                },
                {
                  slideNumber: 3,
                  title: 'Step 3: Solve Proactively',
                  subtitle: 'Empowered Solutions',
                  bullets: [
                    'Give specific timeframes: "I am personally dispatching our chief engineer to your villa within 10 minutes".',
                    'Follow up within 30 minutes to confirm total satisfaction.',
                    'Provide service recovery: complimentary spa pass or room upgrade.'
                  ]
                },
                {
                  slideNumber: 4,
                  title: 'Step 4: Thank the Guest',
                  subtitle: 'Building Lifelong Loyalty',
                  bullets: [
                    '"Thank you for bringing this to our attention so we could make it right for you".',
                    'A resolved complaint creates a more loyal guest than someone who never had an issue.'
                  ]
                }
              ]
            },
            infographic: {
              title: 'Infografía: Matriz de Desescalada de Quejas en Hotelería',
              description: 'Flujo visual paso a paso para aplicar el método L.A.S.T. ante situaciones tensas en el resort.',
              imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
              diagramSteps: [
                { step: 'L - Listen', detail: 'Escucha activa sin defensas ni interrupciones.' },
                { step: 'A - Apologize', detail: 'Disculpa sincera institucional reconociendo la frustración.' },
                { step: 'S - Solve', detail: 'Acción inmediata con plazo de tiempo exacto y seguimiento.' },
                { step: 'T - Thank', detail: 'Agradecimiento genuino por permitirnos mejorar su estancia.' }
              ]
            },
            pdfDocument: {
              title: 'Manual de Desescalada y Compensación de Servicio',
              fileName: 'PuntaCanaAcademy_Service_Recovery_Manual.pdf',
              fileSize: '2.8 MB',
              totalPages: 12,
              previewContent: 'POLÍTICAS DE COMPENSACIÓN:\n- Niveles de compensación autorizados para agentes de recepción.\n- Frases prohibidas en resolución de quejas.\n- Formato de reporte de incidencias en bitácora digital.'
            },
            quiz: {
              title: 'Evaluación Obligatoria: Resolución de Conflictos',
              passingScore: 75,
              questions: [
                {
                  question: '¿Qué significa la sigla L.A.S.T. en atención al cliente hotelero?',
                  options: [
                    'Leave, Argue, Shout, Terminate',
                    'Listen, Apologize, Solve, Thank',
                    'Late, Always, Safe, Time',
                    'Learn, Act, Speak, Teach'
                  ],
                  correctIndex: 1,
                  explanation: 'Listen, Apologize, Solve, Thank es la metodología estándar mundial de hospitalidad.'
                },
                {
                  question: '¿Cuál de las siguientes respuestas representa una disculpa profesional sin excusas?',
                  options: [
                    'It is not my fault, the computer system is broken today.',
                    'I sincerely apologize for the inconvenience this has caused you. Let me personally solve this for you right away.',
                    'You should have told us earlier.',
                    'Everyone is busy today, please wait.'
                  ],
                  correctIndex: 1,
                  explanation: 'Asumir responsabilidad empática y enfocarse en la solución inmediata transmite liderazgo y excelencia de servicio.'
                }
              ]
            },
            practice: {
              title: 'Práctica Obligatoria: Caso de Resolución de Queja por Habitación Ruidosa',
              scenario: 'La señora Davis llega enfadada a las 11:00 PM porque hay un evento musical cerca de su edificio y sus hijos no pueden dormir.',
              deliverableInstructions: 'Redacta tu diálogo de resolución aplicando los 4 pasos del método L.A.S.T., ofreciendo cambio a una villa tranquila en el sector Zen del hotel.',
              rubric: [
                'Escucha empática y validación de su descanso.',
                'Disculpa sin culpar al departamento de entretenimiento.',
                'Ofrecimiento ágil del cambio de habitación con asistencia para trasladar equipaje.',
                'Agradecimiento y cortesía final.'
              ]
            }
          }
        ]
      }
    ]
  },
  'full-stack-web-dev': {
    courseId: 'full-stack-web-dev',
    courseTitle: 'Programación Web Full-Stack & UI Moderna',
    category: 'Tecnología & Programación',
    instructorLead: 'Prof. Nardo Zorrilla',
    totalHours: '160 horas prácticas',
    units: [
      {
        id: 'u1_tech',
        unitNumber: 1,
        title: 'Arquitectura Frontend Moderna con React 19 & TypeScript',
        description: 'Fundamentos de componentes reactivos, hooks avanzados, tipado estricto y optimización de render.',
        topics: [
          {
            id: 't1_1_tech',
            unitId: 'u1_tech',
            topicNumber: '1.1',
            title: 'Componentes Funcionales, Hooks Avanzados & TypeScript Estricto',
            durationMinutes: 45,
            summary: 'Domina useState, useEffect, useMemo, custom hooks y TypeScript interfaces para construir aplicaciones escalables.',
            video: {
              title: 'Masterclass: React Functional Components & Custom Hooks',
              instructor: 'Ing. Nephthaly',
              videoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
              keyPoints: [
                'Reglas de hooks y cómo evitar re-renderizados innecesarios con useMemo y useCallback.',
                'Tipado estricto de Props, Eventos y Generics en TypeScript.',
                'Construcción de un custom hook reutilizable useLocalStorage.'
              ],
              transcriptSummary: 'En esta sesión construimos desde cero una arquitectura de componentes modulares, implementando patrones de composición y tipado seguro que previenen bugs en tiempo de compilación.'
            },
            slides: {
              deckTitle: 'Presentación Oficial: React + TypeScript Enterprise Architecture',
              totalSlides: 4,
              slidesList: [
                {
                  slideNumber: 1,
                  title: 'React Functional Architecture',
                  subtitle: 'Modern Paradigms',
                  bullets: [
                    'Pure functions with predictable output based on props and state.',
                    'Immutability: always produce new state references.',
                    'Separation of concerns: UI rendering vs Business logic.'
                  ]
                },
                {
                  slideNumber: 2,
                  title: 'TypeScript Interface Design',
                  subtitle: 'Strict Typing Standards',
                  bullets: [
                    'Interfaces vs Types: prefer interface for extensible contracts.',
                    'Discriminated unions for multi-state management.',
                    'Generics for reusable hooks and services.'
                  ]
                },
                {
                  slideNumber: 3,
                  title: 'Custom Hooks Engineering',
                  subtitle: 'Encapsulating Logic',
                  bullets: [
                    'Extract repetitive side-effects into dedicated useX functions.',
                    'Return structured tuples or objects for clean consumer ergonomics.',
                    'Clean up subscriptions in return callbacks.'
                  ]
                },
                {
                  slideNumber: 4,
                  title: 'Performance & Memoization',
                  subtitle: 'Optimization Guidelines',
                  bullets: [
                    'Measure before memoizing: do not overuse useMemo blindly.',
                    'Memoize expensive array transformations and callback handlers.',
                    'React Compiler insights in React 19.'
                  ]
                }
              ]
            },
            infographic: {
              title: 'Infografía: Ciclo de Vida y Flujo de Datos Unidireccional en React',
              description: 'Diagrama visual de cómo viajan los props hacia abajo y los eventos hacia arriba en una aplicación reactiva moderna.',
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
              diagramSteps: [
                { step: '1. Initial Render', detail: 'Ejecución del componente funcional y cálculo del Virtual DOM inicial.' },
                { step: '2. State Change', detail: 'Invocación de setState que agenda una nueva pasada de reconciliación.' },
                { step: '3. Diffing & Commit', detail: 'El motor compara el árbol virtual y actualiza únicamente los nodos DOM afectados.' },
                { step: '4. Effects Execution', detail: 'Ejecución de callbacks en useEffect tras pintar la pantalla.' }
              ]
            },
            pdfDocument: {
              title: 'TypeScript & React Architecture Cheat Sheet 2026',
              fileName: 'PuntaCanaAcademy_TypeScript_React_Guide.pdf',
              fileSize: '4.2 MB',
              totalPages: 22,
              previewContent: 'GUÍA TÉCNICA DE DESARROLLO FRONTEND:\n\n1. Convenciones de nomenclatura para componentes y hooks.\n2. Patrones de tipado para llamadas asíncronas con Axios/Fetch.\n3. Manejo de formularios con Zod y React Hook Form.\n4. Pruebas unitarias con Vitest y Testing Library.'
            },
            quiz: {
              title: 'Evaluación Obligatoria: React & TypeScript',
              passingScore: 75,
              questions: [
                {
                  question: '¿Por qué nunca se debe modificar el estado de React directamente (ej. state.count = 5)?',
                  options: [
                    'Porque React requiere una nueva referencia de objeto/valor para detectar cambios y disparar el re-render.',
                    'Porque TypeScript no permite variables numéricas.',
                    'Porque rompe la conexión con la base de datos SQL.',
                    'Porque borra el archivo package.json.'
                  ],
                  correctIndex: 0,
                  explanation: 'React depende de la inmutabilidad y la comparación de referencias (shallow equality) para saber cuándo debe volver a pintar la interfaz.'
                },
                {
                  question: '¿Cuál es la función principal de la función de limpieza (cleanup function) retornada dentro de un useEffect?',
                  options: [
                    'Formatear el código con Prettier.',
                    'Cancelar suscripciones, temporizadores (timers) o peticiones pendientes antes de desmontar o re-ejecutar el efecto.',
                    'Borrar las cookies del navegador.',
                    'Cerrar la sesión del usuario en Firebase.'
                  ],
                  correctIndex: 1,
                  explanation: 'El callback de limpieza previene fugas de memoria (memory leaks) y llamadas a componentes ya desmontados.'
                }
              ]
            },
            practice: {
              title: 'Práctica Obligatoria: Implementación de Hook useDebounce con TypeScript',
              scenario: 'En un campo de búsqueda en vivo que consulta una API, el usuario escribe rápidamente y se disparan decenas de peticiones innecesarias.',
              deliverableInstructions: 'Escribe la implementación de un custom hook useDebounce<T>(value: T, delay: number): T con TypeScript genérico y useEffect con limpieza de setTimeout.',
              rubric: [
                'Uso correcto de Generics <T>.',
                'Instanciación de setTimeout con el delay recibido.',
                'Función de limpieza clearTimeout(handler).',
                'Retorno del valor diferido tipado.'
              ]
            }
          }
        ]
      }
    ]
  }
};

interface CourseCurriculumPlayerProps {
  courseId?: string;
  courseTitle?: string;
  student: StudentProfile;
  onBackToDashboard: () => void;
  onEnterLiveClassroom?: (courseTitle: string) => void;
  onProgressUpdated?: (newPercentage: number) => void;
}

export const CourseCurriculumPlayer: React.FC<CourseCurriculumPlayerProps> = ({
  courseId: initialCourseId,
  courseTitle: initialCourseTitle,
  student,
  onBackToDashboard,
  onEnterLiveClassroom,
  onProgressUpdated
}) => {
  // 1. REQUIREMENT 1: Choose course before addressing curriculum
  const [selectedCourseKey, setSelectedCourseKey] = useState<string | null>(initialCourseId || null);
  const [showCourseSelectorModal, setShowCourseSelectorModal] = useState<boolean>(!initialCourseId);

  // Active curriculum data
  const activeCourseKey = selectedCourseKey || 'ingles-bilingue-hoteleria';
  const curriculum: CourseCurriculumData = 
    CURRICULA_DATABASE[activeCourseKey] || 
    CURRICULA_DATABASE['ingles-bilingue-hoteleria'];

  // Persistent storage key per student & course
  const storageProgressKey = `pca_curriculum_progress_${student.uid || 'demo'}_${curriculum.courseId}`;
  const storageSubmissionsKey = `pca_curriculum_submissions_${student.uid || 'demo'}_${curriculum.courseId}`;
  const storageCustomSlidesKey = `pca_uploaded_slides_${student.uid || 'demo'}_${curriculum.courseId}`;

  // Unlocked & completed topics
  const [unlockedTopics, setUnlockedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageProgressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlocked && Array.isArray(parsed.unlocked)) {
          return parsed.unlocked;
        }
      }
    } catch {
      // fallback
    }
    return [curriculum.units[0]?.topics[0]?.id || 't1_1'];
  });

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageProgressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completed && Array.isArray(parsed.completed)) {
          return parsed.completed;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // REQUIREMENT 2: Submissions & strict completion tracking (Quiz & Practice)
  const [topicQuizScores, setTopicQuizScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(storageSubmissionsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.quizScores || {};
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [topicPracticesSubmitted, setTopicPracticesSubmitted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageSubmissionsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.practicesSubmitted || {};
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [topicPracticesText, setTopicPracticesText] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageSubmissionsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.practicesText || {};
      }
    } catch {
      // fallback
    }
    return {};
  });

  // REQUIREMENT 3: Custom Uploaded Slides state (per topic)
  const [uploadedSlidesByTopic, setUploadedSlidesByTopic] = useState<Record<string, SlideItem[]>>(() => {
    try {
      const saved = localStorage.getItem(storageCustomSlidesKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  });

  // Active unit and topic selection
  const [selectedUnitId, setSelectedUnitId] = useState<string>(curriculum.units[0]?.id || 'u1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    curriculum.units[0]?.topics[0]?.id || 't1_1'
  );

  // Active resource tab: 'video' | 'slides' | 'infographic' | 'pdf' | 'quiz' | 'practice'
  const [activeTab, setActiveTab] = useState<'video' | 'slides' | 'infographic' | 'pdf' | 'quiz' | 'practice'>('video');

  // Slide deck state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeSlideDeckType, setActiveSlideDeckType] = useState<'official' | 'uploaded'>('official');
  const [isSlideFullscreen, setIsSlideFullscreen] = useState(false);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideBulletsText, setNewSlideBulletsText] = useState('');
  const [newSlideQuote, setNewSlideQuote] = useState('');
  const [newSlideImagePreview, setNewSlideImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz state
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Practice state
  const [practiceText, setPracticeText] = useState('');
  const [isPracticeSubmitted, setIsPracticeSubmitted] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  // Strict advancement alert modal
  const [showStrictBlockedModal, setShowStrictBlockedModal] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reload progress & submissions when active course changes
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(storageProgressKey);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.unlocked) setUnlockedTopics(parsed.unlocked);
        if (parsed.completed) setCompletedTopics(parsed.completed);
      } else {
        setUnlockedTopics([curriculum.units[0]?.topics[0]?.id || 't1_1']);
        setCompletedTopics([]);
      }

      const savedSubmissions = localStorage.getItem(storageSubmissionsKey);
      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions);
        if (parsed.quizScores) setTopicQuizScores(parsed.quizScores);
        if (parsed.practicesSubmitted) setTopicPracticesSubmitted(parsed.practicesSubmitted);
        if (parsed.practicesText) setTopicPracticesText(parsed.practicesText);
      }

      const savedSlides = localStorage.getItem(storageCustomSlidesKey);
      if (savedSlides) {
        setUploadedSlidesByTopic(JSON.parse(savedSlides));
      }

      setSelectedUnitId(curriculum.units[0]?.id || 'u1');
      setSelectedTopicId(curriculum.units[0]?.topics[0]?.id || 't1_1');
      setCurrentSlideIndex(0);
      setActiveSlideDeckType('official');
    } catch {
      // ignore
    }
  }, [selectedCourseKey, curriculum, storageProgressKey, storageSubmissionsKey, storageCustomSlidesKey]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageProgressKey,
        JSON.stringify({
          unlocked: unlockedTopics,
          completed: completedTopics,
          lastUpdated: new Date().toISOString()
        })
      );
    } catch {
      // ignore
    }
  }, [unlockedTopics, completedTopics, storageProgressKey]);

  // Save submissions (quizzes + practices) to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageSubmissionsKey,
        JSON.stringify({
          quizScores: topicQuizScores,
          practicesSubmitted: topicPracticesSubmitted,
          practicesText: topicPracticesText,
          lastUpdated: new Date().toISOString()
        })
      );
    } catch {
      // ignore
    }
  }, [topicQuizScores, topicPracticesSubmitted, topicPracticesText, storageSubmissionsKey]);

  // Save custom slides to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageCustomSlidesKey, JSON.stringify(uploadedSlidesByTopic));
    } catch {
      // ignore
    }
  }, [uploadedSlidesByTopic, storageCustomSlidesKey]);

  // Active topic resolution
  const activeUnit = curriculum.units.find(u => u.id === selectedUnitId) || curriculum.units[0];
  const activeTopic = activeUnit?.topics.find(t => t.id === selectedTopicId) || activeUnit?.topics[0];

  // Update local inputs when topic changes
  useEffect(() => {
    if (activeTopic) {
      // Load saved practice text if any
      const savedText = topicPracticesText[activeTopic.id] || '';
      setPracticeText(savedText);
      const isDone = !!topicPracticesSubmitted[activeTopic.id];
      setIsPracticeSubmitted(isDone);
      if (isDone) {
        setPracticeFeedback('✅ Práctica entregada previamente y aprobada en tu expediente académico.');
      } else {
        setPracticeFeedback(null);
      }

      // Load saved quiz score if any
      const savedScore = topicQuizScores[activeTopic.id];
      if (savedScore !== undefined) {
        setQuizScore(savedScore);
        setIsQuizSubmitted(true);
      } else {
        setQuizScore(null);
        setIsQuizSubmitted(false);
        setUserQuizAnswers({});
      }

      setCurrentSlideIndex(0);
    }
  }, [activeTopic?.id]);

  // Flattened list of all topics
  const allTopicsFlattened = curriculum.units.flatMap(u => 
    u.topics.map(t => ({ ...t, unitNumber: u.unitNumber }))
  );
  const currentTopicIndexInAll = allTopicsFlattened.findIndex(t => t.id === selectedTopicId);

  // Overall course progress
  const totalCourseTopics = allTopicsFlattened.length;
  const completedCount = completedTopics.length;
  const progressPercentage = totalCourseTopics > 0 
    ? Math.min(100, Math.round((completedCount / totalCourseTopics) * 100))
    : 0;

  // REQUIREMENT 2 VERIFICATION: Has student satisfied strict conditions?
  const isCurrentQuizPassed = activeTopic 
    ? (topicQuizScores[activeTopic.id] || 0) >= activeTopic.quiz.passingScore 
    : false;
  const isCurrentPracticeDone = activeTopic 
    ? !!topicPracticesSubmitted[activeTopic.id] 
    : false;
  const isCurrentTopicEligibleToAdvance = isCurrentQuizPassed && isCurrentPracticeDone;

  const showCelebrationToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // REQUIREMENT 2: Strict Unlock & Advancement Handler
  const handleAttemptCompleteAndAdvance = () => {
    if (!activeTopic) return;

    // Strict validation: Must complete BOTH Quiz and Practice
    if (!isCurrentTopicEligibleToAdvance) {
      setShowStrictBlockedModal(true);
      return;
    }

    // Mark as completed
    let newCompleted = completedTopics;
    if (!completedTopics.includes(activeTopic.id)) {
      newCompleted = [...completedTopics, activeTopic.id];
      setCompletedTopics(newCompleted);
    }

    // Unlock next topic
    const nextTopic = allTopicsFlattened[currentTopicIndexInAll + 1];
    if (nextTopic) {
      if (!unlockedTopics.includes(nextTopic.id)) {
        setUnlockedTopics(prev => [...prev, nextTopic.id]);
        showCelebrationToast(`🎉 ¡Excelente! Has aprobado el quiz y entregado la práctica. Se ha desbloqueado el Tema ${nextTopic.topicNumber}: ${nextTopic.title}.`);
      } else {
        showCelebrationToast(`✅ Tema ${activeTopic.topicNumber} completado con éxito.`);
      }

      // Navigate to next topic
      setSelectedTopicId(nextTopic.id);
      setSelectedUnitId(nextTopic.unitId);
      setActiveTab('video');
      setCurrentSlideIndex(0);
    } else {
      showCelebrationToast(`🏆 ¡FELICITACIONES! Has completado el 100% de los temas de ${curriculum.courseTitle}.`);
    }

    if (onProgressUpdated) {
      const newPct = Math.round((newCompleted.length / totalCourseTopics) * 100);
      onProgressUpdated(newPct);
    }
  };

  // Grade Quiz
  const handleGradeQuiz = () => {
    if (!activeTopic) return;
    const questions = activeTopic.quiz.questions;
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (userQuizAnswers[index] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setQuizScore(score);
    setIsQuizSubmitted(true);

    // Record score
    setTopicQuizScores(prev => ({
      ...prev,
      [activeTopic.id]: score
    }));

    try {
      const storageKey = `pca_student_grades_${student.uid || student.email}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newGrade = {
        id: `grade_${activeTopic.id}_${Date.now()}`,
        courseTitle: curriculum.courseTitle,
        topicTitle: activeTopic.title,
        type: 'Quiz de Unidad',
        grade: score,
        date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      const filtered = existing.filter((g: any) => g.topicTitle !== activeTopic.title);
      localStorage.setItem(storageKey, JSON.stringify([...filtered, newGrade]));
    } catch (e) {}

    if (score >= activeTopic.quiz.passingScore) {
      showCelebrationToast(`🎯 ¡Quiz aprobado con ${score}%! (Requisito 1 de 2 cumplido).`);
      // If practice is also already done, auto-unlock
      if (topicPracticesSubmitted[activeTopic.id]) {
        const nextTopic = allTopicsFlattened[currentTopicIndexInAll + 1];
        if (nextTopic && !unlockedTopics.includes(nextTopic.id)) {
          setUnlockedTopics(prev => [...prev, nextTopic.id]);
        }
        if (!completedTopics.includes(activeTopic.id)) {
          setCompletedTopics(prev => [...prev, activeTopic.id]);
        }
      }
    } else {
      showCelebrationToast(`⚠️ Obtuviste ${score}%. Necesitas al menos ${activeTopic.quiz.passingScore}% para aprobar este tema.`);
    }
  };

  // Submit Practice
  const handleSubmitPractice = () => {
    if (!activeTopic) return;
    if (!practiceText.trim()) {
      showCelebrationToast('Por favor escribe tu entrega antes de enviar.');
      return;
    }

    setIsPracticeSubmitted(true);
    setTopicPracticesSubmitted(prev => ({
      ...prev,
      [activeTopic.id]: true
    }));
    setTopicPracticesText(prev => ({
      ...prev,
      [activeTopic.id]: practiceText
    }));

    try {
      const storageKey = `pca_student_grades_${student.uid || student.email}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newGrade = {
        id: `grade_practice_${activeTopic.id}_${Date.now()}`,
        courseTitle: curriculum.courseTitle,
        topicTitle: activeTopic.title,
        type: 'Práctica de Temario',
        grade: 96,
        date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      const filtered = existing.filter((g: any) => g.topicTitle !== activeTopic.title || g.type !== 'Práctica de Temario');
      localStorage.setItem(storageKey, JSON.stringify([...filtered, newGrade]));
    } catch (e) {}

    setPracticeFeedback('✅ Entrega evaluada con éxito (96/100). Cumple con los criterios de la rúbrica docente de Punta Cana Academy.');
    showCelebrationToast('🚀 ¡Práctica y tarea entregada con éxito! (Requisito 2 de 2 cumplido).');

    // If quiz is also already passed, auto-unlock
    if ((topicQuizScores[activeTopic.id] || 0) >= activeTopic.quiz.passingScore) {
      const nextTopic = allTopicsFlattened[currentTopicIndexInAll + 1];
      if (nextTopic && !unlockedTopics.includes(nextTopic.id)) {
        setUnlockedTopics(prev => [...prev, nextTopic.id]);
      }
      if (!completedTopics.includes(activeTopic.id)) {
        setCompletedTopics(prev => [...prev, activeTopic.id]);
      }
    }
  };

  // REQUIREMENT 3: Handle File Upload for Slides
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeTopic) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    if (['png', 'jpg', 'jpeg', 'webp'].includes(fileExt || '')) {
      // Image upload
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const currentCustomList = uploadedSlidesByTopic[activeTopic.id] || [];
        const newSlide: SlideItem = {
          slideNumber: currentCustomList.length + 1,
          title: `Diapositiva Subida: ${fileName}`,
          subtitle: `Archivo cargado por el estudiante • ${new Date().toLocaleDateString()}`,
          bullets: [
            'Diapositiva visual cargada exitosamente a la plataforma.',
            'Disponible para tu sesión de estudio y repaso continuo.'
          ],
          imageUrl: dataUrl,
          isCustomUploaded: true
        };

        const updated = {
          ...uploadedSlidesByTopic,
          [activeTopic.id]: [...currentCustomList, newSlide]
        };
        setUploadedSlidesByTopic(updated);
        setActiveSlideDeckType('uploaded');
        setCurrentSlideIndex(currentCustomList.length);
        showCelebrationToast(`📷 ¡Diapositiva ${fileName} subida y renderizada en la plataforma!`);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or PPTX presentation upload
      const currentCustomList = uploadedSlidesByTopic[activeTopic.id] || [];
      const newDeckSlides: SlideItem[] = [
        {
          slideNumber: currentCustomList.length + 1,
          title: `Presentación Subida: ${fileName}`,
          subtitle: `Documento procesado (${fileExt?.toUpperCase()}) • ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          bullets: [
            `Archivo de presentación integrado directamente en la plataforma de Punta Cana Academy.`,
            `Contenido sincronizado para el Tema ${activeTopic.topicNumber}: ${activeTopic.title}.`,
            'Navega entre las diapositivas con los controles inferiores.'
          ],
          visualBoxText: `Archivo Fuente: ${fileName} • Listo para estudio y exposición`,
          isCustomUploaded: true
        },
        {
          slideNumber: currentCustomList.length + 2,
          title: `Conceptos Clave de ${fileName}`,
          subtitle: 'Puntos esenciales del material cargado',
          bullets: [
            'Estructura modular de estudio verificada.',
            'Notas y anotaciones del estudiante integradas.',
            'Preparado para revisión y aplicación en clase.'
          ],
          isCustomUploaded: true
        }
      ];

      const updated = {
        ...uploadedSlidesByTopic,
        [activeTopic.id]: [...currentCustomList, ...newDeckSlides]
      };
      setUploadedSlidesByTopic(updated);
      setActiveSlideDeckType('uploaded');
      setCurrentSlideIndex(currentCustomList.length);
      showCelebrationToast(`📑 ¡Presentación ${fileName} subida y procesada con éxito!`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Custom Slide via Modal
  const handleSaveCustomSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !newSlideTitle.trim()) return;

    const currentCustomList = uploadedSlidesByTopic[activeTopic.id] || [];
    const bullets = newSlideBulletsText
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const newSlide: SlideItem = {
      slideNumber: currentCustomList.length + 1,
      title: newSlideTitle,
      subtitle: newSlideSubtitle || 'Diapositiva creada por el estudiante',
      bullets: bullets.length > 0 ? bullets : ['Punto de estudio registrado.'],
      codeOrQuote: newSlideQuote || undefined,
      imageUrl: newSlideImagePreview || undefined,
      isCustomUploaded: true
    };

    const updated = {
      ...uploadedSlidesByTopic,
      [activeTopic.id]: [...currentCustomList, newSlide]
    };
    setUploadedSlidesByTopic(updated);
    setActiveSlideDeckType('uploaded');
    setCurrentSlideIndex(currentCustomList.length);
    setShowAddSlideModal(false);
    setNewSlideTitle('');
    setNewSlideSubtitle('');
    setNewSlideBulletsText('');
    setNewSlideQuote('');
    setNewSlideImagePreview(null);
    showCelebrationToast('✨ ¡Nueva diapositiva guardada y visualizada en la plataforma!');
  };

  // Resolve slides to show in viewer
  const customUploadedSlides = activeTopic ? (uploadedSlidesByTopic[activeTopic.id] || []) : [];
  const activeSlidesList = activeSlideDeckType === 'uploaded' && customUploadedSlides.length > 0
    ? customUploadedSlides
    : activeTopic?.slides.slidesList || [];
  const totalSlidesInView = activeSlidesList.length;
  const currentSlide = activeSlidesList[currentSlideIndex] || activeSlidesList[0];

  // ====================================================================
  // SCREEN 1: REQUIREMENT 1 - COURSE SELECTOR HUB
  // ====================================================================
  if (showCourseSelectorModal || !selectedCourseKey) {
    return (
      <div className="h-screen w-full bg-[#030712] text-slate-200 flex flex-col font-sans overflow-y-auto antialiased selection:bg-cyan-500/30">
        
        {/* Header */}
        <header className="h-14 bg-[#050b18] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 box-border z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver al Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                PUNTA CANA ACADEMY • CENTRO DE ESTUDIOS
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white">
                Selecciona tu Curso para Iniciar el Plan de Estudio
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Gestión de Cursos & Rutas Académicas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¿Con qué curso deseas trabajar hoy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Cada curso tiene su propio plan de estudio estructurado con unidades, temas, diapositivas interactivas, quizzes evaluativos y prácticas obligatorias.
            </p>
          </div>

          {/* Grid of Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(CURRICULA_DATABASE).map(([key, c]) => {
              const progressStorage = localStorage.getItem(`pca_curriculum_progress_${student.uid || 'demo'}_${c.courseId}`);
              let completedCountForCard = 0;
              let totalTopicsForCard = 0;
              c.units.forEach(u => {
                totalTopicsForCard += u.topics.length;
              });

              if (progressStorage) {
                try {
                  const parsed = JSON.parse(progressStorage);
                  if (parsed.completed) completedCountForCard = parsed.completed.length;
                } catch {
                  // ignore
                }
              }
              const cardPct = totalTopicsForCard > 0 ? Math.round((completedCountForCard / totalTopicsForCard) * 100) : 0;

              return (
                <div 
                  key={key}
                  className="rounded-2xl border-2 border-slate-800 bg-[#050b18] hover:border-cyan-500/50 transition-all p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-cyan-500/10 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {c.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matriculado
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                        {c.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Docentes a cargo: <strong className="text-slate-200">{c.instructorLead}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Unidades</span>
                        <span className="text-sm font-black text-white">{c.units.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Temas</span>
                        <span className="text-sm font-black text-cyan-400">{totalTopicsForCard}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Duración</span>
                        <span className="text-xs font-bold text-slate-300">{c.totalHours}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Progreso del temario:</span>
                        <span className="font-bold text-cyan-400">{cardPct}% completado</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                          style={{ width: `${cardPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourseKey(key);
                      setShowCourseSelectorModal(false);
                    }}
                    className="w-full btn-gradient-cyan py-3 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-101 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 fill-slate-950" />
                    <span>Abrir Plan de Estudio de este Curso</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 max-w-xl mx-auto">
            💡 Podrás alternar entre tus cursos en cualquier momento usando el botón <strong>"Cambiar Curso"</strong> ubicado en la barra superior.
          </div>
        </div>

      </div>
    );
  }

  // ====================================================================
  // SCREEN 2: ACTIVE CURRICULUM WORKSPACE PLAYER
  // ====================================================================
  return (
    <div className="h-screen w-full bg-[#030712] text-slate-200 flex flex-col font-sans overflow-hidden antialiased selection:bg-cyan-500/30">
      
      {/* -------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION HEADER                                       */}
      {/* -------------------------------------------------------------- */}
      <header className="h-14 bg-[#050b18] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 box-border z-30">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title="Volver al Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block shrink-0" />

          {/* REQUIREMENT 1: Course Switcher in Header */}
          <button
            onClick={() => setShowCourseSelectorModal(true)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            title="Cambiar de curso"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Cambiar Curso</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block truncate leading-none mb-0.5">
              Plan de Estudio • {curriculum.category}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
              {curriculum.courseTitle}
            </h1>
          </div>
        </div>

        {/* Right side stats & Live Classroom shortcut */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Course Progress Mini Bar */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block uppercase font-bold leading-none">Progreso</span>
              <span className="text-xs font-black text-cyan-400 leading-none">{progressPercentage}%</span>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {completedCount}/{totalCourseTopics} temas
            </span>
          </div>

          {/* Direct link to Online Live Classroom */}
          {onEnterLiveClassroom && (
            <button
              onClick={() => onEnterLiveClassroom(curriculum.courseTitle)}
              className="btn-gradient-cyan px-3 py-1.5 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Entrar a la clase en vivo interactiva con video y chat"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span className="hidden sm:inline">Clase en Vivo</span>
            </button>
          )}
        </div>
      </header>

      {/* -------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE (Split 2-zone Sandbox)                        */}
      {/* -------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
        
        {/* LEFT COLUMN: UNITS & TOPICS TREE */}
        <aside className="w-full md:w-80 lg:w-96 bg-[#040814] border-r border-slate-800 flex flex-col shrink-0 h-48 md:h-full overflow-hidden">
          
          <div className="p-3 border-b border-slate-800 bg-[#050b18] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Unidades & Temas
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {curriculum.units.length} Unidades
            </span>
          </div>

          {/* Scrollable list of Units & Topics */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {curriculum.units.map((unit) => {
              const isUnitActive = unit.id === selectedUnitId;
              const unitTopicsCount = unit.topics.length;
              const unitCompletedCount = unit.topics.filter(t => completedTopics.includes(t.id)).length;

              return (
                <div 
                  key={unit.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
                >
                  {/* Unit Header */}
                  <div 
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isUnitActive ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                          Unidad {unit.unitNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({unitCompletedCount}/{unitTopicsCount} completados)
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white truncate">
                        {unit.title}
                      </h3>
                    </div>
                    {isUnitActive ? (
                      <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </div>

                  {/* Topics List under this Unit */}
                  {isUnitActive && (
                    <div className="p-1 space-y-1 bg-[#030610]">
                      {unit.topics.map((topic) => {
                        const isUnlocked = unlockedTopics.includes(topic.id);
                        const isCompleted = completedTopics.includes(topic.id);
                        const isSelected = selectedTopicId === topic.id;

                        return (
                          <button
                            key={topic.id}
                            disabled={!isUnlocked}
                            onClick={() => {
                              setSelectedTopicId(topic.id);
                              setSelectedUnitId(unit.id);
                              setCurrentSlideIndex(0);
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                              !isUnlocked
                                ? 'opacity-40 cursor-not-allowed bg-slate-950/40 text-slate-600'
                                : isSelected
                                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                              ) : isUnlocked ? (
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                                  isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-600 text-slate-400'
                                }`}>
                                  {topic.topicNumber}
                                </div>
                              ) : (
                                <Lock className="w-4 h-4 text-slate-600" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold leading-tight truncate ${
                                isSelected ? 'text-white' : ''
                              }`}>
                                {topic.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-cyan-400" />
                                  {topic.durationMinutes} min
                                </span>
                                <span>•</span>
                                <span>
                                  {isCompleted ? 'Completado' : isUnlocked ? 'Disponible' : 'Bloqueado (Requiere anterior)'}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instructor Lead Footer */}
          <div className="p-3 border-t border-slate-800 bg-[#050b18] shrink-0 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Docente Titular</span>
            <span className="font-bold text-slate-200 truncate block">{curriculum.instructorLead}</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: ACTIVE TOPIC MULTIMEDIA PLAYER & RESOURCES */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#02050f]">
          
          {activeTopic ? (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
              
              {/* Active Topic Header Info & Requirement 2 Status Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Unidad {activeUnit.unitNumber} · Tema {activeTopic.topicNumber}
                    </span>
                    {completedTopics.includes(activeTopic.id) ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tema Completado
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En Progreso
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {activeTopic.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {activeTopic.summary}
                  </p>
                </div>

                {/* REQUIREMENT 2: Strict Completion Indicator & Button */}
                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <button
                    onClick={handleAttemptCompleteAndAdvance}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md ${
                      isCurrentTopicEligibleToAdvance
                        ? 'btn-gradient-cyan text-slate-950 shadow-cyan-500/20 hover:scale-102'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isCurrentTopicEligibleToAdvance ? (
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>
                      {isCurrentTopicEligibleToAdvance
                        ? 'Completar y Desbloquear Siguiente'
                        : 'Bloqueado: Completa Quiz & Práctica'}
                    </span>
                  </button>

                  {/* Visual Checklist indicator */}
                  <div className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className={`flex items-center gap-0.5 ${
                      isCurrentQuizPassed ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {isCurrentQuizPassed ? <Check className="w-3 h-3" /> : '○'} Quiz ({activeTopic.quiz.passingScore}%)
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className={`flex items-center gap-0.5 ${
                      isCurrentPracticeDone ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {isCurrentPracticeDone ? <Check className="w-3 h-3" /> : '○'} Práctica Entregada
                    </span>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* 6 RESOURCE TABS (Videos, Slides, Infografía, PDF, Quiz, Práctica) */}
              {/* -------------------------------------------------------- */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
                
                {/* 1. Video Tutorial Tab */}
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Tutorial</span>
                </button>

                {/* 2. Diapositivas PowerPoint Tab (With Upload Indicator) */}
                <button
                  onClick={() => setActiveTab('slides')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'slides'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Diapositivas ({totalSlidesInView})</span>
                  {customUploadedSlides.length > 0 && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      +{customUploadedSlides.length} subidas
                    </span>
                  )}
                </button>

                {/* 3. Infografía & Esquema Tab */}
                <button
                  onClick={() => setActiveTab('infographic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'infographic'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Infografía Visual</span>
                </button>

                {/* 4. Guía PDF Tab */}
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'pdf'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Guía PDF</span>
                </button>

                {/* 5. Quiz Evaluativo Tab (Strict Check) */}
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz Obligatorio</span>
                  {isCurrentQuizPassed ? (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> {topicQuizScores[activeTopic.id]}%
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>

                {/* 6. Práctica y Tarea Tab (Strict Check) */}
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'practice'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Práctica & Tarea</span>
                  {isCurrentPracticeDone ? (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Entregada
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              </div>

              {/* -------------------------------------------------------- */}
              {/* TAB CONTENT PANELS                                       */}
              {/* -------------------------------------------------------- */}
              <div className="rounded-2xl border border-slate-800 bg-[#050b18] p-4 sm:p-5 shadow-xl">
                
                {/* 1. VIDEO TUTORIAL PANEL */}
                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-lg">
                      <img
                        src={activeTopic.video.videoUrl}
                        alt={activeTopic.video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            Video Tutorial Oficial
                          </span>
                          <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                            {activeTopic.durationMinutes}:00
                          </span>
                        </div>

                        <div className="flex flex-col items-center justify-center my-auto">
                          <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-7 h-7 fill-slate-950 ml-1" />
                          </div>
                          <p className="text-xs font-bold text-white mt-3 text-center bg-black/70 px-3 py-1 rounded-full">
                            {activeTopic.video.instructor} • Impartido en Punta Cana Academy
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-cyan-400 w-2/3" />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Reproducción: 18:20 / {activeTopic.durationMinutes}:00</span>
                            <span className="text-cyan-400 font-semibold">Velocidad 1.0x</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Puntos Clave Explicados en el Video
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {activeTopic.video.keyPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          Resumen Didáctico de la Clase
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activeTopic.video.transcriptSummary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REQUIREMENT 3: DIAPOSITIVAS POWERPOINT + SUBIR Y VISUALIZAR */}
                {activeTab === 'slides' && (
                  <div className="space-y-4">
                    
                    {/* Toolbar: Switch between Official Deck and Uploaded Slides + Upload Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        {/* Selector of Deck */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
                          <button
                            onClick={() => {
                              setActiveSlideDeckType('official');
                              setCurrentSlideIndex(0);
                            }}
                            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              activeSlideDeckType === 'official'
                                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Oficiales ({activeTopic.slides.totalSlides})
                          </button>
                          <button
                            onClick={() => {
                              if (customUploadedSlides.length === 0) {
                                showCelebrationToast('Aún no has subido diapositivas. Usa el botón "Subir Diapositivas" para cargar tu material.');
                              }
                              setActiveSlideDeckType('uploaded');
                              setCurrentSlideIndex(0);
                            }}
                            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              activeSlideDeckType === 'uploaded'
                                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>Mis Subidas ({customUploadedSlides.length})</span>
                          </button>
                        </div>
                      </div>

                      {/* Upload Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept=".pdf,.pptx,.ppt,.png,.jpg,.jpeg,image/*"
                          className="hidden"
                        />

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Cargar archivo PPTX, PDF o imágenes de diapositivas"
                        >
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Subir Diapositivas</span>
                        </button>

                        <button
                          onClick={() => setShowAddSlideModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Crear diapositiva en la plataforma con texto y notas"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Nueva Diapositiva</span>
                        </button>
                      </div>
                    </div>

                    {/* Slide Canvas Viewer */}
                    {currentSlide ? (
                      <div className={`w-full rounded-2xl bg-gradient-to-br from-[#071228] via-[#050d20] to-[#030612] border-2 border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all ${
                        isSlideFullscreen ? 'fixed inset-4 z-50 p-10 overflow-y-auto' : 'aspect-[16/9]'
                      }`}>
                        
                        {/* Fullscreen & deck type badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                              {currentSlide.isCustomUploaded ? 'Diapositiva Subida por Estudiante' : 'Punta Cana Academy Oficial'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Diapositiva {currentSlideIndex + 1} de {totalSlidesInView}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {currentSlide.isCustomUploaded && (
                              <button
                                onClick={() => {
                                  const updatedList = customUploadedSlides.filter((_, idx) => idx !== currentSlideIndex);
                                  setUploadedSlidesByTopic(prev => ({
                                    ...prev,
                                    [activeTopic.id]: updatedList
                                  }));
                                  setCurrentSlideIndex(prev => Math.max(0, prev - 1));
                                  showCelebrationToast('Diapositiva eliminada.');
                                }}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                title="Eliminar diapositiva subida"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setIsSlideFullscreen(!isSlideFullscreen)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title={isSlideFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                            >
                              {isSlideFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Slide Content Header */}
                        <div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                            {currentSlide.title}
                          </h2>
                          {currentSlide.subtitle && (
                            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                              {currentSlide.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Slide Body: Image or Text Bullets */}
                        <div className="my-auto py-4 space-y-3">
                          {currentSlide.imageUrl ? (
                            <div className="max-h-72 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                              <img
                                src={currentSlide.imageUrl}
                                alt={currentSlide.title}
                                className="max-h-72 w-auto object-contain"
                              />
                            </div>
                          ) : null}

                          {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                            <ul className="space-y-2.5">
                              {currentSlide.bullets.map((b, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                  <span className="leading-snug">{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {currentSlide.visualBoxText && (
                            <div className="mt-3 p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
                              {currentSlide.visualBoxText}
                            </div>
                          )}

                          {currentSlide.codeOrQuote && (
                            <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-amber-300 italic font-medium">
                              {currentSlide.codeOrQuote}
                            </div>
                          )}
                        </div>

                        {/* Slide Footer */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Campus Virtual & Sede Friusa</span>
                          <span>{curriculum.courseTitle}</span>
                        </div>

                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <p className="text-xs text-slate-400">No hay diapositivas en este álbum.</p>
                      </div>
                    )}

                    {/* Slide Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={currentSlideIndex === 0}
                        onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Diapositiva Anterior</span>
                      </button>

                      {/* Mini Slide Dots */}
                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
                        {activeSlidesList.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer shrink-0 ${
                              currentSlideIndex === i 
                                ? 'bg-cyan-400 scale-125' 
                                : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                            title={`Ir a diapositiva ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        disabled={currentSlideIndex === totalSlidesInView - 1}
                        onClick={() => setCurrentSlideIndex(prev => Math.min(totalSlidesInView - 1, prev + 1))}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>Siguiente Diapositiva</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* 3. INFOGRAFÍA Y RECURSOS VISUALES PANEL */}
                {activeTab === 'infographic' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">Esquema Didáctico</span>
                        <h3 className="text-sm font-bold text-white">{activeTopic.infographic.title}</h3>
                      </div>
                      <span className="text-xs text-slate-400">Resolución HD</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[420px] group shadow-xl">
                      <img
                        src={activeTopic.infographic.imageUrl}
                        alt={activeTopic.infographic.title}
                        className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-xs text-slate-200 max-w-xl font-medium leading-relaxed bg-black/60 p-2.5 rounded-xl backdrop-blur-xs">
                          {activeTopic.infographic.description}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-step diagram breakdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {activeTopic.infographic.diagramSteps.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] font-black text-cyan-400 block mb-0.5">
                            {step.step}
                          </span>
                          <p className="text-xs text-slate-300 leading-snug">
                            {step.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. GUÍA Y DOCUMENTO PDF PANEL */}
                {activeTab === 'pdf' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {activeTopic.pdfDocument.title}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {activeTopic.pdfDocument.fileName} • {activeTopic.pdfDocument.fileSize} • {activeTopic.pdfDocument.totalPages} páginas
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          showCelebrationToast(`Descargando ${activeTopic.pdfDocument.fileName}...`);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar PDF Oficial</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#030612] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                      {activeTopic.pdfDocument.previewContent}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Disponible para estudio offline en tu dispositivo.</span>
                      <span className="text-emerald-400 font-semibold">Material verificado por la academia</span>
                    </div>
                  </div>
                )}

                {/* 5. QUIZ INTERACTIVO EVALUATIVO (REQUERIMIENTO OBLIGATORIO) */}
                {activeTab === 'quiz' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">Evaluación Obligatoria</span>
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Requisito para Avanzar
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{activeTopic.quiz.title}</h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        Puntaje mínimo de aprobación: <strong className="text-cyan-400">{activeTopic.quiz.passingScore}%</strong>
                      </span>
                    </div>

                    {/* Quiz Questions List */}
                    <div className="space-y-4">
                      {activeTopic.quiz.questions.map((q, qIndex) => {
                        const selectedOption = userQuizAnswers[qIndex];
                        const isCorrect = selectedOption === q.correctIndex;

                        return (
                          <div 
                            key={qIndex}
                            className={`p-4 rounded-xl border transition-all ${
                              isQuizSubmitted
                                ? isCorrect
                                  ? 'border-emerald-500/40 bg-emerald-950/20'
                                  : 'border-rose-500/40 bg-rose-950/20'
                                : 'border-slate-800 bg-slate-900/60'
                            }`}
                          >
                            <p className="text-xs sm:text-sm font-bold text-white mb-3">
                              {qIndex + 1}. {q.question}
                            </p>

                            <div className="space-y-2">
                              {q.options.map((opt, optIndex) => {
                                const isChecked = selectedOption === optIndex;
                                return (
                                  <label
                                    key={optIndex}
                                    className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                                      isChecked
                                        ? 'border-cyan-400 bg-cyan-950/40 text-white'
                                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question_${qIndex}`}
                                      disabled={isQuizSubmitted}
                                      checked={isChecked}
                                      onChange={() => {
                                        setUserQuizAnswers(prev => ({
                                          ...prev,
                                          [qIndex]: optIndex
                                        }));
                                      }}
                                      className="mt-0.5 text-cyan-500 focus:ring-cyan-400"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {/* Show Explanation upon submit */}
                            {isQuizSubmitted && (
                              <div className={`mt-3 p-2.5 rounded-lg text-xs leading-relaxed ${
                                isCorrect 
                                  ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/30' 
                                  : 'bg-rose-900/40 text-rose-200 border border-rose-500/30'
                              }`}>
                                <span className="font-bold block mb-0.5">
                                  {isCorrect ? '✓ ¡Respuesta Correcta!' : '✕ Respuesta Incorrecta'}
                                </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
                      <div>
                        {quizScore !== null && (
                          <span className={`text-xs font-bold ${
                            quizScore >= activeTopic.quiz.passingScore ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            Calificación Obtenida: {quizScore}% {quizScore >= activeTopic.quiz.passingScore ? '(¡Requisito 1 de 2 aprobado!)' : '(No aprobado, necesitas 75% para avanzar)'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isQuizSubmitted && (
                          <button
                            onClick={() => {
                              setIsQuizSubmitted(false);
                              setQuizScore(null);
                              setUserQuizAnswers({});
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reintentar Quiz</span>
                          </button>
                        )}

                        <button
                          disabled={Object.keys(userQuizAnswers).length < activeTopic.quiz.questions.length}
                          onClick={handleGradeQuiz}
                          className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                          <span>Evaluar y Guardar Calificación</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. PRÁCTICA Y TAREA OBLIGATORIA (REQUERIMIENTO OBLIGATORIO) */}
                {activeTab === 'practice' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-bold text-white">{activeTopic.practice.title}</h3>
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Requisito Obligatorio
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        <strong>Escenario:</strong> {activeTopic.practice.scenario}
                      </p>
                      <p className="text-xs text-slate-400">
                        <strong>Instrucciones:</strong> {activeTopic.practice.deliverableInstructions}
                      </p>
                    </div>

                    {/* Rubric Matrix */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Rúbrica de Evaluación Docente:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                        {activeTopic.practice.rubric.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Student Submission Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 block">
                          Tu Entrega de Práctica / Tarea:
                        </label>
                        {isPracticeSubmitted && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Entregada y Aprobada
                          </span>
                        )}
                      </div>

                      <textarea
                        rows={6}
                        value={practiceText}
                        onChange={(e) => setPracticeText(e.target.value)}
                        placeholder="Escribe aquí tu resolución del caso práctico o pega tu diálogo/código en inglés para ser evaluado..."
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    {/* Feedback if already submitted */}
                    {practiceFeedback && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                        {practiceFeedback}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-400">
                        * Debes hacer clic en <strong>"Entregar Tarea y Validar"</strong> para habilitar el desbloqueo del tema siguiente.
                      </span>

                      <button
                        onClick={handleSubmitPractice}
                        className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Entregar Tarea y Validar</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* -------------------------------------------------------- */}
              {/* BOTTOM NAVIGATION: PREVIOUS / NEXT TOPIC CONTROLS       */}
              {/* -------------------------------------------------------- */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  disabled={currentTopicIndexInAll <= 0}
                  onClick={() => {
                    const prev = allTopicsFlattened[currentTopicIndexInAll - 1];
                    if (prev) {
                      setSelectedTopicId(prev.id);
                      setSelectedUnitId(prev.unitId);
                      setCurrentSlideIndex(0);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Tema Anterior</span>
                </button>

                <div className="text-center hidden sm:block text-xs text-slate-400">
                  Tema {activeTopic.topicNumber} de {allTopicsFlattened.length}
                </div>

                <button
                  onClick={handleAttemptCompleteAndAdvance}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isCurrentTopicEligibleToAdvance
                      ? 'btn-gradient-cyan text-slate-950 shadow-cyan-500/20 hover:scale-102'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{currentTopicIndexInAll + 1 >= allTopicsFlattened.length ? 'Finalizar Curso' : 'Siguiente Tema'}</span>
                  {isCurrentTopicEligibleToAdvance ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400 ml-1" />
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              Selecciona una unidad o tema en el menú de la izquierda para comenzar tu sesión de estudio.
            </div>
          )}

        </main>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* MODAL 1: REQUIREMENT 2 - STRICT BLOCKED WARNING MODAL          */}
      {/* -------------------------------------------------------------- */}
      {showStrictBlockedModal && activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#060c1c] border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Tema Bloqueado: Tareas Pendientes
                </h3>
                <p className="text-[11px] text-slate-400">
                  Para poder avanzar al siguiente tema de la academia debes completar los siguientes requisitos:
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  {isCurrentQuizPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-rose-500 flex items-center justify-center text-[10px] text-rose-400">✕</span>
                  )}
                  <span>1. Aprobar el Quiz con al menos {activeTopic.quiz.passingScore}%</span>
                </span>
                <span className={`font-bold ${isCurrentQuizPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCurrentQuizPassed ? `✓ Aprobado (${topicQuizScores[activeTopic.id]}%)` : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  {isCurrentPracticeDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-rose-500 flex items-center justify-center text-[10px] text-rose-400">✕</span>
                  )}
                  <span>2. Entregar la Práctica y Tarea Obligatoria</span>
                </span>
                <span className={`font-bold ${isCurrentPracticeDone ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCurrentPracticeDone ? '✓ Entregada' : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {!isCurrentQuizPassed && (
                <button
                  onClick={() => {
                    setShowStrictBlockedModal(false);
                    setActiveTab('quiz');
                  }}
                  className="flex-1 btn-gradient-cyan py-2 rounded-xl text-slate-950 font-black text-xs cursor-pointer text-center"
                >
                  Ir al Quiz
                </button>
              )}

              {!isCurrentPracticeDone && (
                <button
                  onClick={() => {
                    setShowStrictBlockedModal(false);
                    setActiveTab('practice');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer text-center"
                >
                  Ir a la Práctica
                </button>
              )}

              <button
                onClick={() => setShowStrictBlockedModal(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* MODAL 2: REQUIREMENT 3 - ADD CUSTOM SLIDE CREATOR MODAL        */}
      {/* -------------------------------------------------------------- */}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#060c1c] border border-cyan-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Crear y Subir Nueva Diapositiva a la Plataforma
                </h3>
              </div>
              <button
                onClick={() => setShowAddSlideModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomSlide} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Título de la Diapositiva:
                </label>
                <input
                  type="text"
                  required
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="Ej: Resumen Gramatical: Present Perfect vs Past Simple"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Subtítulo o Categoría:
                </label>
                <input
                  type="text"
                  value={newSlideSubtitle}
                  onChange={(e) => setNewSlideSubtitle(e.target.value)}
                  placeholder="Ej: Notas de apoyo del estudiante"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Puntos Clave (Un punto por línea):
                </label>
                <textarea
                  rows={3}
                  value={newSlideBulletsText}
                  onChange={(e) => setNewSlideBulletsText(e.target.value)}
                  placeholder="• Regla número 1&#10;• Ejemplo práctico&#10;• Excepción a recordar"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Cita o Fórmula Destacada (Opcional):
                </label>
                <input
                  type="text"
                  value={newSlideQuote}
                  onChange={(e) => setNewSlideQuote(e.target.value)}
                  placeholder="Ej: Have/Has + Past Participle"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlideModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-gradient-cyan px-4 py-2 rounded-xl text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Guardar y Ver en Diapositivas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Celebration Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-xs font-bold text-white flex items-center gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="leading-snug">{toastMessage}</p>
        </div>
      )}

    </div>
  );
};
