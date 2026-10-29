import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission();
    setPermission(notificationService.getPermission());
    if (granted) {
      toast.success('System notifications enabled! You will be alerted when tasks complete.');
      notificationService.sendNotification({
        title: '🔔 Nexus AI Notifications Enabled',
        body: 'You will receive native alerts when autonomous missions and tasks conclude.',
        url: '/workspace',
      });
    } else {
      toast.error('Notification permission was not granted.');
    }
    return granted;
  }, []);

  return {
    isSupported,
    permission,
    isGranted: permission === 'granted',
    requestPermission,
    sendNotification: notificationService.sendNotification.bind(notificationService),
    notifyMissionCompleted: notificationService.notifyMissionCompleted.bind(notificationService),
    notifyTaskCompleted: notificationService.notifyTaskCompleted.bind(notificationService),
    notifyApprovalRequired: notificationService.notifyApprovalRequired.bind(notificationService),
    notifyMissionFailed: notificationService.notifyMissionFailed.bind(notificationService),
  };
}

export default useNotifications;
