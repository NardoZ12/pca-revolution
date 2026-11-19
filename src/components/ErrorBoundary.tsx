import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocurrió un error inesperado en la interfaz.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Punta Cana Academy UI ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020713] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full rounded-2xl bg-[#081424] border border-cyan-500/30 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-black text-xl">
              !
            </div>
            <h2 className="text-xl font-black text-white">Restableciendo Punta Cana Academy</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detectamos un inconveniente temporal en esta vista. Haz clic abajo para recargar tu sesión de forma segura.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl btn-gradient-cyan text-slate-950 font-black text-sm cursor-pointer"
            >
              Volver al Inicio y Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
