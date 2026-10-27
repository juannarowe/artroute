import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import type { AuthRequest } from '../auth/firebase-auth.guard';

@Controller('imports')
export class ImportsController {
  constructor(private importsService: ImportsService) {}

  @Post('artbarcelona')
  @UseGuards(FirebaseAuthGuard)
  importFromArtBarcelona(@Req() request: AuthRequest) {
    return this.importsService.importFromArtBarcelona(request.user);
  }
}
