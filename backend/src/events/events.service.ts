import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  // Invalid ids can't exist in the database, so treat them as "not found"
  private checkValidId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }

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
    this.checkValidId(id);
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  create(createEventDto: CreateEventDto, uid: string) {
    return this.eventModel.create({
      ...createEventDto,
      createdBy: uid,
    });
  }

  // TODO: only the owner or an admin (card #49)
  async update(id: string, updateEventDto: UpdateEventDto) {
    this.checkValidId(id);
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, {
        returnDocument: 'after', // return the event AFTER the change
        runValidators: true, // apply schema rules (min, enum...) on updates too
      })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return updatedEvent;
  }
  // TODO: only the owner or an admin (card #49)
  async remove(id: string) {
    this.checkValidId(id);
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }
}
