import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// DETEKTOR ERROR: Menampilkan pesan jika aplikasi crash
window.onerror = function(msg, url, line, col, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 40px; color: #e11d48; font-family: sans-serif; text-align: center;">
      <h1 style="font-weight: 900; font-size: 2rem;">Waduh, Ada Masalah!</h1>
      <p style="color: #64748b; margin-bottom: 20px;">Aplikasi gagal dimuat karena error berikut:</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 20px; text-align: left; font-size: 12px; border: 1px solid #f1f5f9; overflow: auto; max-width: 600px; margin: 0 auto;">
        <strong>Pesan:</strong> ${msg}<br>
        <strong>File:</strong> ${url}<br>
        <strong>Baris:</strong> ${line}<br><br>
        <pre>${error?.stack || 'Tidak ada detail tambahan.'}</pre>
      </div>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer;">Coba Refresh</button>
    </div>`;
  }
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
