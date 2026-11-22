/**
 * Browser Notification Helper
 * Sends desktop/browser notifications to enrolled students when professor starts live class
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Request user permission for browser notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return false;
    }
  }

  return false;
}

/**
 * Check if browser notifications are supported and permitted
 */
export function canSendNotifications(): boolean {
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

/**
 * Send a browser notification
 */
export function sendNotification(options: NotificationOptions): Notification | null {
  if (!canSendNotifications()) {
    return null;
  }

  try {
    return new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/assets/aistudio/favicon-definitivo_67bfc7c9.png',
      badge: options.badge || '/assets/aistudio/favicon-definitivo_67bfc7c9.png',
      tag: options.tag || 'pca-notification',
      requireInteraction: options.requireInteraction ?? true,
    });
  } catch (err) {
    console.warn('Error sending notification:', err);
    return null;
  }
}

/**
 * Send live class notification to student
 */
export function notifyLiveClassStarted(courseTitle: string, teacherName: string): Notification | null {
  return sendNotification({
    title: '¡Clase en Vivo!',
    body: `${teacherName} está transmitiendo en vivo: ${courseTitle}`,
    icon: '/assets/aistudio/favicon-definitivo_67bfc7c9.png',
    tag: `live-class-${courseTitle}`,
    requireInteraction: true,
  });
}

/**
 * Request notification permission with fallback
 */
export async function ensureNotificationPermission(): Promise<void> {
  try {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      await requestNotificationPermission();
    }
  } catch (err) {
    console.warn('Notification permission error:', err);
  }
}
