import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { getAuth } from 'firebase-admin/auth';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import type { AuthRequest } from './firebase-auth.guard';
import { UsersService } from '../users/users.service';

// Replace firebase-admin with fakes: the tests never talk to Google.
jest.mock('firebase-admin/app', () => ({
  getApps: () => [{}], // pretend Firebase is already started
  initializeApp: jest.fn(),
}));
const verifyIdToken = jest.fn();
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
}));
(getAuth as jest.Mock).mockReturnValue({ verifyIdToken });

const feature = loadFeature('./auth-guard.feature', { loadRelativePath: true });

// A fake request with only the header the guard reads
function createRequest(authorization?: string) {
  return { headers: { authorization } } as unknown as AuthRequest;
}

// NestJS gives guards an ExecutionContext; we build a minimal fake one
function createContext(request: AuthRequest) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

// Fake UsersService: returns a user from our "database"
const findOrCreate = jest.fn();
const fakeUsersService = { findOrCreate } as unknown as UsersService;
const fakeConfigService = {
  getOrThrow: () => 'test-project',
} as unknown as ConfigService;

function createGuard() {
  return new FirebaseAuthGuard(fakeConfigService, fakeUsersService);
}

defineFeature(feature, (test) => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    findOrCreate.mockReset();
  });

  test('A request without a token is rejected', ({ given, when, then }) => {
    let request: AuthRequest;
    let checkPromise: Promise<boolean>;

    given('a request without an Authorization header', () => {
      request = createRequest(undefined);
    });

    when('the guard checks the request', () => {
      checkPromise = createGuard().canActivate(createContext(request));
    });

    then('the request is rejected as unauthorized', async () => {
      await expect(checkPromise).rejects.toThrow(UnauthorizedException);
    });
  });

  test('A request with an invalid token is rejected', ({
    given,
    and,
    when,
    then,
  }) => {
    let request: AuthRequest;
    let checkPromise: Promise<boolean>;

    given(/^a request with the token "(.*)"$/, (token: string) => {
      request = createRequest(`Bearer ${token}`);
    });

    and('Firebase says the token is invalid', () => {
      verifyIdToken.mockRejectedValue(new Error('invalid token'));
    });

    when('the guard checks the request', () => {
      checkPromise = createGuard().canActivate(createContext(request));
    });

    then('the request is rejected as unauthorized', async () => {
      await expect(checkPromise).rejects.toThrow(UnauthorizedException);
    });
  });

  test('A request with a valid token is allowed', ({
    given,
    and,
    when,
    then,
  }) => {
    let request: AuthRequest;
    let isAllowed: boolean;

    given(/^a request with the token "(.*)"$/, (token: string) => {
      request = createRequest(`Bearer ${token}`);
    });

    and(/^Firebase says the token belongs to "(.*)"$/, (uid: string) => {
      verifyIdToken.mockResolvedValue({ uid, email: `${uid}@test.dev` });
    });

    and(
      /^"(.*)" has the role "(.*)" in the database$/,
      (uid: string, role: string) => {
        findOrCreate.mockResolvedValue({
          firebaseUid: uid,
          email: `${uid}@test.dev`,
          role,
        });
      },
    );

    when('the guard checks the request', async () => {
      isAllowed = await createGuard().canActivate(createContext(request));
    });

    then('the request is allowed', () => {
      expect(isAllowed).toBe(true);
    });

    and(
      /^the request knows the user is "(.*)" with role "(.*)"$/,
      (uid: string, role: string) => {
        expect(request.user.uid).toBe(uid);
        expect(request.user.role).toBe(role);
      },
    );
  });
});
