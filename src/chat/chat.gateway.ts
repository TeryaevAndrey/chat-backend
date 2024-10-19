import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { sendMessagePayload } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  private users = new Map<string, number>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);

    if (!isNaN(userId)) {
      this.users.set(client.id, userId);

      console.log(`User ${userId} connected with socket ID: ${client.id}`);
    } else {
      console.error('Invalid userId');
      client.disconnect();
    }
  }

  handleDisconnected(client: Socket) {
    console.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('send-private-message')
  handleSendMessage(
    client: Socket,
    payload: { recipientId: number; message: string },
  ) {
    const senderId = this.users.get(client.id);

    console.log(
      `Message from ${senderId} to ${payload.recipientId}: ${payload.message}`,
    );

    const recipientSocketId = [...this.users.entries()].find(
      ([_, id]) => id === payload.recipientId,
    )?.[0];

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('send-private-message', {
        senderId,
        message: payload.message,
      });
    } else {
      console.warn(`Recipient ${payload.recipientId} not connected`);
    }
  }
}
