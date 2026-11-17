import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import HistoryApp from './components/HistoryApp';
import './App.css';

// The desktop app opens the History window on the same bundle with #history.
const isHistory = window.location.hash === '#history';
if (isHistory) document.body.classList.add('history-window');

createRoot(document.getElementById('root')).render(isHistory ? <HistoryApp /> : <App />);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
