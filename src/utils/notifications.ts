import { ReminderItem } from '../types';
import { soundManager } from './sound';

class NotificationSystem {
  private hasPermission: boolean = false;
  private intervalId: number | null = null;
  private listeners: ((message: { title: string; body: string; id: string }) => void)[] = [];
  private triggeredReminders: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        this.hasPermission = perm === 'granted';
        return this.hasPermission;
      } catch {
        return false;
      }
    }
    return false;
  }

  getPermissionStatus(): string {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }

  onNotification(cb: (msg: { title: string; body: string; id: string }) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  send(title: string, body: string, sound: boolean = true) {
    // Play sound if requested
    if (sound) {
      soundManager.playTimerBell();
    }

    // Trigger in-app listeners
    const notificationId = Date.now().toString();
    this.listeners.forEach(cb => cb({ title, body, id: notificationId }));

    // Trigger browser notification if supported and granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {
        // notification error
      }
    }
  }

  startReminderWatcher(getReminders: () => ReminderItem[]) {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      const now = new Date();
      const currentDay = now.getDay();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      const reminders = getReminders();
      reminders.forEach(rem => {
        if (!rem.active) return;
        if (!rem.days.includes(currentDay)) return;

        const reminderKey = `${rem.id}_${currentTimeStr}_${now.toDateString()}`;
        if (rem.time === currentTimeStr && !this.triggeredReminders.has(reminderKey)) {
          this.triggeredReminders.add(reminderKey);
          this.send(`⏰ Lakshya Reminder: ${rem.title}`, `Vivek, it is ${currentTimeStr}! Time to execute your planned target.`, rem.soundEnabled);
        }
      });
    }, 30000); // check every 30 seconds
  }

  stopReminderWatcher() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const notificationSystem = new NotificationSystem();
