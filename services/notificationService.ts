
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendPushNotification = (title: string, body: string, icon?: string) => {
  if (document.visibilityState === 'hidden' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
    });
    return true;
  }
  return false;
};

export const isAppBackgrounded = () => document.visibilityState === 'hidden';
