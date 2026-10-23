import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export type Notifications = {
  email: boolean;
  prayer: boolean;
  events: boolean;
  messages: boolean;
};

const DEFAULTS: Notifications = {
  email: true,
  prayer: true,
  events: true,
  messages: true,
};

interface NotificationContextType {
  notifications: Notifications;
  setNotification: (key: keyof Notifications, value: boolean) => void;
  saving: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();

  // Per-user storage key so preferences don't leak between accounts
  const storageKey = user?.id ? `gaumsa-notifications:${user.id}` : 'gaumsa-notifications:guest';

  const [notifications, setNotifications] = useState<Notifications>(() => {
    // Prefer DB value if the user object already has it
    if (user?.notifications) {
      return { ...DEFAULTS, ...user.notifications };
    }
    // Fall back to localStorage
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return { ...DEFAULTS, ...JSON.parse(stored) };
      } catch {}
    }
    return DEFAULTS;
  });

  const [saving, setSaving] = useState(false);

  // Reload preferences whenever the logged-in user changes
  useEffect(() => {
    if (user?.notifications) {
      setNotifications({ ...DEFAULTS, ...user.notifications });
      return;
    }
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setNotifications({ ...DEFAULTS, ...JSON.parse(stored) });
        return;
      } catch {}
    }
    setNotifications(DEFAULTS);
  }, [storageKey, user?.notifications]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  const setNotification = async (key: keyof Notifications, value: boolean) => {
    const next = { ...notifications, [key]: value };

    // Optimistic update
    setNotifications(next);

    // Sync to backend
    if (token) {
      setSaving(true);
      try {
        await api.updateNotifications(token, next);
      } catch (err) {
        console.error('Failed to sync notifications:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotification, saving }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
};