import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket, WsEventPayload, DEFAULT_COMPANY_ID } from './websocket.types';
import { WsEventType } from './websocket.events';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Client ${client.id} connection rejected: no token`);
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production';
      const payload = this.jwtService.verify(token, { secret });

      // Get companyId from token or use default (mono-tenant mode)
      const companyId = payload.companyId || DEFAULT_COMPANY_ID;

      // Attach user info to socket
      (client as AuthenticatedSocket).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        companyId,
      };

      // Join user-specific room for targeted messages
      client.join(`user:${payload.sub}`);

      // Join company room for multi-tenant isolation
      client.join(`company:${companyId}`);

      this.logger.log(`Client ${client.id} connected (user: ${payload.email}, company: ${companyId})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Client ${client.id} connection rejected: invalid token - ${message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Broadcast an event to all connected, authenticated clients
   */
  broadcast(event: WsEventType, data: WsEventPayload): void {
    this.server.emit(event, data);
    this.logger.debug(`Broadcast event: ${event}`);
  }

  /**
   * Send an event to a specific user
   */
  sendToUser(userId: string, event: WsEventType, data: WsEventPayload): void {
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.debug(`Sent event ${event} to user ${userId}`);
  }

  /**
   * Broadcast an event to all clients in a specific company room (multi-tenant)
   */
  broadcastToCompany(companyId: string, event: WsEventType, data: WsEventPayload): void {
    this.server.to(`company:${companyId}`).emit(event, data);
    this.logger.debug(`Broadcast event ${event} to company ${companyId}`);
  }

  /**
   * Get count of connected clients
   */
  getConnectedClientsCount(): number {
    return this.server?.sockets?.sockets?.size ?? 0;
  }
}
