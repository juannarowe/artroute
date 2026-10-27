import { IsString, MaxLength, MinLength } from 'class-validator';

// What a user can change in their own profile: only the name.
// email comes from Firebase and role is decided by an admin, so they are not here.
export class UpdateMeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
