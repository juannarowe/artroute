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
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  private checkValidId(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }

  private canSeeEvent(event: Event, user?: AuthUser) {
    if (event.status === 'published') {
      return true;
    }
    if (!user) {
      return false;
    }
    return user.role === 'admin' || event.createdBy === user.uid;
  }

  async findAll(status?: EventStatus, createdBy?: string, user?: AuthUser) {
    const filter: { status?: EventStatus; createdBy?: string } = {};
    if (status) {
      filter.status = status;
    }
    if (createdBy) {
      filter.createdBy = createdBy;
    }

    const isAdmin = user?.role === 'admin';
    const isMyOwnList = user !== undefined && createdBy === user.uid;

    if (!isAdmin && !isMyOwnList) {
      if (status && status !== 'published') {
        throw new ForbiddenException('Only published events are public');
      }
      filter.status = 'published';
    }

    return this.eventModel.find(filter).sort({ date: 1 }).exec();
  }

  private async findOwnedEvent(id: string, user: AuthUser) {
    const event = await this.findEvent(id);
    if (event.createdBy !== user.uid && user.role !== 'admin') {
      throw new ForbiddenException('You can only change your own events');
    }
    return event;
  }

  private async findEvent(id: string) {
    this.checkValidId(id);
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  async findOne(id: string, user?: AuthUser) {
    const event = await this.findEvent(id);
    if (!this.canSeeEvent(event, user)) {
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
    event.set(updateEventDto);
    return event.save();
  }

  async remove(id: string, user: AuthUser) {
    const event = await this.findOwnedEvent(id, user);
    await event.deleteOne();
  }

  async toggleGo(id: string, uid: string) {
    const event = await this.findEvent(id);

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

  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
    user: AuthUser,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can change the status');
    }

    const event = await this.findEvent(id);
    event.status = updateStatusDto.status;
    event.rejectionNote =
      updateStatusDto.status === 'rejected'
        ? updateStatusDto.rejectionNote
        : undefined;

    return event.save();
  }
}
