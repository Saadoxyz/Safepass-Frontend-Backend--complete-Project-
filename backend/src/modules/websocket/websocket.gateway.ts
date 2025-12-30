import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VisitorDocument } from '../visitors/schemas/visitor.schema';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyNewVisitorRequest(hostId: string): void {
    this.server.emit('new-visitor-request', { hostId });
  }

  notifyVisitorStatusUpdate(visitor: VisitorDocument): void {
    this.server.emit('visitor-status-update', visitor);
  }

  notifyVisitorApproved(visitor: VisitorDocument): void {
    this.server.emit('visitor-approved', visitor);
  }

  notifyVisitorRejected(visitor: VisitorDocument): void {
    this.server.emit('visitor-rejected', visitor);
  }

  notifyVisitorCheckIn(visitor: VisitorDocument): void {
    this.server.emit('visitor-check-in', visitor);
  }

  notifyVisitorCheckOut(visitor: VisitorDocument): void {
    this.server.emit('visitor-check-out', visitor);
  }

  notifyVisitorFlagged(visitor: VisitorDocument): void {
    this.server.emit('visitor-flagged', visitor);
  }

  notifySuspiciousReport(visitor: VisitorDocument): void {
    this.server.emit('suspicious-report', visitor);
  }
}
