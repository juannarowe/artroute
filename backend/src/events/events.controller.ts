import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import type { EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get() // GET /events
  findAll(
    @Query('status') status?: EventStatus,
    @Query('owner') owner?: string,
  ) {
    return this.eventsService.findAll(status, owner);
  }

  @Get(':id') // GET /events/123
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id') // PATCH /events/123
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id') // DELETE /events/123
  @HttpCode(204) // success, nothing to send back
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
