import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Noto Sans KR', sans-serif"
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
            문제가 발생했습니다
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem', maxWidth: '500px' }}>
            페이지를 불러오는 중 오류가 발생했습니다. 새로고침하거나 홈으로 이동해 주세요.
          </p>
          {err && (
            <details style={{ marginBottom: '1.5rem', maxWidth: '600px', textAlign: 'left', width: '100%' }}>
              <summary style={{ cursor: 'pointer', color: '#999', fontSize: '0.85rem' }}>오류 상세</summary>
              <pre style={{
                marginTop: '0.5rem', padding: '0.75rem', background: '#f8f8f8',
                borderRadius: '6px', fontSize: '0.75rem', color: '#c00',
                whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflow: 'auto'
              }}>
                {err.message}
                {'\n\n'}
                {err.stack}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#0046C8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              새로고침
            </button>
            <button
              onClick={this.handleGoHome}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              홈으로
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
