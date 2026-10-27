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
import { UsersService } from '../users/users.service';
import type { UserRole } from '../users/schemas/user.schema';

export interface AuthUser {
  uid: string;
  email?: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    if (getApps().length === 0) {
      initializeApp({
        projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
      });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing auth token');
    }
    const token = header.slice('Bearer '.length);

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const user = await this.usersService.findOrCreate(
        decodedToken.uid,
        decodedToken.email,
        decodedToken.name as string | undefined,
      );
      request.user = {
        uid: user.firebaseUid,
        email: user.email,
        role: user.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired auth token');
    }
  }
}
