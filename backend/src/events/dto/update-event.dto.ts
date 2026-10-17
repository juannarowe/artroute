import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

// Same fields and rules as CreateEventDto, but all optional
export class UpdateEventDto extends PartialType(CreateEventDto) {}
