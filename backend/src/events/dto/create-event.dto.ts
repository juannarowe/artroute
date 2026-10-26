import {
  IsNumber,
  Max,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

// Only the fields the USER may send. status, createdBy and attendees
// are set by the server, so they are not here (and get rejected).

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(2)
  venue: string;

  @IsString()
  @MinLength(2)
  address: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsDateString() // "1990-05-21" or a full ISO date; Mongoose turns it into a Date
  date: string;

  @IsString()
  @MinLength(2)
  category: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional() // may be missing; if present, it must be a URL
  @IsUrl()
  externalLink?: string;
}
