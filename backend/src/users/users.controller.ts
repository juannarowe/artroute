import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { AuthRequest } from '../auth/firebase-auth.guard';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me') // GET /users/me
  @UseGuards(FirebaseAuthGuard)
  getMe(@Req() request: AuthRequest) {
    return this.userService.findOrCreate(request.user.uid);
  }

  @Patch('me') // PATCH /users/me — the user can only change their OWN profile
  @UseGuards(FirebaseAuthGuard)
  updateMe(@Body() updateMeDto: UpdateMeDto, @Req() request: AuthRequest) {
    return this.userService.updateName(request.user.uid, updateMeDto.name);
  }
}
