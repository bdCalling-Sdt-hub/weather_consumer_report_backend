import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { socketHelper } from './app/socket/socket';
import assignTechnicianBasedOnAdminMaxPrice from './app/modules/job/job-cron.service';
import { myPort } from './data/environmentVariables';

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected:', error);
  process.exit(1);
});

let server: any;

async function main() {
  try {
    // Connect to the database
    await mongoose.connect(config.mongoose.url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    // Determine the port
    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    // Run any scheduled jobs or initializations
    assignTechnicianBasedOnAdminMaxPrice();

    // Start the server
    server = app.listen(myPort, () => {
      logger.info(
        colors.yellow(
          `♻️  Application is running at http://170.64.139.81:${myPort}/`
        )
      );
    });

    // Initialize Socket.io
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    // Set up socket helper
    socketHelper.socket(io);

    // Make the socket instance globally accessible
    // @ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect to the database'));
  }

  // Handle unhandled promise rejections
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('Unhandled Rejection Detected:', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully...');
  if (server) {
    server.close();
  }
});
