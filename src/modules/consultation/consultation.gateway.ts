import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { ConsultationService } from './consultation.service';

type JwtPayload = {
  sub: string;
  role: Role;
};

@WebSocketGateway({
  namespace: '/consultations',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ConsultationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly consultationService: ConsultationService) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super-secret-key-for-dev',
      ) as JwtPayload;
      client.data.user = {
        sub: payload.sub,
        role: payload.role,
      };
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('consultation:join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { appointmentId?: string },
  ) {
    const user = this.getClientUser(client);
    const appointmentId = body?.appointmentId;
    if (!appointmentId) {
      throw new WsException('appointmentId is required');
    }

    const joined = await this.consultationService.joinSession(user.sub, user.role, appointmentId);
    const room = this.roomName(appointmentId);
    await client.join(room);

    client.emit('consultation:joined', {
      room,
      ...joined,
    });

    return {
      room,
      ...joined,
    };
  }

  @SubscribeMessage('consultation:message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { appointmentId?: string; content?: string },
  ) {
    const user = this.getClientUser(client);
    const appointmentId = body?.appointmentId;
    const content = body?.content?.trim();
    if (!appointmentId) {
      throw new WsException('appointmentId is required');
    }
    if (!content) {
      throw new WsException('content is required');
    }

    const message = await this.consultationService.sendSessionMessage(user.sub, user.role, appointmentId, {
      content,
    });

    const room = this.roomName(appointmentId);
    this.server.to(room).emit('consultation:message', message);

    return message;
  }

  private roomName(appointmentId: string) {
    return `consultation:${appointmentId}`;
  }

  private extractToken(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    return null;
  }

  private getClientUser(client: Socket): { sub: string; role: Role } {
    const user = client.data.user as { sub: string; role: Role } | undefined;
    if (!user?.sub || !user?.role) {
      throw new WsException('Unauthorized socket session');
    }

    return user;
  }
}
