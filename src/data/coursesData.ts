export interface SyllabusItem {
  module: string;
  duration: string;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Idiomas' | 'Tecnología' | 'Turismo y Hotelería' | 'Inteligencia Artificial' | 'Liderazgo';
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  schedule: string;
  modality: 'Presencial en Friusa y Online Híbrido';
  students: number;
  rating: number;
  coverImage: string;
  description: string;
  longDescription: string;
  badge?: string;
  highlights: string[];
  whatYouWillLearn: string[];
  syllabus: SyllabusItem[];
  certification: string;
  priceMonthly: string;
}

export const COURSES_LIST: Course[] = [
  {
    id: 'ingles-bilingue-caribe',
    slug: 'ingles-bilingue-caribe',
    title: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    subtitle: 'Domina el inglés conversacional y profesional con profesores nativos en Punta Cana.',
    category: 'Idiomas',
    instructor: 'Prof. Sofia Morales, Ph.D.',
    instructorRole: 'Directora Académica de Lenguas Extranjeras',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    level: 'Intermedio',
    duration: '12 Semanas',
    schedule: 'Lunes a Jueves - 6:30 PM a 8:30 PM (o Modalidad Flexible Online)',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 1420,
    rating: 4.95,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    description: 'Programa intensivo de inmersión lingüística con enfoque en hotelería internacional, atención VIP, negociación y diplomacia corporativa.',
    longDescription: 'Diseñado específicamente para las demandas del sector turístico y corporativo de Punta Cana y el Caribe. Este curso te llevará desde una comunicación básica hasta la fluidez profesional con pronunciación pulida, vocabulario de negocios, simulaciones de servicio de hospitalidad y preparación para entrevistas internacionales.',
    badge: 'Más Popular',
    highlights: [
      'Laboratorio de reducción de acento con nativos',
      'Casos reales de diplomacia y atención VIP',
      'Certificación C1/C2 avalada internacionalmente',
    ],
    whatYouWillLearn: [
      'Fluidez espontánea en conversaciones de negocios y servicio de lujo',
      'Técnicas avanzadas de negociación y resolución de conflictos en inglés',
      'Redacción ejecutiva de correos, propuestas y reportes financieros',
      'Vocabulario especializado en turismo, cadenas hoteleras y aviación comercial',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Fundamentos de Pronunciación y Comunicación Diaria',
        duration: '3 Semanas',
        topics: ['Fonética y reducción de acento', 'Estructuras dinámicas de conversación', 'Escucha activa en entornos ruidosos de servicio'],
      },
      {
        module: 'Módulo 2: Inglés de Hospitalidad & Atención al Huésped Internacional',
        duration: '3 Semanas',
        topics: ['Check-in y concierge de ultra lujo', 'Manejo de quejas y situaciones imprevistas', 'Etiqueta gastronómica y tours guiados'],
      },
      {
        module: 'Módulo 3: Negocios, Finanzas y Contratos Turísticos',
        duration: '3 Semanas',
        topics: ['Presentaciones orales impactantes', 'Negociación con touroperadores', 'Métricas hoteleras (RevPAR, ADR, Occupancy)'],
      },
      {
        module: 'Módulo 4: Simulación Profesional y Examen de Certificación',
        duration: '3 Semanas',
        topics: ['Entrevistas simuladas con directores de cadenas hoteleras', 'Examen C1 oficial', 'Entrega de diploma y graduación'],
      },
    ],
    certification: 'Diploma de Certificación Bilingüe Avanzado - Punta Cana Academy & Alianzas Internacionales',
    priceMonthly: '$19,99/m',
  },
  {
    id: 'programacion-web-fullstack',
    slug: 'programacion-web-fullstack',
    title: 'Programación Web Full-Stack & UI Moderna',
    subtitle: 'Aprende a programar software real con React, TypeScript, Tailwind CSS y Node.',
    category: 'Tecnología',
    instructor: 'Ing. Alex Rivera',
    instructorRole: 'Staff Frontend Engineer & Arquitecto Cloud',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level: 'Principiante',
    duration: '14 Semanas',
    schedule: 'Martes y Jueves - 7:00 PM a 9:30 PM + Laboratorios de Sábados',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 2100,
    rating: 4.92,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende React, TypeScript, Node.js y diseño de interfaces liquid-glass. Crea aplicaciones web listas para producción y trabaja de forma remota.',
    longDescription: 'Conviértete en un desarrollador full-stack altamente cotizado. Desde los fundamentos de HTML, CSS moderno y JavaScript ES6+, hasta arquitecturas reactivas con React 19, integración de APIs REST, bases de datos en la nube y despliegues automáticos.',
    badge: 'Alta Demanda',
    highlights: [
      'Construcción de 5 aplicaciones reales para tu portafolio',
      'Arquitectura UI moderna y diseño Liquid Glass',
      'Tutoría técnica 1-a-1 y preparación para empleo remoto',
    ],
    whatYouWillLearn: [
      'Desarrollo frontend profesional con React, TypeScript y Tailwind CSS',
      'Arquitectura de APIs backend con Node.js, Express y bases de datos SQL/NoSQL',
      'Autenticación segura con JWT, OAuth y sistemas biométricos Passkey',
      'Despliegue continuo en la nube (Vercel, AWS, Cloud Run) y buenas prácticas de Git',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Fundamentos de la Web Moderna & Git',
        duration: '3 Semanas',
        topics: ['HTML5 semántico', 'Tailwind CSS avanzado & Glassmorphism', 'Control de versiones con Git & GitHub'],
      },
      {
        module: 'Módulo 2: JavaScript Moderno & TypeScript',
        duration: '4 Semanas',
        topics: ['ES6+, Asincronía, Promesas, Async/Await', 'Sistema de tipos en TypeScript', 'Manipulación eficiente del DOM'],
      },
      {
        module: 'Módulo 3: React & Arquitectura de Componentes',
        duration: '4 Semanas',
        topics: ['Hooks, estado global y ciclo de vida', 'Rendimiento y patrones de diseño', 'Consumo de APIs y renderizado interactivo'],
      },
      {
        module: 'Módulo 4: Backend, Bases de Datos & Proyecto Final',
        duration: '3 Semanas',
        topics: ['Node.js & Express APIs', 'Persistencia de datos', 'Publicación del proyecto final en producción'],
      },
    ],
    certification: 'Certificado Profesional Full-Stack Web Developer - Punta Cana Academy',
    priceMonthly: '$19,99/m',
  },
  {
    id: 'turismo-hospitalidad-lujo',
    slug: 'turismo-hospitalidad-lujo',
    title: 'Gestión de Hotelería de Lujo & Ecoturismo en Punta Cana',
    subtitle: 'Lidera la industria turística del Caribe con las mejores prácticas globales.',
    category: 'Turismo y Hotelería',
    instructor: 'Carlos de la Rosa',
    instructorRole: 'Gerente General en Puntacana Resort & Consultor Hotelero',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    level: 'Avanzado',
    duration: '8 Semanas',
    schedule: 'Miércoles - 6:00 PM a 9:00 PM + Pasantía de Campo en Resort',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 980,
    rating: 4.96,
    coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende operaciones de resorts 5 estrellas, arquitectura de experiencia de huéspedes VIP y sostenibilidad ambiental en el corazón de Punta Cana.',
    longDescription: 'Punta Cana es el epicentro de la hotelería del Caribe. Este programa exclusivo te brinda acceso directo a metodologías de gestión de clase mundial, estándares Forbes Travel Guide, gestión de ingresos (Revenue Management) y prácticas de turismo ecológico que protegen nuestros corales y costas.',
    badge: 'Insignia',
    highlights: [
      'Días de inmersión y pasantía en resorts de lujo',
      'Auditoría y certificación de sostenibilidad ambiental',
      'Frameworks de servicio VIP y concierge de alta gama',
    ],
    whatYouWillLearn: [
      'Gestión integral de operaciones de resorts y condohoteles de lujo',
      'Estándares internacionales de calidad Forbes y Leading Hotels of the World',
      'Estrategias de Revenue Management y maximización de ocupación',
      'Planificación de eventos, bodas de destino y turismo de convenciones',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Anatomía de un Resort de Lujo en el Caribe',
        duration: '2 Semanas',
        topics: ['Estructura departamental y sinergias', 'El viaje del huésped de lujo (Guest Journey Mapping)', 'Liderazgo de equipos multiculturales'],
      },
      {
        module: 'Módulo 2: Revenue Management y Comercialización',
        duration: '2 Semanas',
        topics: ['Fijación dinámica de tarifas', 'Distribución digital (OTAs, GDS, venta directa)', 'Análisis de rentabilidad por metro cuadrado'],
      },
      {
        module: 'Módulo 3: Ecoturismo y Sostenibilidad Costera',
        duration: '2 Semanas',
        topics: ['Certificaciones Blue Flag y EarthCheck', 'Manejo de residuos y energía solar en complejos', 'Conservación de arrecifes y playas'],
      },
      {
        module: 'Módulo 4: Proyecto de Consultoría Hotelera',
        duration: '2 Semanas',
        topics: ['Desarrollo de un plan de operaciones para resort', 'Pitch ante directivos del sector', 'Certificación final'],
      },
    ],
    certification: 'Diplomado Superior en Dirección Hotelera & Sostenibilidad - Punta Cana Academy',
    priceMonthly: '$19,99/m',
  },
  {
    id: 'inteligencia-artificial-creativa',
    slug: 'inteligencia-artificial-creativa',
    title: 'AI Master Class: Inteligencia Artificial Aplicada a Negocios',
    subtitle: 'Domina los modelos generativos, automatización de flujos y herramientas AI del futuro.',
    category: 'Inteligencia Artificial',
    instructor: 'Dr. Marcus Vance',
    instructorRole: 'Investigador de IA & Científico de Datos',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    level: 'Intermedio',
    duration: '6 Semanas',
    schedule: 'Viernes - 6:00 PM a 9:00 PM + Sesiones de Práctica en Vivo',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 1840,
    rating: 4.93,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende a integrar herramientas de IA en tus procesos diarios: síntesis de contenido, agentes inteligentes, análisis de datos y generación visual.',
    longDescription: 'La inteligencia artificial ya no es opcional. En esta Master Class práctica, aprenderás a construir flujos automatizados con modelos de lenguaje masivos, diseñar asistentes para atención a clientes en hotelería y crear contenido multimedia impactante en segundos.',
    badge: 'Nuevo',
    highlights: [
      'Automatización de procesos empresariales con agentes IA',
      'Flujos de síntesis de video, imagen y audio multimodal',
      'Lanzamiento de un proyecto de IA comercial funcional',
    ],
    whatYouWillLearn: [
      'Técnicas avanzadas de Prompt Engineering y razonamiento con modelos de frontera',
      'Creación de chatbots y agentes inteligentes para atención al cliente y ventas',
      'Automatización de reportes, análisis de opiniones de huéspedes y datos turísticos',
      'Generación de assets visuales y de marketing con calidad cinematográfica',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Fundamentos de Modelos de Frontera',
        duration: '1.5 Semanas',
        topics: ['Arquitectura de LLMs y modelos multimodales', 'Prompting estructurado', 'Limitaciones, sesgos y privacidad de datos'],
      },
      {
        module: 'Módulo 2: Generación Multimedia y Creativa',
        duration: '1.5 Semanas',
        topics: ['Síntesis de imágenes hiperrealistas', 'Video generativo y avatares para e-learning', 'Campañas publicitarias automatizadas'],
      },
      {
        module: 'Módulo 3: Agentes Autónomos y Automatización No-Code / Low-Code',
        duration: '1.5 Semanas',
        topics: ['Creación de agentes para atención 24/7', 'Integración con WhatsApp Business y CRMs', 'Análisis de datos en tiempo real'],
      },
      {
        module: 'Módulo 4: Implementación Empresarial & Certificación',
        duration: '1.5 Semanas',
        topics: ['Retorno de inversión (ROI) de la IA', 'Defensa de proyecto ante panel evaluador', 'Certificación AI Master Class'],
      },
    ],
    certification: 'Certificado de Especialización en Inteligencia Artificial Aplicada - PCA Tech Labs',
    priceMonthly: '$19,99/m',
  },
  {
    id: 'liderazgo-comercial-caribe',
    slug: 'liderazgo-comercial-caribe',
    title: 'Liderazgo Ejecutivo, Comercio y Negocios Internacionales',
    subtitle: 'Desarrolla visión estratégica para liderar empresas y proyectos de inversión en el Caribe.',
    category: 'Liderazgo',
    instructor: 'Lic. Maria Santana',
    instructorRole: 'Managing Partner en Santana & Asociados',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    level: 'Avanzado',
    duration: '10 Semanas',
    schedule: 'Sábados - 9:00 AM a 1:00 PM',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 820,
    rating: 4.89,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    description: 'Estrategias de inversión, régimen de zonas francas, liderazgo de equipos de alto rendimiento y apertura de mercados transfronterizos.',
    longDescription: 'El crecimiento económico de la República Dominicana y la región este demanda líderes con habilidades gerenciales globales. Este programa abarca marcos legales de inversión, negociación internacional, liderazgo emocional y gestión financiera para directivos.',
    badge: 'Ejecutivo',
    highlights: [
      'Simulaciones de comités de inversión con casos reales',
      'Régimen fiscal y normativo de zonas francas en Rep. Dom.',
      'Mentoría individual con ejecutivos del sector corporativo',
    ],
    whatYouWillLearn: [
      'Habilidades de negociación diplomática y resolución estratégica de disputas',
      'Finanzas corporativas, valoración de proyectos e inversión en bienes raíces',
      'Liderazgo transformacional y gestión del cambio en organizaciones',
      'Atracción de capital extranjero y alianzas público-privadas',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Pensamiento Estratégico y Gobierno Corporativo',
        duration: '2.5 Semanas',
        topics: ['Toma de decisiones bajo incertidumbre', 'Métricas de desempeño ejecutivo', 'Cultura de alta responsabilidad'],
      },
      {
        module: 'Módulo 2: Finanzas para la Dirección y Leyes de Inversión',
        duration: '2.5 Semanas',
        topics: ['Estructuración de fideicomisos y Ley Confotur', 'Modelos financieros de rentabilidad', 'Estrategias fiscales legales'],
      },
      {
        module: 'Módulo 3: Negociación Internacional y Comunicación de Impacto',
        duration: '2.5 Semanas',
        topics: ['Técnicas de Harvard aplicadas a negocios caribeños', 'Presentaciones ejecutivas ante inversionistas', 'Storytelling financiero'],
      },
      {
        module: 'Módulo 4: Capstone de Liderazgo y Plan de Expansión',
        duration: '2.5 Semanas',
        topics: ['Presentación final de plan de negocios', 'Panel con ejecutivos invitados', 'Graduación ejecutiva'],
      },
    ],
    certification: 'Diploma Ejecutivo en Alta Dirección & Comercio Internacional - Punta Cana Academy',
    priceMonthly: '$19,99/m',
  },
  {
    id: 'marketing-digital-turistico',
    slug: 'marketing-digital-turistico',
    title: 'Marketing Digital y Redes Sociales para Marcas Turísticas',
    subtitle: 'Construye marcas magnéticas que atraigan viajeros de todo el mundo.',
    category: 'Tecnología',
    instructor: 'Laura Batista',
    instructorRole: 'Directora de Crecimiento & Estrategia Digital',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    level: 'Principiante',
    duration: '8 Semanas',
    schedule: 'Lunes y Miércoles - 7:00 PM a 9:00 PM',
    modality: 'Presencial en Friusa y Online Híbrido',
    students: 1250,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    description: 'Campañas de Meta Ads, TikTok para turismo, Google Search para reservas directas y colaboraciones con creadores de contenido.',
    longDescription: 'Aprende a posicionar hoteles, excursiones, restaurantes y servicios profesionales en los canales digitales que realmente generan conversiones. Domina la pauta publicitaria en Meta Ads, Google Ads y la producción de video viral para Instagram y TikTok.',
    badge: 'Práctico',
    highlights: [
      'Gestión de presupuesto real en campañas de Meta & Google',
      'Estrategias de contenido viral para destinos turísticos',
      'Optimización de embudos de conversión para reservas directas',
    ],
    whatYouWillLearn: [
      'Segmentación avanzada de turistas internacionales en plataformas publicitarias',
      'Creación de contenido audiovisual atractivo con dispositivos móviles y herramientas pro',
      'Email marketing automatizado para fidelización de huéspedes y clientes',
      'Analítica web y cálculo exacto del retorno de inversión publicitaria (ROAS)',
    ],
    syllabus: [
      {
        module: 'Módulo 1: Identidad de Marca y Estrategia de Contenidos',
        duration: '2 Semanas',
        topics: ['Posicionamiento de marca en el Caribe', 'Narrativas que enamoran a viajeros', 'Calendario editorial inteligente'],
      },
      {
        module: 'Módulo 2: Publicidad Pagada en Meta Ads & Google',
        duration: '2 Semanas',
        topics: ['Pixel de Meta y tracking de conversiones', 'Campañas de búsqueda en Google para reservas', 'Retargeting para carritos abandonados'],
      },
      {
        module: 'Módulo 3: Video Marketing en TikTok e Instagram Reels',
        duration: '2 Semanas',
        topics: ['Guiones con ganchos magnéticos', 'Edición ágil de video turístico', 'Trabajo profesional con influencers'],
      },
      {
        module: 'Módulo 4: Medición, Optimización y Proyecto Final',
        duration: '2 Semanas',
        topics: ['Dashboards en Google Looker Studio', 'Auditoría de campañas activas', 'Entrega de certificado oficial'],
      },
    ],
    certification: 'Certificado Profesional en Marketing Turístico & Estrategia Digital - Punta Cana Academy',
    priceMonthly: '$19,99/m',
  },
];
