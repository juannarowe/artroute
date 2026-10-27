import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['published', 'rejected'])
  @IsString()
  status: 'published' | 'rejected';

  @IsOptional()
  @IsString()
  rejectionNote?: string;
}
