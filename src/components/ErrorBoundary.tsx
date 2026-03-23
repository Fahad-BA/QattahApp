import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-600 mb-6">
              عذراً، حدث خطأ في التطبيق. يرجى تحديث الصفحة أو المحاولة لاحقاً.
            </p>
            <div className="bg-red-50 text-red-800 p-4 rounded text-sm text-right mb-6">
              <details>
                <summary className="cursor-pointer font-medium">تفاصيل الخطأ</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}