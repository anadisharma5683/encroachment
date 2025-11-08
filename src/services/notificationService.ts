// src/services/notificationService.ts
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  recipients: string[];
  data: Record<string, any>;
  createdAt: Date;
  read: boolean;
  status: 'active' | 'inactive';
}

export interface Alert {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'low' | 'medium' | 'high';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  assignedTo: string | null;
}

// In-memory storage for notifications and alerts
let notifications: Notification[] = [];
let alerts: Alert[] = [];

class NotificationService {
  // Create a new notification
  createNotification(
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    recipients: string[] = [],
    data: Record<string, any> = {}
  ): string {
    const id = uuidv4();
    const notification: Notification = {
      id,
      title,
      message,
      priority,
      recipients,
      data,
      createdAt: new Date(),
      read: false,
      status: 'active'
    };
    
    notifications.push(notification);
    return id;
  }
  
  // Create a new alert
  createAlert(
    type: string,
    location: { lat: number; lng: number },
    severity: 'low' | 'medium' | 'high',
    description: string,
    metadata: Record<string, any> = {}
  ): string {
    const id = uuidv4();
    const alert: Alert = {
      id,
      type,
      location,
      severity,
      description,
      metadata,
      createdAt: new Date(),
      status: 'new',
      assignedTo: null
    };
    
    alerts.push(alert);
    return id;
  }
  
  // Get notifications for a user
  getUserNotifications(userId: string, limit: number = 50): Notification[] {
    const userNotifications = notifications.filter(notification => 
      notification.recipients.includes(userId) || 
      notification.recipients.length === 0 // Broadcast notifications
    );
    
    return userNotifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  // Get alerts within a bounding box
  getAlertsByLocation(
    north: number,
    south: number,
    east: number,
    west: number
  ): Alert[] {
    return alerts.filter(alert => 
      alert.location.lat >= south && 
      alert.location.lat <= north &&
      alert.location.lng >= west && 
      alert.location.lng <= east &&
      alert.status !== 'resolved'
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Mark notification as read
  markNotificationRead(notificationId: string, userId?: string): boolean {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      if (!userId || notification.recipients.includes(userId)) {
        notification.read = true;
        return true;
      }
    }
    return false;
  }
  
  // Acknowledge an alert
  acknowledgeAlert(alertId: string, userId?: string): boolean {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      if (!userId || !alert.assignedTo || alert.assignedTo === userId) {
        alert.status = 'acknowledged';
        alert.assignedTo = userId || null;
        return true;
      }
    }
    return false;
  }
  
  // Resolve an alert
  resolveAlert(alertId: string, resolutionNotes: string = ''): boolean {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      if (resolutionNotes) {
        alert.metadata.resolutionNotes = resolutionNotes;
      }
      return true;
    }
    return false;
  }
  
  // Get all notifications (for admin)
  getAllNotifications(): Notification[] {
    return [...notifications];
  }
  
  // Get all alerts (for admin)
  getAllAlerts(): Alert[] {
    return [...alerts];
  }
  
  // Clear old notifications (older than 30 days)
  clearOldNotifications(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const initialLength = notifications.length;
    notifications = notifications.filter(
      n => n.createdAt > thirtyDaysAgo
    );
    
    return initialLength - notifications.length;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();