import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Reads backend/.env and makes the values available in the whole app
    ConfigModule.forRoot({ isGlobal: true }),

    // "Async" because it has to wait for ConfigModule to read MONGODB_URI
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // getOrThrow: the app stops with a clear error if the variable is missing
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        onConnectionCreate: (connection: Connection) => {
          const logger = new Logger('MongoDB');
          connection.on('connected', () => logger.log('MongoDB connected'));
          connection.on('disconnected', () =>
            logger.warn('MongoDB disconnected'),
          );
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
