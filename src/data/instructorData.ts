import { 
  InstructorProfile, 
  TeacherCourse, 
  StudentTaskSubmission, 
  AbsenceJustification, 
  TeacherAnnouncement, 
  PayoutTransaction 
} from '../types/instructor.ts';

export const INITIAL_INSTRUCTOR: InstructorProfile = {
  uid: 'inst_nardo_zorrilla',
  email: 'nardo2736@gmail.com',
  displayName: 'Prof. Nardo Zorrilla',
  specialty: 'Director Académico & Docente Principal',
  bio: 'Docente y Director Académico de Punta Cana Academy. Especialista en gestión de hotelería, tecnología y negocios en Bávaro-Punta Cana.',
  avatarUrl: '',
  phone: '+1 (829) 555-8940',
  rating: 5.0,
  totalStudents: 148,
  activeCoursesCount: 4,
  payoutMethod: 'bank_transfer',
  bankDetails: {
    bankName: 'Banco Popular Dominicano',
    accountNumber: '7984321098',
    accountHolder: 'Nardo Zorrilla',
    idNumber: '402-0987654-3',
  },
  balanceAvailable: 1450.00,
  totalEarningsAllTime: 8940.00,
  proCaribeRoyaltiesThisMonth: 480.00,
};

export const INITIAL_TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'ingles-bilingue-hoteleria',
    title: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    category: 'Idiomas & Hotelería',
    price: 89.00,
    status: 'published',
    enrolledStudentsCount: 112,
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    description: 'Programa oficial intensivo para recepción hotelera, servicio VIP y negocios en el polo turístico de Punta Cana.',
    level: 'Principiante',
    proCaribeEligible: true,
    units: [
      {
        id: 'u1',
        title: 'Unidad 1: Fundamentos de Hospitalidad & Saludo VIP',
        description: 'Vocabulario clave, fórmulas de cortesía y bienvenida a huéspedes.',
        topics: [
          {
            id: 't1-1',
            title: '1.1 Saludo al huésped y registro en front desk',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            slidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRdemo/embed',
            slidesCount: 16,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            hasQuiz: true,
            hasPractice: true,
            quizQuestions: [
              {
                question: '¿Cuál es la forma más profesional de dar la bienvenida a un huésped?',
                options: ['Hey, what do you need?', 'Good morning, welcome to our resort. How may I assist you today?', 'Give me your passport', 'Wait a moment please'],
                correctAnswer: 1,
              },
              {
                question: 'En caso de que una habitación no esté lista a la llegada del huésped, ¿qué cortesía es estándar?',
                options: ['Pedirle que vuelva en 4 horas sin ofrecer nada', 'Ofrecer un pase al lounge/bebida de cortesía y guardar su equipaje', 'Cobrarle un suplemento', 'Ignorar el retraso'],
                correctAnswer: 1,
              }
            ],
            practiceInstructions: 'Graba un audio o escribe el diálogo completo recibiendo a una familia de 3 personas que llega antes de la hora de check-in.',
            practiceRubric: 'Claridad en el vocabulario de hospitalidad (40%), cortesía y amabilidad (30%), solución de equipaje y bienvenida (30%).',
          },
          {
            id: 't1-2',
            title: '1.2 Manejo de solicitudes y concierge en inglés',
            durationMinutes: 50,
            hasQuiz: true,
            hasPractice: true,
            quizQuestions: [
              {
                question: '¿Qué frase indica recomendación confiable de excursiones en Punta Cana?',
                options: ['Go somewhere outside', 'I highly recommend our Saona Island catamaran excursion for your family', 'It is not my job', 'Search it online'],
                correctAnswer: 1,
              }
            ],
            practiceInstructions: 'Elabora una recomendación por escrito de 2 actividades locales en Bávaro/Punta Cana para un cliente corporativo.',
            practiceRubric: 'Estructura formal y gramática adecuada.',
          }
        ]
      },
      {
        id: 'u2',
        title: 'Unidad 2: Situaciones Críticas & Resolución de Conflictos',
        description: 'Técnicas de desescalada, empatía profesional y compensaciones hoteleras.',
        topics: [
          {
            id: 't2-1',
            title: '2.1 Protocolo HEAT para reclamos en recepción',
            durationMinutes: 60,
            hasQuiz: true,
            hasPractice: true,
          }
        ]
      }
    ]
  },
  {
    id: 'full-stack-web-dev',
    title: 'Desarrollo Web Full Stack con React, Node & TypeScript',
    category: 'Tecnología & Software',
    price: 120.00,
    status: 'published',
    enrolledStudentsCount: 36,
    rating: 4.88,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description: 'Aprende a programar aplicaciones web escalables modernas de cero a producción con tecnologías en alta demanda.',
    level: 'Intermedio',
    proCaribeEligible: true,
    units: [
      {
        id: 'u1-dev',
        title: 'Unidad 1: Arquitectura Frontend Moderna con Vite y Tailwind',
        description: 'Fundamentos de componentes, hooks y Tailwind CSS.',
        topics: [
          {
            id: 't1-dev-1',
            title: '1.1 Configuración de entorno y estructura limpia de componentes',
            durationMinutes: 55,
            hasQuiz: true,
            hasPractice: true,
          }
        ]
      }
    ]
  }
];

