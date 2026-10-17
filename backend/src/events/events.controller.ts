import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import type { EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';

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
}
