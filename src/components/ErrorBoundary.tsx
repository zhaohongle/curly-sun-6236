import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary wrapper to catch rendering errors in child components.
 * Displays a fallback UI when an error occurs.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#F5F0E8',
              background: '#0A0A0A',
            }}
          >
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                marginBottom: '1rem',
              }}
            >
              Something went wrong
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
              Please try refreshing the page.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
