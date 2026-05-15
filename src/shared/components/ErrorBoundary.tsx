import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 커스텀 fallback UI. 미제공 시 기본 에러 화면 표시 */
  fallback?: ReactNode;
  /** 에러 발생 시 호출되는 콜백 (로깅 등 사이드이펙트용) */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React 컴포넌트 트리에서 발생한 JS 에러를 포착해 fallback UI를 렌더링한다.
 * - class component 필수 (getDerivedStateFromError/componentDidCatch는 함수형 컴포넌트 미지원)
 * - React Query의 throwOnError 옵션과 함께 사용하면 API 에러도 포착 가능
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
    this.props.onError?.(error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center',
          minHeight: 200,
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          오류가 발생했습니다
        </p>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
          {this.state.error?.message ?? '알 수 없는 오류입니다.'}
        </p>
        <button
          onClick={this.handleReset}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }
}
