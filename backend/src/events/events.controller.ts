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
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import type { EventStatus } from './schema/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import type { AuthRequest } from '../auth/firebase-auth.guard';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll(
    @Query('status') status?: EventStatus,
    @Query('owner') owner?: string,
  ) {
    return this.eventsService.findAll(status, owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createEventDto: CreateEventDto, @Req() request: AuthRequest) {
    return this.eventsService.create(createEventDto, request.user.uid);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: AuthRequest,
  ) {
    return this.eventsService.update(id, updateEventDto, request.user);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.eventsService.remove(id, request.user);
  }

  @Post(':id/go')
  @UseGuards(FirebaseAuthGuard)
  toggleGo(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.eventsService.toggleGo(id, request.user.uid);
  }

  @Patch(':id/status')
  @UseGuards(FirebaseAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() request: AuthRequest,
  ) {
    return this.eventsService.updateStatus(id, updateStatusDto, request.user);
  }
}
