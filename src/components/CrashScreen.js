import React from 'react';

// Last-resort fallback so a render error shows something actionable instead
// of a blank window (packaged builds have no menu or DevTools to recover).
export default class CrashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[CrashScreen] Render error:', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{
        padding: 24, fontFamily: 'system-ui, sans-serif', color: '#e0e0e0',
        background: '#141414', minHeight: '100vh', boxSizing: 'border-box',
        WebkitAppRegion: 'no-drag', userSelect: 'text',
      }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Something went wrong loading this window</h2>
        <p style={{ margin: '0 0 16px', color: '#8c8c8c', fontSize: 13 }}>
          Reload usually fixes it. If it keeps happening, send the error below.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '6px 16px', fontSize: 14, cursor: 'pointer', borderRadius: 6,
            border: '1px solid #3a3a3a', background: '#1668dc', color: '#fff',
          }}
        >
          Reload
        </button>
        <pre style={{
          marginTop: 16, padding: 12, fontSize: 11, whiteSpace: 'pre-wrap',
          background: '#1f1f1f', borderRadius: 6, color: '#bfbfbf',
        }}>
          {String(error?.stack || error)}
        </pre>
      </div>
    );
  }
}
