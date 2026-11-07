import React, { useState } from 'react';
import { X, Lock, Mail, User, Briefcase, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { InstructorProfile } from '../../types/instructor.ts';
import { getStoredInstructor, saveStoredInstructor } from '../../data/instructorData.ts';

interface TeacherAuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (instructor: InstructorProfile) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [specialty, setSpecialty] = useState('Idiomas & Hotelería');
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'paypal'>('bank_transfer');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDevDemo, setShowDevDemo] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (mode === 'signup') {
        if (!displayName.trim() || !email.trim() || !password.trim()) {
          setError('Por favor completa todos los campos requeridos.');
          return;
        }
        if (!termsAccepted) {
          setError('Debes aceptar las condiciones de creador/docente.');
          return;
        }

        const isNardo = email.trim().toLowerCase() === 'nardo2736@gmail.com';

        const newInstructor: InstructorProfile = {
          uid: isNardo ? 'inst_nardo_zorrilla' : 'inst_' + Date.now(),
          email: email.trim(),
          displayName: isNardo ? 'Prof. Nardo Zorrilla' : displayName.trim(),
          specialty: specialty,
          bio: bio.trim() || `Instructor profesional especialista en ${specialty} para Punta Cana Academy.`,
          avatarUrl: '', // No default photo, instructor can upload their own
          phone: phone.trim() || '+1 (829) 555-0199',
          rating: 5.0,
          totalStudents: isNardo ? 148 : 0,
          activeCoursesCount: isNardo ? 4 : 0,
          payoutMethod: payoutMethod,
          bankDetails: {
            bankName: 'Banco Popular Dominicano',
            accountNumber: 'Pendiente de registrar',
            accountHolder: displayName.trim(),
            idNumber: '402-0000000-0',
          },
          balanceAvailable: isNardo ? 1450.00 : 0.00,
          totalEarningsAllTime: isNardo ? 8940.00 : 0.00,
          proCaribeRoyaltiesThisMonth: isNardo ? 480.00 : 0.00,
        };

        localStorage.setItem(`pca_instructor_${email.trim().toLowerCase()}`, JSON.stringify(newInstructor));
        saveStoredInstructor(newInstructor);
        onSuccess(newInstructor);
        onClose();
      } else {
        // Sign In
        if (!email.trim() || !password.trim()) {
          setError('Ingresa tu correo y contraseña.');
          return;
        }

        const emailLower = email.trim().toLowerCase();
        if (emailLower === 'nardo2736@gmail.com') {
          const nardoInstructor: InstructorProfile = {
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
          saveStoredInstructor(nardoInstructor);
          onSuccess(nardoInstructor);
          onClose();
          return;
        }

        const savedCustom = localStorage.getItem(`pca_instructor_${emailLower}`);
        let instructor: InstructorProfile = savedCustom ? JSON.parse(savedCustom) : {
          uid: 'inst_' + Date.now(),
          email: email.trim(),
          displayName: email.split('@')[0],
          specialty: 'Docente Académico',
          bio: 'Profesor de Punta Cana Academy.',
          avatarUrl: '',
          phone: '',
          rating: 5.0,
          totalStudents: 0,
          activeCoursesCount: 0,
          payoutMethod: 'bank_transfer',
          bankDetails: {
            bankName: 'Banco Popular Dominicano',
            accountNumber: 'Pendiente',
            accountHolder: email.split('@')[0],
            idNumber: '',
          },
          balanceAvailable: 0,
          totalEarningsAllTime: 0,
          proCaribeRoyaltiesThisMonth: 0,
        };

        saveStoredInstructor(instructor);
        onSuccess(instructor);
        onClose();
      }
    }, 450);
  };

  const handleQuickDemoTeacher = () => {
    const defaultInstructor = getStoredInstructor();
    saveStoredInstructor(defaultInstructor);
    onSuccess(defaultInstructor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#040e1d] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Punta Cana Academy • Instructors Hub</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {mode === 'signup' ? 'Registro Gratis como Docente' : 'Acceso al Portal de Profesores'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {mode === 'signup'
              ? 'Sube tus cursos, genera atractivos ingresos extra y recibe regalías mensuales del 10% del fondo de usuarios Pro Caribe.'
              : 'Ingresa para gestionar tus cursos, calificar tareas y transmitir en vivo.'}
          </p>
        </div>

        {/* Private Dev Demo Toggle */}
        {showDevDemo && (
          <div className="mb-5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="text-left">
              <p className="text-xs font-bold text-cyan-300">Acceso de prueba docente (Privado)</p>
              <p className="text-[11px] text-slate-400">Ingresar como Prof. Nardo Zorrilla (nardo2736@gmail.com)</p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoTeacher}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-black hover:bg-cyan-400 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              Entrar Demo
            </button>
          </div>
        )}

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Registro Gratis
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ya soy Profesor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo / Título Profesional *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Lic. Carlos Santana"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Área o Habilidad que Enseñas *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Idiomas & Hotelería">Idiomas & Hotelería</option>
                    <option value="Tecnología & Programación">Tecnología & Programación</option>
                    <option value="Turismo, Buceo & Excursiones">Turismo, Buceo & Excursiones</option>
                    <option value="Gastronomía & Bartending">Gastronomía & Bartending</option>
                    <option value="Negocios & Marketing">Negocios & Marketing</option>
                    <option value="Diseño & Fotografía">Diseño & Fotografía</option>
                    <option value="Otra Habilidad Especializada">Otra Habilidad Especializada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Método Preferido de Cobro
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="bank_transfer">Transferencia Bancaria (Banco Dominicano o Internacional)</option>
                    <option value="paypal">PayPal Internacional (USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp / Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (829) 000-0000"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@ejemplo.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-900"
                />
                <span className="leading-relaxed">
                  Acepto los términos de instructores: <strong>Inscripción 100% gratuita</strong>, 
                  <strong> cobro de ingresos netos</strong> por cada venta de curso a través de PayPal o Transferencia Bancaria, 
                  y participación mensual en el <strong>10% del fondo de usuarios Pro Caribe</strong>.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Procesando...</span>
            ) : mode === 'signup' ? (
              <>
                <span>Crear Cuenta Gratis y Abrir Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Entrar al Dashboard Docente</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge & Private Dev Link */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Plataforma Oficial de Instructores de Punta Cana Academy • Encriptación 256-bit</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDevDemo(!showDevDemo)}
            className="text-[10px] text-slate-500/60 hover:text-cyan-400 transition-colors mt-1 cursor-pointer"
          >
            {showDevDemo ? '• Ocultar acceso de prueba' : '• Modo de prueba (Privado)'}
          </button>
        </div>
      </div>
    </div>
  );
};
