import { Controller, Get } from '@nestjs/common';
import { fetchUpcomingOpenings } from './graf-api';

@Controller('imports')
export class ImportsController {
  @Get('preview') // TEMPORARY: GET /imports/preview
  preview() {
    return fetchUpcomingOpenings();
  }
}
