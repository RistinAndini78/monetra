import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import PushNotificationService from './lib/notifications';

// Register service worker for offline support (PWA)
registerSW({ immediate: true });

// Initialize push notifications if supported
if (PushNotificationService.isSupported()) {
  // Request notification permission (user will be prompted)
  PushNotificationService.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Push notifications enabled');
      // Optionally subscribe to push notifications
      PushNotificationService.subscribeToPushNotifications().then((subscription) => {
        if (subscription) {
          console.log('Subscribed to push notifications:', subscription.endpoint);
        }
      });
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
