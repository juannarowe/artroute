import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// What the guard adds to every request it lets through
export interface AuthUser {
  uid: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(configService: ConfigService) {
    // Start firebase-admin only once, even if the guard is created many times.
    // Verifying tokens only needs the project id (no secret keys).
    if (getApps().length === 0) {
      initializeApp({
        projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
      });
    }
  }

  // Runs BEFORE the controller. Returning true lets the request through.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const header = request.headers.authorization;

    // Expected format: "Bearer <token>"
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing auth token');
    }
    const token = header.slice('Bearer '.length);

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      request.user = { uid: decodedToken.uid, email: decodedToken.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired auth token');
    }
  }
}