export const INITIAL_STUDENT_SUBMISSIONS: StudentTaskSubmission[] = [
  {
    id: 'sub_001',
    studentId: 'stu_demo_01',
    studentName: 'Nardo Zorrilla',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    topicId: 't1-1',
    topicTitle: '1.1 Saludo al huésped y registro en front desk',
    submittedAt: 'Hace 3 horas (Hoy 10:15 AM)',
    status: 'pending',
    submissionText: 'Good morning Mr. and Mrs. Johnson, welcome to Punta Cana Luxury Resort! It is a true pleasure to welcome you. While your master suite finishes final inspection, our bellman will safely take care of your luggage, and please join us at the Caribbean Welcome Lounge for our signature tropical cocktail.',
    attachmentName: 'CheckIn_Dialogue_AudioScript_Nardo.docx',
  },
  {
    id: 'sub_002',
    studentId: 'stu_carla_22',
    studentName: 'Carla Méndez',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    topicId: 't1-2',
    topicTitle: '1.2 Manejo de solicitudes y concierge en inglés',
    submittedAt: 'Ayer 5:40 PM',
    status: 'graded',
    submissionText: 'For our guests looking for a relaxed dinner after a day at the beach, I always recommend Jellyfish Restaurant in Bávaro for fresh seafood right on the shore, and Bachata Rosa in BlueMall for live music.',
    grade: 98,
    teacherFeedback: '¡Excelente vocabulario y redacción impecable Carla! Has capturado a la perfección el tono de hospitalidad de alto nivel.',
    gradedAt: 'Ayer 8:30 PM',
  },
  {
    id: 'sub_003',
    studentId: 'stu_luis_09',
    studentName: 'Luis David Peña',
    courseId: 'full-stack-web-dev',
    courseTitle: 'Desarrollo Web Full Stack con React, Node & TypeScript',
    topicId: 't1-dev-1',
    topicTitle: '1.1 Configuración de entorno y estructura limpia de componentes',
    submittedAt: 'Hace 1 día',
    status: 'pending',
    submissionText: 'Repositorio GitHub con proyecto Vite + Tailwind + TypeScript configurado con ESLint estricto y componentes modularizados: https://github.com/luisdavid/pca-hotel-app',
  }
];

export const INITIAL_ABSENCE_JUSTIFICATIONS: AbsenceJustification[] = [
  {
    id: 'just_001',
    studentId: 'stu_demo_01',
    studentName: 'Nardo Zorrilla',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    classDate: 'Viernes 24 Octubre (Sesión 6:30 PM)',
    reason: 'Turno de guardia extraordinario en recepción del Hotel Hard Rock por llegada de vuelo chárter nocturno.',
    documentProofName: 'Constancia_Turno_RRHH_HardRock.pdf',
    status: 'pending',
    submittedAt: 'Hace 4 horas',
  },
  {
    id: 'just_002',
    studentId: 'stu_mariana_11',
    studentName: 'Mariana Santos',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    classDate: 'Miércoles 22 Octubre',
    reason: 'Cita médica odontológica programada en Santo Domingo.',
    documentProofName: 'Certificado_Medico_Dental.pdf',
    status: 'approved',
    submittedAt: 'Hace 3 días',
    teacherNotes: 'Justificación aprobada. Recuerda revisar la grabación del temario 1.2.',
  }
];

export const INITIAL_TEACHER_ANNOUNCEMENTS: TeacherAnnouncement[] = [
  {
    id: 'anc_001',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    title: 'Próxima Clase en Vivo con Simulación Front Desk: Jueves 6:30 PM',
    content: 'Estimados estudiantes, en nuestra próxima sesión en vivo realizaremos dinámicas en parejas simulando check-ins VIP. Por favor repasen las diapositivas de la Unidad 1 antes de ingresar al Aula Virtual.',
    createdAt: 'Hoy a las 9:00 AM',
    priority: 'urgent',
    viewsCount: 84,
  },
  {
    id: 'anc_002',
    courseId: 'ingles-bilingue-hoteleria',
    courseTitle: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    title: 'Nuevo Material Didáctico: Guía en PDF descargable de Frases Clave en Recepción',
    content: 'Se ha habilitado en la sección de Descargas el glosario oficial con más de 120 términos de servicio hotelero bilingüe.',
    createdAt: 'Hace 2 días',
    priority: 'normal',
    viewsCount: 110,
  }
];

