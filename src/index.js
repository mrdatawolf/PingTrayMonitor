import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import HistoryApp from './components/HistoryApp';
import CrashScreen from './components/CrashScreen';
import './App.css';

// The desktop app opens the History window on the same bundle with #history.
const isHistory = window.location.hash === '#history';
if (isHistory) document.body.classList.add('history-window');

createRoot(document.getElementById('root')).render(
  <CrashScreen>{isHistory ? <HistoryApp /> : <App />}</CrashScreen>,
);

// The service worker is for the hosted web build only. Under Electron the
// page is file:// (where it can't register) and offline caching is pointless.
if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol) && !window.electron) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
