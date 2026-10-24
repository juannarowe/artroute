import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Event, EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import type { AuthUser } from '../auth/firebase-auth.guard';

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
  private async findOwnedEvent(id: string, user: AuthUser) {
    const event = await this.findOne(id); // already throws 404 if not found
    // Owners can change their events; admins can change any event
    if (event.createdBy !== user.uid && user.role !== 'admin') {
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

  async update(id: string, updateEventDto: UpdateEventDto, user: AuthUser) {
    const event = await this.findOwnedEvent(id, user);
    event.set(updateEventDto); // copy the new values onto the event
    return event.save(); // save() runs the schema validators
  }

  async remove(id: string, user: AuthUser) {
    const event = await this.findOwnedEvent(id, user);
    await event.deleteOne();
  }

  async toggleGo(id: string, uid: string) {
    const event = await this.findOne(id);

    if (event.status !== 'published') {
      throw new BadRequestException('You can only go to published events');
    }

    const isGoing = event.attendees.includes(uid);

    if (isGoing) {
      event.attendees = event.attendees.filter((attendee) => attendee !== uid);
    } else {
      event.attendees = [...event.attendees, uid];
    }

    return event.save();
  }
}
