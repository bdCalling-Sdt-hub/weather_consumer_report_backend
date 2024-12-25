import { MessageService } from '../modules/message/message.service';

const handleMessageEvents = (socket: any, io: any) => {
  socket.on('send-message', async (messageData: any) => {
    try {
      const message = await MessageService.addMessage(messageData);
      io.to(messageData.room).emit('new-message', message);
    } catch (error) {
      socket.emit('message-error', {
        error: 'Failed to send message',
        originalMessage: messageData,
      });
    }
  });

};

export default handleMessageEvents;
