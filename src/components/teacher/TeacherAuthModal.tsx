import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Briefcase, CheckCircle2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { InstructorProfile } from '../../types/instructor.ts';
import { saveStoredInstructor } from '../../data/instructorData.ts';

interface TeacherAuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'forgot_password';
  onClose: () => void;
  onSuccess: (instructor: InstructorProfile) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [specialty, setSpecialty] = useState('Idiomas & Hotelería');
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'paypal'>('bank_transfer');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetSentSuccess, setResetSentSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync modal mode every time it opens so 'Iniciar Sesión' opens in signin mode!
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setResetSentSuccess(null);
      setResetNewPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Direct Teacher Registration in PostgreSQL Cloud SQL
  const handleStartSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSentSuccess(null);

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    if (password.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres para mayor seguridad.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar las condiciones de creador/docente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isNardo = cleanEmail === 'nardo2736@gmail.com';

      const newInstructorPayload: InstructorProfile = {
        uid: isNardo ? 'inst_nardo_zorrilla' : 'inst_' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
        email: cleanEmail,
        displayName: isNardo ? 'Prof. Nardo Zorrilla' : displayName.trim(),
        specialty,
        bio: bio.trim() || `Docente profesional especialista en ${specialty} para Punta Cana Academy.`,
        avatarUrl: '',
        phone: phone.trim() || '+1 (829) 555-0199',
        rating: 5.0,
        totalStudents: 0,
        activeCoursesCount: isNardo ? 6 : 0,
        payoutMethod,
        bankDetails: {
          bankName: 'Banco Popular Dominicano',
          accountNumber: 'Pendiente de registrar',
          accountHolder: displayName.trim(),
          idNumber: '402-0000000-0',
        },
        balanceAvailable: 0.0,
        totalEarningsAllTime: 0.0,
        proCaribeRoyaltiesThisMonth: 0.0,
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      let res: Response;
      try {
        res = await fetch('/api/auth/teacher/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: password.trim(),
            profile: newInstructorPayload,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      const data = await res.json();
      if (!res.ok || !data?.instructor) {
        setError(data?.error || 'No se pudo completar el registro docente.');
        return;
      }

      const registeredInstructor: InstructorProfile = data.instructor;
      saveStoredInstructor(registeredInstructor);
      onSuccess(registeredInstructor);
      onClose();
    } catch (err: any) {
      console.warn('Error confirming teacher account:', err);
      setError('Ocurrió un error al registrar tu cuenta docente. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password Reset for Teachers via PostgreSQL Backend
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSentSuccess(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (resetNewPassword.trim().length < 6) {
      setError('Ingresa tu nueva contraseña (mínimo 6 caracteres).');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/teacher/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword: resetNewPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Este correo no está registrado como docente en el sistema.');
        return;
      }
      setResetSentSuccess(data?.message || '¡Contraseña docente actualizada con éxito!');
      setPassword(resetNewPassword.trim());
      setResetNewPassword('');
      setTimeout(() => {
        setMode('signin');
      }, 1500);
    } catch {
      setError('Error al restablecer la contraseña docente. Intenta de nuevo.');
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
      const cleanEmail = email.trim().toLowerCase();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      let res: Response;
      try {
        res = await fetch('/api/auth/teacher/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: password.trim() }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      const data = await res.json();
      if (!res.ok || !data?.instructor) {
        setError(
          data?.error || 'Credenciales incorrectas o profesor no registrado en el sistema.'
        );
        return;
      }

      const verifiedInstructor: InstructorProfile = data.instructor;
      saveStoredInstructor(verifiedInstructor);
      onSuccess(verifiedInstructor);
      onClose();
    } catch (err: any) {
      console.warn('Teacher login error:', err);
      setError('No se pudo conectar con el servidor. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
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
            {mode === 'forgot_password'
              ? 'Restablecer Contraseña Docente'
              : mode === 'signup'
                ? 'Registro Gratis como Docente'
                : 'Acceso al Portal de Profesores'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {mode === 'forgot_password'
              ? 'Ingresa tu correo registrado y te enviaremos el enlace oficial de Firebase para restablecer tu contraseña.'
              : mode === 'signup'
                ? 'Sube tus cursos, genera atractivos ingresos extra y recibe regalías mensuales del 10% del fondo de usuarios Pro Caribe.'
                : 'Ingresa para gestionar tus cursos, calificar tareas y transmitir en vivo.'}
          </p>
        </div>

        {/* Mode Switch Tabs (When not in forgot password) */}
        {mode !== 'forgot_password' && (
          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setResetSentSuccess(null); }}
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
              onClick={() => { setMode('signin'); setError(null); setResetSentSuccess(null); }}
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

        {/* Success Alert */}
        {resetSentSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resetSentSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {mode === 'forgot_password' ? (
          <form onSubmit={handlePasswordReset} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correo Electrónico Registrado *
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
                Nueva Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Actualizando...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Actualizar Contraseña Docente</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setResetSentSuccess(null); }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                ← Volver al Inicio de Sesión
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
            {mode === 'signin' && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('forgot_password'); setError(null); setResetSentSuccess(null); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
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
                  <span>Registrarme y Crear Cuenta Docente</span>
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

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Plataforma Oficial de Instructores de Punta Cana Academy • Encriptación 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
