import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { AuthRequest } from '../auth/firebase-auth.guard';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me') // GET /users/me
  @UseGuards(FirebaseAuthGuard)
  getMe(@Req() request: AuthRequest) {
    return this.userService.findOrCreate(request.user.uid);
  }
}
