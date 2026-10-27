import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import type { AuthRequest } from '../auth/firebase-auth.guard';

@Controller('imports')
export class ImportsController {
  constructor(private importsService: ImportsService) {}

  @Post('artbarcelona') // POST /imports/artbarcelona
  @UseGuards(FirebaseAuthGuard) // logged in; the service checks the admin role
  importFromArtBarcelona(@Req() request: AuthRequest) {
    return this.importsService.importFromArtBarcelona(request.user);
  }
}
