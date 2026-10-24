import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { EventsService } from './events.service';
import { Event } from './schema/events.schema';
import type { UserRole } from '../users/schemas/user.schema';

const feature = loadFeature('./event-permissions.feature', {
  loadRelativePath: true,
});

// A valid MongoDB ObjectId (24 hex characters) for the fake event
const EVENT_ID = '6702f1c4a9b3e5d7f8a1b2c3';

// A fake event document: only the fields and methods the service uses.
// jest.fn() records every call, so we can check what the service did.
function createFakeEvent(createdBy: string) {
  return {
    createdBy,
    set: jest.fn(),
    save: jest.fn().mockResolvedValue({ createdBy, price: 5 }),
    deleteOne: jest.fn().mockResolvedValue(undefined),
  };
}

// A fake Mongoose model: findById(id).exec() returns our fake event.
// No real database is used, so the test is fast and always the same.
function createFakeModel(fakeEvent: ReturnType<typeof createFakeEvent>) {
  return {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeEvent),
    }),
  } as unknown as Model<Event>;
}

defineFeature(feature, (test) => {
  test('The owner updates their own event', ({ given, when, then }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;
    let service: EventsService;
    let result: unknown;

    given(/^an event created by "(.*)"$/, (owner: string) => {
      fakeEvent = createFakeEvent(owner);
      service = new EventsService(createFakeModel(fakeEvent));
    });

    when(
      /^"(.*)" with role "(.*)" updates the price to (\d+)$/,
      async (uid: string, role: UserRole, price: string) => {
        result = await service.update(
          EVENT_ID,
          { price: Number(price) },
          { uid, role },
        );
      },
    );

    then(/^the event is saved with price (\d+)$/, (price: string) => {
      expect(fakeEvent.set).toHaveBeenCalledWith({ price: Number(price) });
      expect(fakeEvent.save).toHaveBeenCalled();
      expect(result).toEqual({ createdBy: 'user-ana', price: Number(price) });
    });
  });

  test('Another user cannot update the event', ({ given, when, then, and }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;
    let service: EventsService;
    let updatePromise: Promise<unknown>;

    given(/^an event created by "(.*)"$/, (owner: string) => {
      fakeEvent = createFakeEvent(owner);
      service = new EventsService(createFakeModel(fakeEvent));
    });

    when(
      /^"(.*)" with role "(.*)" updates the price to (\d+)$/,
      (uid: string, role: UserRole, price: string) => {
        updatePromise = service.update(
          EVENT_ID,
          { price: Number(price) },
          { uid, role },
        );
      },
    );

    then('the request is rejected as forbidden', async () => {
      await expect(updatePromise).rejects.toThrow(ForbiddenException);
    });

    and('the event is not saved', () => {
      expect(fakeEvent.save).not.toHaveBeenCalled();
    });
  });

  test('An admin can update any event', ({ given, when, then }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;
    let service: EventsService;

    given(/^an event created by "(.*)"$/, (owner: string) => {
      fakeEvent = createFakeEvent(owner);
      service = new EventsService(createFakeModel(fakeEvent));
    });

    when(
      /^"(.*)" with role "(.*)" updates the price to (\d+)$/,
      async (uid: string, role: UserRole, price: string) => {
        await service.update(EVENT_ID, { price: Number(price) }, { uid, role });
      },
    );

    then(/^the event is saved with price (\d+)$/, (price: string) => {
      expect(fakeEvent.set).toHaveBeenCalledWith({ price: Number(price) });
      expect(fakeEvent.save).toHaveBeenCalled();
    });
  });

  test('Another user cannot delete the event', ({ given, when, then, and }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;
    let service: EventsService;
    let removePromise: Promise<unknown>;

    given(/^an event created by "(.*)"$/, (owner: string) => {
      fakeEvent = createFakeEvent(owner);
      service = new EventsService(createFakeModel(fakeEvent));
    });

    when(
      /^"(.*)" with role "(.*)" deletes the event$/,
      (uid: string, role: UserRole) => {
        removePromise = service.remove(EVENT_ID, { uid, role });
      },
    );

    then('the request is rejected as forbidden', async () => {
      await expect(removePromise).rejects.toThrow(ForbiddenException);
    });

    and('the event is not deleted', () => {
      expect(fakeEvent.deleteOne).not.toHaveBeenCalled();
    });
  });

  test('An invalid event id is treated as not found', ({ when, then }) => {
    let findPromise: Promise<unknown>;

    when(/^someone asks for the event with id "(.*)"$/, (id: string) => {
      const service = new EventsService(
        createFakeModel(createFakeEvent('user-ana')),
      );
      findPromise = service.findOne(id);
    });

    then('the request is rejected as not found', async () => {
      await expect(findPromise).rejects.toThrow(NotFoundException);
    });
  });
});
