import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#f87171', backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>⚠️ 웹 애플리케이션 실행 중 오류가 발생했습니다</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '12px' }}>오류 메시지:</p>
          <pre style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', overflowX: 'auto', color: '#fca5a5' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#10b981', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            페이지 새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

