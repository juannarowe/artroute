import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  findAll(status?: EventStatus, createdBy?: string) {
    const filter: { status?: EventStatus; createdBy?: string } = {};
    if (status) {
      filter.status = status;
    }
    if (createdBy) {
      filter.createdBy = createdBy;
    }
    return this.eventModel.find(filter).sort({ date: 1 }).exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  create(createEventDto: CreateEventDto) {
    return this.eventModel.create({
      ...createEventDto,
      // TODO: take the uid from the auth token (card #49)
      createdBy: 'dev-user',
    });
  }
}
