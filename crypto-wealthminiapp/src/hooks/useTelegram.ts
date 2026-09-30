import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#05050b');
      tg.setBackgroundColor('#05050b');
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Optional: enable closing confirmation
      // tg.enableClosingConfirmation();
    } else {
      // Dev mode outside Telegram
      setIsReady(true);
      setUser({ first_name: 'Dev', username: 'developer', id: 1 });
    }
  }, []);

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    try {
      if (webApp?.HapticFeedback) {
        if (type === 'success' || type === 'error') {
          webApp.HapticFeedback.notificationOccurred(type);
        } else {
          webApp.HapticFeedback.impactOccurred(type);
        }
      }
    } catch {}
  };

  const showAlert = (message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, (ok: boolean) => resolve(ok));
      } else {
        resolve(confirm(message));
      }
    });
  };

  return { webApp, user, isReady, haptic, showAlert, showConfirm };
}
