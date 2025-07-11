import React, { useEffect, useState } from 'react';
import { Bell, X, MessageCircle } from 'lucide-react';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface ChatNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ChatNotification({ position = 'top-right' }: ChatNotificationProps) {
  const { notifications, unreadCount, markAsRead, clearNotifications } = useChatNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      const notification = notifications[0];
      setCurrentNotification(notification);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentNotification(null);
          markAsRead(notification.id);
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, currentNotification, markAsRead]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (currentNotification) {
        markAsRead(currentNotification.id);
        setCurrentNotification(null);
      }
    }, 300);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!currentNotification || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground">
              {currentNotification.titulo}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {currentNotification.corpo}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(currentNotification.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatNotificationBadge() {
  const { unreadCount } = useChatNotifications();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
} 