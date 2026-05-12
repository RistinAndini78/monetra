import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// KODE DARURAT: Menampilkan error langsung di layar jika aplikasi crash
window.onerror = function(msg, url, line, col, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h1 style="font-weight: 900">Aplikasi Error (Pesan Darurat)</h1>
      <p>Pesan: ${msg}</p>
      <p>File: ${url}</p>
      <p>Baris: ${line}</p>
      <pre style="background: #f0f0f0; padding: 10px; border-radius: 10px">${error?.stack || ''}</pre>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #6d28d9; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer">Refresh</button>
    </div>`;
  }
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
