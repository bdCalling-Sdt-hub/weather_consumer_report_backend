import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../../shared/logger';
import handleMessageEvents from './message.event';
import mongoose from 'mongoose';
import { User } from '../modules/user/user.model';

// Define types for the event data
interface ConnectedUserData {
  userId: string;
}

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

const socket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(colors.blue('🔌🟢 A user connected'));

    socket.on('connectedUser', async (data: ConnectedUserData) => {
      try {
        const { userId } = data;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error(`Invalid user ID: ${userId}`);
        }
        socket.join(userId);
        socket.broadcast.to(userId).emit('user/inactivate', true);

        // Store userId in socket object
        socket.userId = userId;

        // Update user online status
        await User.updateOne({ _id: userId }, { $set: { online: true } });

        socket.broadcast.emit('connectedUser', userId);
      } catch (error) {
        console.log(error);
      }
    });

    const handleDisconnect = async () => {
      try {
        const { userId } = socket;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          // Update user online status
          await User.updateOne({ _id: userId }, { $set: { online: false } });

          socket.broadcast.emit('user/disconnect', userId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    socket.on('disconnect', handleDisconnect);
  });
};

export const socketHelper = { socket };
