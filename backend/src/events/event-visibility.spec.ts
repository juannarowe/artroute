import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { EventsService } from './events.service';
import { Event, EventStatus } from './schema/events.schema';
import type { UserRole } from '../users/schemas/user.schema';

const feature = loadFeature('./event-visibility.feature', {
  loadRelativePath: true,
});

const EVENT_ID = '6702f1c4a9b3e5d7f8a1b2c3';

function createFakeModel(fakeEvent?: {
  status: EventStatus;
  createdBy: string;
}) {
  const find = jest.fn().mockReturnValue({
    sort: () => ({ exec: jest.fn().mockResolvedValue([]) }),
  });
  const findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(fakeEvent),
  });
  return { find, findById };
}

function createService(fakeModel: ReturnType<typeof createFakeModel>) {
  return new EventsService(fakeModel as unknown as Model<Event>);
}

defineFeature(feature, (test) => {
  test('A visitor only gets published events', ({ when, then }) => {
    const fakeModel = createFakeModel();

    when('a visitor lists the events', async () => {
      await createService(fakeModel).findAll();
    });

    then(
      /^the database is searched with the status "(.*)"$/,
      (status: string) => {
        expect(fakeModel.find).toHaveBeenCalledWith({ status });
      },
    );
  });

  test('A visitor cannot list pending events', ({ when, then }) => {
    let findPromise: Promise<unknown>;

    when(
      /^a visitor lists the events with the status "(.*)"$/,
      (status: EventStatus) => {
        findPromise = createService(createFakeModel()).findAll(status);
      },
    );

    then('the request is rejected as forbidden', async () => {
      await expect(findPromise).rejects.toThrow(ForbiddenException);
    });
  });

  test('A user lists all their own events', ({ when, then }) => {
    const fakeModel = createFakeModel();

    when(
      /^"(.*)" with role "(.*)" lists the events of "(.*)"$/,
      async (uid: string, role: UserRole, owner: string) => {
        await createService(fakeModel).findAll(undefined, owner, { uid, role });
      },
    );

    then('the database is searched without a status filter', () => {
      expect(fakeModel.find).toHaveBeenCalledWith({ createdBy: 'user-ana' });
    });
  });

  test('A user only gets the published events of another user', ({
    when,
    then,
  }) => {
    const fakeModel = createFakeModel();

    when(
      /^"(.*)" with role "(.*)" lists the events of "(.*)"$/,
      async (uid: string, role: UserRole, owner: string) => {
        await createService(fakeModel).findAll(undefined, owner, { uid, role });
      },
    );

    then(
      /^the database is searched with the status "(.*)"$/,
      (status: string) => {
        expect(fakeModel.find).toHaveBeenCalledWith({
          status,
          createdBy: 'user-ana',
        });
      },
    );
  });

  test('An admin lists the pending events', ({ when, then }) => {
    const fakeModel = createFakeModel();

    when(
      /^"(.*)" with role "(.*)" lists the events with the status "(.*)"$/,
      async (uid: string, role: UserRole, status: EventStatus) => {
        await createService(fakeModel).findAll(status, undefined, {
          uid,
          role,
        });
      },
    );

    then(
      /^the database is searched with the status "(.*)"$/,
      (status: string) => {
        expect(fakeModel.find).toHaveBeenCalledWith({ status });
      },
    );
  });

  test('A visitor cannot open a pending event', ({ given, when, then }) => {
    let service: EventsService;
    let findPromise: Promise<unknown>;

    given(
      /^a "(.*)" event created by "(.*)"$/,
      (status: EventStatus, owner: string) => {
        service = createService(createFakeModel({ status, createdBy: owner }));
      },
    );

    when('a visitor opens the event', () => {
      findPromise = service.findOne(EVENT_ID);
    });

    then('the request is rejected as not found', async () => {
      await expect(findPromise).rejects.toThrow(NotFoundException);
    });
  });

  test('The owner opens their pending event', ({ given, when, then }) => {
    let service: EventsService;
    let result: unknown;

    given(
      /^a "(.*)" event created by "(.*)"$/,
      (status: EventStatus, owner: string) => {
        service = createService(createFakeModel({ status, createdBy: owner }));
      },
    );

    when(
      /^"(.*)" with role "(.*)" opens the event$/,
      async (uid: string, role: UserRole) => {
        result = await service.findOne(EVENT_ID, { uid, role });
      },
    );

    then('the event is returned', () => {
      expect(result).toEqual({ status: 'pending', createdBy: 'user-ana' });
    });
  });

  test('An admin opens a rejected event', ({ given, when, then }) => {
    let service: EventsService;
    let result: unknown;

    given(
      /^a "(.*)" event created by "(.*)"$/,
      (status: EventStatus, owner: string) => {
        service = createService(createFakeModel({ status, createdBy: owner }));
      },
    );

    when(
      /^"(.*)" with role "(.*)" opens the event$/,
      async (uid: string, role: UserRole) => {
        result = await service.findOne(EVENT_ID, { uid, role });
      },
    );

    then('the event is returned', () => {
      expect(result).toEqual({ status: 'rejected', createdBy: 'user-ana' });
    });
  });
});
