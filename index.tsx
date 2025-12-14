import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- API KEY POLYFILL ---
// Fix for "API Key is missing" on Vercel/Client-side.
// Browsers don't have 'process.env' by default, and Vercel hides env vars from the client for security.
// We explicitly define it here to ensure the AI features work.
if (typeof window !== 'undefined') {
  if (!(window as any).process) {
    (window as any).process = { env: {} };
  }
  if (!(window as any).process.env) {
    (window as any).process.env = {};
  }
  // Set the specific API Key provided
  (window as any).process.env.API_KEY = "AIzaSyCzikMvKoe3dJhl2CCJCkinIM-ErT3d4T4";
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);