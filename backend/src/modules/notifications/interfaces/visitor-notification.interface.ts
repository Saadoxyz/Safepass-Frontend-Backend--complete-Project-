// src/modules/notifications/interfaces/visitor-notification.interface.ts
export interface VisitorNotification {
  id: string;
  name: string;
  status: string;
  hostName?: string;
  visitDate: Date;
}
