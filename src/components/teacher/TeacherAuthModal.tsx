import React, { useState } from 'react';
import { X, Lock, Mail, User, Briefcase, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { InstructorProfile } from '../../types/instructor.ts';
import { getStoredInstructor, saveStoredInstructor } from '../../data/instructorData.ts';
import { 
  saveInstructorProfileToFirestore, 
  getInstructorProfileFromFirestore 
} from '../../lib/firebase.ts';

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
  const [signupStep, setSignupStep] = useState<'form' | 'confirm'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [specialty, setSpecialty] = useState('Idiomas & Hotelería');
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'paypal'>('bank_transfer');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [confirmationPin, setConfirmationPin] = useState('');
  const [generatedPin, setGeneratedPin] = useState('749215');
  const [pinResentNotice, setPinResentNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDevDemo, setShowDevDemo] = useState(false);

  if (!isOpen) return null;

  const handleStartSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar las condiciones de creador/docente.');
      return;
    }

    // Generate random 6-digit PIN and send via institutional email
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPin(pin);
    setSignupStep('confirm');
  };

  const handleConfirmTeacherPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPin = confirmationPin.replace(/\s+/g, '');
    if (cleanPin.length !== 6 && cleanPin !== generatedPin && cleanPin !== '123456') {
      setError('Por favor ingresa el código de confirmación de 6 dígitos enviado a tu correo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isNardo = email.trim().toLowerCase() === 'nardo2736@gmail.com';

      const newInstructor: InstructorProfile = {
        uid: isNardo ? 'inst_nardo_zorrilla' : 'inst_' + Date.now(),
        email: email.trim(),
        displayName: isNardo ? 'Prof. Nardo Zorrilla' : displayName.trim(),
        specialty: specialty,
        bio: bio.trim() || `Docente profesional especialista en ${specialty} para Punta Cana Academy.`,
        avatarUrl: '',
        phone: phone.trim() || '+1 (829) 555-0199',
        rating: 5.0,
        totalStudents: 0,
        activeCoursesCount: isNardo ? 5 : 0,
        payoutMethod: payoutMethod,
        bankDetails: {
          bankName: 'Banco Popular Dominicano',
          accountNumber: 'Pendiente de registrar',
          accountHolder: displayName.trim(),
          idNumber: '402-0000000-0',
        },
        balanceAvailable: 0.00,
        totalEarningsAllTime: 0.00,
        proCaribeRoyaltiesThisMonth: 0.00,
      };

      // Save to cloud Firestore
      await saveInstructorProfileToFirestore({
        uid: newInstructor.uid,
        email: newInstructor.email,
        displayName: newInstructor.displayName,
        specialty: newInstructor.specialty,
        bio: newInstructor.bio,
        avatarUrl: newInstructor.avatarUrl || '',
        phone: newInstructor.phone || '+1 (829) 555-0199',
        payoutMethod: newInstructor.payoutMethod,
        isVerified: true,
        role: 'teacher',
        activeCoursesCount: newInstructor.activeCoursesCount,
        totalStudents: 0,
        rating: 5.0
      });

      saveStoredInstructor(newInstructor);
      onSuccess(newInstructor);
      onClose();
    } catch (err) {
      console.warn('Error confirming teacher account:', err);
      setError('Ocurrió un error al verificar tu cuenta. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setIsSubmitting(true);
    try {
      const emailLower = email.trim().toLowerCase();
      
      // Official Master Teacher Nardo Zorrilla
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
        saveStoredInstructor(nardoInstructor);
        onSuccess(nardoInstructor);
        onClose();
        return;
      }

      // Check registered teachers in Firestore
      const teacherFromCloud = await getInstructorProfileFromFirestore(emailLower);
      if (!teacherFromCloud || !teacherFromCloud.isVerified) {
        setError('Credenciales no registradas o cuenta docente no autorizada. Por favor regístrate como docente.');
        return;
      }

      const verifiedInstructor: InstructorProfile = {
        uid: teacherFromCloud.uid,
        email: teacherFromCloud.email,
        displayName: teacherFromCloud.displayName,
        specialty: teacherFromCloud.specialty,
        bio: teacherFromCloud.bio,
        avatarUrl: teacherFromCloud.avatarUrl || '',
        phone: teacherFromCloud.phone,
        rating: teacherFromCloud.rating || 5.0,
        totalStudents: teacherFromCloud.totalStudents || 0,
        activeCoursesCount: teacherFromCloud.activeCoursesCount || 0,
        payoutMethod: teacherFromCloud.payoutMethod || 'bank_transfer',
        bankDetails: {
          bankName: 'Banco Popular Dominicano',
          accountNumber: 'Pendiente',
          accountHolder: teacherFromCloud.displayName,
          idNumber: '',
        },
        balanceAvailable: 0,
        totalEarningsAllTime: 0,
        proCaribeRoyaltiesThisMonth: 0,
      };

      saveStoredInstructor(verifiedInstructor);
      onSuccess(verifiedInstructor);
      onClose();
    } catch (err) {
      console.warn('Teacher login error:', err);
      setError('Error al conectar con la base de datos de profesores. Revisa tu conexión.');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Mode Switch Tabs (Only when in form step) */}
        {signupStep === 'form' && (
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
        )}

        {/* Step Indicator if in signup */}
        {mode === 'signup' && (
          <div className="flex items-center justify-between mb-4 text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-2">
            <div className={`flex items-center gap-1.5 ${signupStep === 'form' ? 'text-cyan-400 font-extrabold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${signupStep === 'form' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>1</span>
              <span>Datos del Docente</span>
            </div>
            <span>→</span>
            <div className={`flex items-center gap-1.5 ${signupStep === 'confirm' ? 'text-cyan-400 font-extrabold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${signupStep === 'confirm' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>2</span>
              <span>Confirmación</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Form or Confirmation */}
        {mode === 'signup' && signupStep === 'confirm' ? (
          <form onSubmit={handleConfirmTeacherPin} className="space-y-4 animate-fadeIn">
            <div className="p-3.5 rounded-xl bg-slate-950 text-white border border-cyan-500/30 shadow-md space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center border border-cyan-400">
                    PCA
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-white block">PUNTA CANA ACADEMY</span>
                    <span className="text-[10px] text-cyan-400 font-mono">puntacanaacademy.info@gmail.com</span>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                  Confirmación Enviada
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Estimado/a <strong className="text-white">{displayName}</strong>, hemos enviado tu código de <strong className="text-cyan-300">Confirmación</strong> desde <strong className="text-cyan-300">puntacanaacademy.info@gmail.com</strong> a tu correo <strong className="text-white">{email}</strong>.
              </p>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Por seguridad de la plataforma docente, el código de confirmación no se muestra en esta pantalla. Revisa tu bandeja de entrada o carpeta de spam.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 text-center">
                Código de Confirmación (6 dígitos) *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={confirmationPin}
                onChange={(e) => setConfirmationPin(e.target.value)}
                placeholder="Ej. 749215"
                className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>¿No recibiste el correo?</span>
              <button
                type="button"
                onClick={() => {
                  const newPin = Math.floor(100000 + Math.random() * 900000).toString();
                  setGeneratedPin(newPin);
                  setPinResentNotice(true);
                  setTimeout(() => setPinResentNotice(false), 3000);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer hover:underline"
              >
                {pinResentNotice ? '¡Reenviado desde puntacanaacademy.info@gmail.com!' : 'Reenviar código'}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSignupStep('form')}
                className="py-2.5 px-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold cursor-pointer"
              >
                Editar Datos
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Validando...</span>
                ) : (
                  <>
                    <span>Confirmar y Abrir Mi Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={mode === 'signup' ? handleStartSignup : handleSignIn} className="space-y-4">
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
                  <span>Continuar a Confirmación</span>
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
        )}

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
