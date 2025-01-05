import { Detail } from '@raycast/api';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Detail
          markdown={`# Error
An error occurred in the application:

\`\`\`
${this.state.error?.message || 'Unknown error'}
\`\`\`

Please try again or contact support if the issue persists.`}
        />
      );
    }

    return this.props.children;
  }
} 