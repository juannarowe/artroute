import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/schema/events.schema';
import { UsersModule } from '../users/users.module';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [ImportsService],
  controllers: [ImportsController],
})
export class ImportsModule {}
