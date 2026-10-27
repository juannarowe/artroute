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

  @IsDateString()
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

  @IsOptional()
  @IsUrl()
  externalLink?: string;
}
