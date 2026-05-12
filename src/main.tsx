import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple Error Boundary to catch white screen issues
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-white min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-black text-rose-600 mb-4">Aplikasi Terhenti (Error)</h1>
          <pre className="bg-slate-50 p-6 rounded-3xl text-xs text-slate-500 overflow-auto max-w-lg text-left border border-slate-100">
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} className="mt-8 bg-violet-600 text-white px-8 py-3 rounded-2xl font-bold">
            Refresh Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
