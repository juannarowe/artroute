import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  // Finds the event and checks that the caller is its owner.
  // TODO: admins can also change any event (card #50)
  private async findOwnedEvent(id: string, uid: string) {
    const event = await this.findOne(id); // already throws 404 if not found
    if (event.createdBy !== uid) {
      throw new ForbiddenException('You can only change your own events');
    }
    return event;
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

  async update(id: string, updateEventDto: UpdateEventDto, uid: string) {
    const event = await this.findOwnedEvent(id, uid);
    event.set(updateEventDto); // copy the new values onto the event
    return event.save(); // save() runs the schema validators
  }

  async remove(id: string, uid: string) {
    const event = await this.findOwnedEvent(id, uid);
    await event.deleteOne();
  }
}
