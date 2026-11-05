import React from 'react';
import { X, Compass, Lightbulb, HeartHandshake } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn selection:bg-cyan-500/30 font-sans">
      <div className="relative w-full max-w-2xl liquid-glass-deep rounded-3xl p-8 md:p-10 border border-cyan-500/30 shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-xs uppercase font-mono tracking-widest text-cyan-300">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Visión & Filosofía Académica</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
          Construye tu futuro hoy mismo
        </h2>

        <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed font-normal">
          <p>
            En Punta Cana Academy creemos que la educación debe ser activa, práctica y conectada con la economía real del Caribe y el mundo digital.
          </p>

          <p>
            Unimos la inmersión lingüística en inglés y español con el dominio técnico de programación e inteligencia artificial y la dirección de hospitalidad de lujo en Punta Cana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-2">
            <div className="liquid-glass rounded-2xl p-4 border border-cyan-500/20 text-center">
              <Compass className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
              <div className="font-bold text-xs text-white">Exploración</div>
              <div className="text-[11px] text-slate-400 mt-1">Aprende haciendo.</div>
            </div>

            <div className="liquid-glass rounded-2xl p-4 border border-cyan-500/20 text-center">
              <Lightbulb className="w-5 h-5 mx-auto mb-2 text-sky-400" />
              <div className="font-bold text-xs text-white">Dominio Práctico</div>
              <div className="text-[11px] text-slate-400 mt-1">Habilidades reales de empleo.</div>
            </div>

            <div className="liquid-glass rounded-2xl p-4 border border-cyan-500/20 text-center">
              <HeartHandshake className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
              <div className="font-bold text-xs text-white">Comunidad Friusa</div>
              <div className="text-[11px] text-slate-400 mt-1">Punta Cana para el mundo.</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="btn-gradient-cyan px-6 py-2.5 rounded-full text-slate-950 font-bold text-xs shadow-md cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
