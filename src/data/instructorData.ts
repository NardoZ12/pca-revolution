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
  totalStudents: 0,
  activeCoursesCount: 5,
  payoutMethod: 'bank_transfer',
  bankDetails: {
    bankName: 'Banco Popular Dominicano',
    accountNumber: '7984321098',
    accountHolder: 'Nardo Zorrilla',
    idNumber: '402-0987654-3',
  },
  balanceAvailable: 0.00,
  totalEarningsAllTime: 0.00,
  proCaribeRoyaltiesThisMonth: 0.00,
};

export const INITIAL_TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'turismo-hospitalidad-lujo',
    title: 'Gestión de Hotelería de Lujo & Ecoturismo en Punta Cana',
    category: 'Turismo, Hotelería de Lujo & Ecoturismo del Caribe',
    price: 29.99,
    status: 'published',
    enrolledStudentsCount: 0,
    rating: 5.0,
    thumbnail: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende operaciones de resorts 5 estrellas, arquitectura de experiencia de huéspedes VIP y sostenibilidad ambiental en el corazón de Punta Cana.',
    level: 'Avanzado',
    proCaribeEligible: true,
    units: []
  },
  {
    id: 'programacion-web-fullstack',
    title: 'Programación Web Full-Stack & UI Moderna',
    category: 'Tecnología, Programación Web & Software',
    price: 19.45,
    status: 'published',
    enrolledStudentsCount: 0,
    rating: 5.0,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende React, TypeScript, Node.js y diseño de interfaces liquid-glass. Crea aplicaciones web listas para producción y trabaja de forma remota.',
    level: 'Principiante',
    proCaribeEligible: true,
    units: []
  },
  {
    id: 'ingles-bilingue-caribe',
    title: 'Inglés Bilingüe & Inmersión para Hotelería y Negocios',
    category: 'Lenguas & Idiomas Extranjeros (Inglés General, Francés, Alemán, Ruso, Italiano, Mandarín)',
    price: 34.98,
    status: 'published',
    enrolledStudentsCount: 0,
    rating: 5.0,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    description: 'Programa oficial intensivo para recepción hotelera, servicio VIP y negocios en el polo turístico de Punta Cana.',
    level: 'Intermedio',
    proCaribeEligible: true,
    units: []
  },
  {
    id: 'inteligencia-artificial-creativa',
    title: 'AI Master Class: Inteligencia Artificial Aplicada a Negocios',
    category: 'Inteligencia Artificial, Automatización & Negocios Digitales',
    price: 41.30,
    status: 'published',
    enrolledStudentsCount: 0,
    rating: 5.0,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    description: 'Aprende a integrar herramientas de IA en tus procesos diarios: síntesis de contenido, agentes inteligentes, análisis de datos y generación visual.',
    level: 'Intermedio',
    proCaribeEligible: true,
    units: []
  },
  {
    id: 'liderazgo-comercial-caribe',
    title: 'Liderazgo Ejecutivo, Comercio y Negocios Internacionales',
    category: 'Liderazgo, Oratoria, Ventas & Habilidades Blandas',
    price: 24.99,
    status: 'published',
    enrolledStudentsCount: 0,
    rating: 5.0,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    description: 'Desarrolla visión estratégica para liderar empresas y proyectos de inversión en el Caribe.',
    level: 'Avanzado',
    proCaribeEligible: true,
    units: []
  }
];

export const INITIAL_STUDENT_SUBMISSIONS: StudentTaskSubmission[] = [];

export const INITIAL_ABSENCE_JUSTIFICATIONS: AbsenceJustification[] = [];

export const INITIAL_TEACHER_ANNOUNCEMENTS: TeacherAnnouncement[] = [];

export const INITIAL_PAYOUT_TRANSACTIONS: PayoutTransaction[] = [];


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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((t: any) => t && !t.id?.startsWith('mock_') && !t.receiptReference?.includes('MOCK'));
      }
    }
  } catch (e) {
    console.warn('Error reading payouts', e);
  }
  return [];
}

export function saveStoredPayouts(txs: PayoutTransaction[]): void {
  localStorage.setItem('pca_teacher_payouts', JSON.stringify(txs));
}
