import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('StarPocket Uncaught UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080b14] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-amber-500/20">
            ⚠️
          </div>
          <h2 className="text-base font-bold mb-2 text-amber-300">StarPocket Notice</h2>
          <p className="text-xs text-slate-400 max-w-xs mb-5 font-mono">
            {this.state.error?.message || 'An unexpected interface error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-400/20 active:scale-95 transition cursor-pointer"
          >
            Reload / 再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
