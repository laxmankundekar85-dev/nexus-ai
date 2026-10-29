/**
 * Nexus AI Enterprise Notification Service
 * Manages native Web & Android System Notifications for completed tasks, approvals, and reports.
 */

export interface NexusNotificationOptions {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  private permissionState: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionState = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      this.permissionState = result;
      return result === 'granted';
    } catch {
      return false;
    }
  }

  public async sendNotification(options: NexusNotificationOptions): Promise<boolean> {
    const {
      title,
      body,
      tag = 'nexus-task-alert',
      url = '/reports',
      icon = '/icon-192.png',
      badge = '/favicon.svg',
      data = {},
    } = options;

    // Check if running inside the Native Android APK Bridge
    const winWithBridge = typeof window !== 'undefined' ? (window as unknown as { NexusNativeBridge?: { showNotification: (t: string, m: string) => void } }) : null;
    if (winWithBridge?.NexusNativeBridge?.showNotification) {
      try {
        winWithBridge.NexusNativeBridge.showNotification(title, body);
        return true;
      } catch {
        // Fallback to standard web notification
      }
    }

    if (!this.isSupported()) return false;

    // If permission is still default, prompt for it
    if (Notification.permission === 'default') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    if (Notification.permission !== 'granted') return false;

    // Trigger haptic vibration on Android devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Ignored
      }
    }

    // Prefer Service Worker registration (native Android Notification Shade)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          const swOptions = {
            body,
            icon,
            badge,
            tag,
            data: { url, ...data },
            vibrate: [200, 100, 200],
          };
          await registration.showNotification(title, swOptions as unknown as globalThis.NotificationOptions);
          return true;
        }
      } catch {
        // Fallback to desktop Notification API
      }
    }

    // Direct Notification fallback
    try {
      const n = new Notification(title, {
        body,
        icon,
        badge,
        tag,
        data: { url, ...data },
      });
      n.onclick = () => {
        window.focus();
        if (url) window.location.href = url;
      };
      return true;
    } catch {
      return false;
    }
  }

  public async notifyMissionCompleted(missionName: string, reportUrl: string = '/reports'): Promise<boolean> {
    return this.sendNotification({
      title: '🎯 Mission Completed — Nexus AI',
      body: `Objective "${missionName}" has finished. Grounded intelligence report is ready to review.`,
      tag: 'mission-complete',
      url: reportUrl,
    });
  }

  public async notifyTaskCompleted(taskTitle: string, agentRole: string = 'Agent'): Promise<boolean> {
    return this.sendNotification({
      title: `⚡ Task Completed: ${agentRole}`,
      body: `${taskTitle} — Verification & evidence lineage recorded.`,
      tag: `task-${Date.now()}`,
      url: '/workspace',
    });
  }

  public async notifyApprovalRequired(taskTitle: string, reason?: string): Promise<boolean> {
    return this.sendNotification({
      title: '⚠️ Operator Approval Required',
      body: `${taskTitle}: ${reason || 'Elevated action requires operator confirmation before proceeding.'}`,
      tag: 'approval-required',
      url: '/workspace',
    });
  }

  public async notifyMissionFailed(missionName: string, error?: string): Promise<boolean> {
    return this.sendNotification({
      title: '❌ Mission Attention Needed',
      body: `Task in "${missionName}" paused: ${error || 'Review checkpoint for recovery options.'}`,
      tag: 'mission-failure',
      url: '/execution-recovery',
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
