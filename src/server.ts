import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { socketHelper } from './app/socket/socket';
import assignTechnicianBasedOnAdminMaxPrice from './app/modules/job/job-cron.service';

//uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

let server: any;
async function main() {
  try {
    mongoose.connect(config.mongoose.url as string);
    logger.info(colors.green('🚀 Database connected successfully'));
    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    assignTechnicianBasedOnAdminMaxPrice();
    server = app.listen(port, config.backendIp as string, () => {
      logger.info(
        colors.yellow(
          `♻️  Application listening on port http://${config.backendIp}:${port}/test`
        )
      );
    });
    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socketHelper.socket(io);
    // @ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle unhandledRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandledRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

//SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