export const INITIAL_PAYOUT_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 'tx_801',
    date: '01 Nov 2026',
    amount: 480.00,
    type: 'pro_caribe_pool',
    description: 'Regalías Mensuales 10% Fondo Pro Caribe (Asesorías didácticas y clases virtuales)',
    status: 'completed',
    receiptReference: 'REG-PRO-2026-11-PCA',
  },
  {
    id: 'tx_802',
    date: '28 Oct 2026',
    amount: 57.85,
    type: 'course_sale_65',
    description: 'Venta Curso Inglés Bilingüe ($89.00 USD - Ganancia neta acreditada)',
    status: 'completed',
    receiptReference: 'SALE-ENG-89-012',
  },
  {
    id: 'tx_803',
    date: '25 Oct 2026',
    amount: 78.00,
    type: 'course_sale_65',
    description: 'Venta Curso Desarrollo Web ($120.00 USD - Ganancia neta acreditada)',
    status: 'completed',
    receiptReference: 'SALE-DEV-120-009',
  },
  {
    id: 'tx_804',
    date: '20 Oct 2026',
    amount: -1200.00,
    type: 'withdrawal',
    description: 'Transferencia Bancaria procesada a Banco Popular Dominicano (*2109)',
    status: 'completed',
    receiptReference: 'BPD-TRANS-994102',
  }
];

// Helper functions for reading and persisting Teacher Data
export function getStoredInstructor(): InstructorProfile {
  try {
    const raw = localStorage.getItem('pca_active_instructor');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored instructor', e);
  }
  return INITIAL_INSTRUCTOR;
}

export function saveStoredInstructor(profile: InstructorProfile): void {
  localStorage.setItem('pca_active_instructor', JSON.stringify(profile));
}

export function getStoredTeacherCourses(instructorEmail?: string): TeacherCourse[] {
  try {
    const active = getStoredInstructor();
    const email = instructorEmail || active.email;
    const key = `pca_teacher_courses_${email.toLowerCase()}`;
    const raw = localStorage.getItem(key) || localStorage.getItem('pca_teacher_courses');
    if (raw) return JSON.parse(raw);
    
    // Official courses are assigned to Profesor Nardo
    if (email.toLowerCase() === 'nardo2736@gmail.com') {
      return INITIAL_TEACHER_COURSES;
    }
    
    // New teachers start with 0 courses so they can create their own
    return [];
  } catch (e) {
    console.warn('Error reading teacher courses', e);
  }
  return [];
}

export function saveStoredTeacherCourses(courses: TeacherCourse[], instructorEmail?: string): void {
  const active = getStoredInstructor();
  const email = instructorEmail || active.email;
  const key = `pca_teacher_courses_${email.toLowerCase()}`;
  localStorage.setItem(key, JSON.stringify(courses));
  localStorage.setItem('pca_teacher_courses', JSON.stringify(courses));
}

export function getStoredSubmissions(instructorEmail?: string): StudentTaskSubmission[] {
  try {
    const active = getStoredInstructor();
    const email = instructorEmail || active.email;
    const key = `pca_student_submissions_${email.toLowerCase()}`;
    const raw = localStorage.getItem(key) || localStorage.getItem('pca_student_submissions');
    if (raw) return JSON.parse(raw);
    
    if (email.toLowerCase() === 'nardo2736@gmail.com') {
      return INITIAL_STUDENT_SUBMISSIONS;
    }
    return [];
  } catch (e) {
    console.warn('Error reading submissions', e);
  }
  return [];
}

export function saveStoredSubmissions(subs: StudentTaskSubmission[], instructorEmail?: string): void {
  const active = getStoredInstructor();
  const email = instructorEmail || active.email;
  const key = `pca_student_submissions_${email.toLowerCase()}`;
  localStorage.setItem(key, JSON.stringify(subs));
  localStorage.setItem('pca_student_submissions', JSON.stringify(subs));
}

export function getStoredJustifications(instructorEmail?: string): AbsenceJustification[] {
  try {
    const active = getStoredInstructor();
    const email = instructorEmail || active.email;
    const key = `pca_absence_justifications_${email.toLowerCase()}`;
    const raw = localStorage.getItem(key) || localStorage.getItem('pca_absence_justifications');
    if (raw) return JSON.parse(raw);
    
    if (email.toLowerCase() === 'nardo2736@gmail.com') {
      return INITIAL_ABSENCE_JUSTIFICATIONS;
    }
    return [];
  } catch (e) {
    console.warn('Error reading justifications', e);
  }
  return [];
}

export function saveStoredJustifications(justs: AbsenceJustification[], instructorEmail?: string): void {
  const active = getStoredInstructor();
  const email = instructorEmail || active.email;
  const key = `pca_absence_justifications_${email.toLowerCase()}`;
  localStorage.setItem(key, JSON.stringify(justs));
  localStorage.setItem('pca_absence_justifications', JSON.stringify(justs));
}

export function getStoredTeacherAnnouncements(): TeacherAnnouncement[] {
  try {
    const raw = localStorage.getItem('pca_teacher_announcements');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading announcements', e);
  }
  return INITIAL_TEACHER_ANNOUNCEMENTS;
}

export function saveStoredTeacherAnnouncements(ancs: TeacherAnnouncement[]): void {
  localStorage.setItem('pca_teacher_announcements', JSON.stringify(ancs));
}

export function getStoredPayouts(): PayoutTransaction[] {
  try {
    const raw = localStorage.getItem('pca_teacher_payouts');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading payouts', e);
  }
  return INITIAL_PAYOUT_TRANSACTIONS;
}

export function saveStoredPayouts(txs: PayoutTransaction[]): void {
  localStorage.setItem('pca_teacher_payouts', JSON.stringify(txs));
}
