import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import type { AuthUser } from './firebase-auth.guard';

export interface OptionalAuthRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class OptionalAuthGuard extends FirebaseAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OptionalAuthRequest>();

    if (!request.headers.authorization) {
      return true;
    }
    return super.canActivate(context);
  }
}
