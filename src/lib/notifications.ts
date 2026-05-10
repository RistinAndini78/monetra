/**
 * Web Push Notification Service
 * Handles subscription, permission requests, and sending push notifications
 */

export interface NotificationOptions {
  title: string;
  options?: NotificationOptions;
}

class PushNotificationService {
  /**
   * Request notification permission from user
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * Check if notifications are supported
   */
  static isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Send a simple notification
   */
  static sendNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      badge?: string;
      tag?: string;
      requireInteraction?: boolean;
    }
  ): Notification | null {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options,
    });

    notification.addEventListener('click', () => {
      window.focus();
      notification.close();
    });

    return notification;
  }

  /**
   * Subscribe to push notifications via service worker
   */
  static async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!navigator.serviceWorker) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
        });
      }

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  /**
   * Send transaction alerts
   */
  static sendTransactionAlert(
    type: 'income' | 'expense',
    amount: number,
    category: string
  ): void {
    const title = type === 'income' ? '💰 Pemasukan Tercatat' : '📊 Pengeluaran Tercatat';
    const body =
      `${category}: ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)}`;

    this.sendNotification(title, {
      body,
      tag: `transaction-${Date.now()}`,
      icon: type === 'income' ? '💰' : '📊',
    });
  }

  /**
   * Send budget alert
   */
  static sendBudgetAlert(
    category: string,
    spent: number,
    limit: number,
    percentage: number
  ): void {
    const title =
      percentage >= 100 ? '⚠️ Budget Terlampaui!' : '📈 Budget Warning';
    const status =
      percentage >= 100
        ? `Anda sudah melebihi budget untuk ${category}`
        : `${category}: ${percentage}% dari budget`;

    this.sendNotification(title, {
      body: status,
      tag: `budget-${category}`,
      requireInteraction: percentage >= 100,
    });
  }

  /**
   * Send goal progress notification
   */
  static sendGoalProgressNotification(
    goalName: string,
    percentage: number
  ): void {
    const title = percentage === 100 ? '🎉 Goal Tercapai!' : '🎯 Goal Progress';

    this.sendNotification(title, {
      body: `${goalName}: ${percentage}% selesai`,
      tag: `goal-${goalName}`,
    });
  }
}

export default PushNotificationService;
