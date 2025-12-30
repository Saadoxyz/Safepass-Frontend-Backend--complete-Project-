// src/modules/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import type { VisitorNotification } from './interfaces/visitor-notification.interface';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(client.id, userId);
      console.log(`Client connected: ${client.id}, User: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  // Notify admin about new visitor
  notifyNewVisitor(visitor: VisitorNotification): void {
    this.server.emit('new-visitor', {
      type: 'new-visitor',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify host about visitor approval request
  notifyHostApproval(hostId: string, visitor: VisitorNotification): void {
    this.server.to(hostId).emit('approval-request', {
      type: 'approval-request',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about visitor status change
  notifyStatusChange(visitor: VisitorNotification): void {
    this.server.emit('visitor-status-change', {
      type: 'status-change',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about flagged visitor
  notifyVisitorFlagged(visitor: VisitorNotification): void {
    this.server.emit('visitor-flagged', {
      type: 'visitor-flagged',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about suspicious report
  notifySuspiciousReport(visitor: VisitorNotification): void {
    this.server.emit('suspicious-report', {
      type: 'suspicious-report',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about visitor check-in
  notifyVisitorCheckIn(visitor: VisitorNotification): void {
    this.server.emit('visitor-checked-in', {
      type: 'visitor-checked-in',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about visitor check-out
  notifyVisitorCheckOut(visitor: VisitorNotification): void {
    this.server.emit('visitor-checked-out', {
      type: 'visitor-checked-out',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about approved visitor
  notifyVisitorApproved(visitor: VisitorNotification): void {
    this.server.emit('visitor-approved', {
      type: 'visitor-approved',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about rejected visitor
  notifyVisitorRejected(visitor: VisitorNotification): void {
    this.server.emit('visitor-rejected', {
      type: 'visitor-rejected',
      data: visitor,
      timestamp: new Date(),
    });
  }

  // Notify about new visitor request
  notifyNewVisitorRequest(hostId: string): void {
    this.server.emit('new-visitor-request', {
      type: 'new-visitor-request',
      timestamp: new Date(),
    });
  }
}
