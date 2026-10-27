import { ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { EventsService } from './events.service';
import { Event, EventStatus } from './schema/events.schema';
import { UpdateStatusDto } from './dto/update-status.dto';
import type { UserRole } from '../users/schemas/user.schema';

const feature = loadFeature('./event-approval.feature', {
  loadRelativePath: true,
});

const EVENT_ID = '6702f1c4a9b3e5d7f8a1b2c3';

interface FakeEvent {
  status: EventStatus;
  rejectionNote?: string;
  save: jest.Mock;
}

function createFakeEvent(): FakeEvent {
  return {
    status: 'pending',
    rejectionNote: 'old note',
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function createService(fakeEvent: FakeEvent) {
  const fakeModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeEvent),
    }),
  } as unknown as Model<Event>;
  return new EventsService(fakeModel);
}

function createUser(role: UserRole) {
  return { uid: `user-${role}`, role };
}

defineFeature(feature, (test) => {
  test('An admin publishes a pending event', ({ given, when, then, and }) => {
    let fakeEvent: FakeEvent;

    given('a pending event', () => {
      fakeEvent = createFakeEvent();
    });

    when(
      /^a user with role "(.*)" sets the status to "(.*)"$/,
      async (role: UserRole, status: 'published' | 'rejected') => {
        await createService(fakeEvent).updateStatus(
          EVENT_ID,
          { status },
          createUser(role),
        );
      },
    );

    then(/^the event status is "(.*)"$/, (status: string) => {
      expect(fakeEvent.status).toBe(status);
    });

    and('the event has no rejection note', () => {
      expect(fakeEvent.rejectionNote).toBeUndefined();
    });

    and('the event is saved', () => {
      expect(fakeEvent.save).toHaveBeenCalled();
    });
  });

  test('An admin rejects a pending event with a note', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeEvent: FakeEvent;

    given('a pending event', () => {
      fakeEvent = createFakeEvent();
    });

    when(
      /^a user with role "(.*)" rejects it with the note "(.*)"$/,
      async (role: UserRole, note: string) => {
        await createService(fakeEvent).updateStatus(
          EVENT_ID,
          { status: 'rejected', rejectionNote: note },
          createUser(role),
        );
      },
    );

    then(/^the event status is "(.*)"$/, (status: string) => {
      expect(fakeEvent.status).toBe(status);
    });

    and(/^the rejection note is "(.*)"$/, (note: string) => {
      expect(fakeEvent.rejectionNote).toBe(note);
    });

    and('the event is saved', () => {
      expect(fakeEvent.save).toHaveBeenCalled();
    });
  });

  test('A normal user cannot change the status', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeEvent: FakeEvent;
    let statusPromise: Promise<unknown>;

    given('a pending event', () => {
      fakeEvent = createFakeEvent();
    });

    when(
      /^a user with role "(.*)" sets the status to "(.*)"$/,
      (role: UserRole, status: 'published' | 'rejected') => {
        statusPromise = createService(fakeEvent).updateStatus(
          EVENT_ID,
          { status },
          createUser(role),
        );
      },
    );

    then('the request is rejected as forbidden', async () => {
      await expect(statusPromise).rejects.toThrow(ForbiddenException);
    });

    and('the event is not saved', () => {
      expect(fakeEvent.save).not.toHaveBeenCalled();
    });
  });

  test('"pending" is not an allowed status to send', ({ when, then }) => {
    let errorCount: number;

    when(/^an admin sends the status "(.*)"$/, async (status: string) => {
      const body = plainToInstance(UpdateStatusDto, { status });
      const errors = await validate(body);
      errorCount = errors.length;
    });

    then('the request body is invalid', () => {
      expect(errorCount).toBeGreaterThan(0);
    });
  });
});
