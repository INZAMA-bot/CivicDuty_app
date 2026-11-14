import React from 'react';
import { RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  resetKey?: string;
  onResetToHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

const BaseComponent = React.Component as unknown as {
  new (props: ErrorBoundaryProps): {
    props: ErrorBoundaryProps;
    state: ErrorBoundaryState;
    setState: (
      next:
        | Partial<ErrorBoundaryState>
        | ((prev: ErrorBoundaryState) => Partial<ErrorBoundaryState>)
    ) => void;
  };
};

export class ErrorBoundary extends BaseComponent {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error',
    };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  componentDidCatch(error: Error) {
    if (typeof console !== 'undefined') {
      console.error('[CivicDuty ErrorBoundary]', error);
    }
  }

  handleRecoverView = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onResetToHome) {
      this.props.onResetToHome();
    }
  };

  handleHardReload = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[55vh] flex items-center justify-center p-4 bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-5 space-y-4 shadow-sm text-center">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert size={20} strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {this.props.fallbackTitle || 'Display Interrupted'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This browser session encountered a temporary display interruption. You can recover immediately below without losing your place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={this.handleRecoverView}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Return to Feed</span>
              </button>
              <button
                type="button"
                onClick={this.handleHardReload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw size={13} />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
