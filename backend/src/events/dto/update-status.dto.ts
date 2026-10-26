import { IsIn, IsOptional, IsString } from 'class-validator';

// What an admin sends to approve or reject an event
export class UpdateStatusDto {
  @IsIn(['published', 'rejected'])
  @IsString()
  status: 'published' | 'rejected';

  @IsOptional()
  @IsString()
  rejectionNote?: string;
}
