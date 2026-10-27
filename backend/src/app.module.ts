import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { ImportsModule } from './imports/imports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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

    EventsModule,

    UsersModule,

    ImportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
