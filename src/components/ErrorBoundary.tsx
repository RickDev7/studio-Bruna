'use client';

import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="rounded-xl bg-white p-8 shadow-lg border border-pink-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ops! Algo deu errado
              </h2>
              <p className="text-gray-600 mb-6">
                Desculpe pelo inconveniente. Por favor, tente recarregar a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF69B4] hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 