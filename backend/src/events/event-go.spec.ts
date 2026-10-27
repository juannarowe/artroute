import { BadRequestException } from '@nestjs/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { EventsService } from './events.service';
import { Event, EventStatus } from './schema/events.schema';

const feature = loadFeature('./event-go.feature', { loadRelativePath: true });

const EVENT_ID = '6702f1c4a9b3e5d7f8a1b2c3';

function createFakeEvent(status: EventStatus, attendees: string[]) {
  return {
    status,
    attendees,
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function createService(fakeEvent: ReturnType<typeof createFakeEvent>) {
  const fakeModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeEvent),
    }),
  } as unknown as Model<Event>;
  return new EventsService(fakeModel);
}

defineFeature(feature, (test) => {
  test('A user marks "Go" on a published event', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;

    given('a published event without attendees', () => {
      fakeEvent = createFakeEvent('published', []);
    });

    when(/^"(.*)" clicks Go$/, async (uid: string) => {
      await createService(fakeEvent).toggleGo(EVENT_ID, uid);
    });

    then(/^"(.*)" is in the attendees$/, (uid: string) => {
      expect(fakeEvent.attendees).toContain(uid);
    });

    and('the event is saved', () => {
      expect(fakeEvent.save).toHaveBeenCalled();
    });
  });

  test('A user clicks Go again to cancel', ({ given, when, then, and }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;

    given(/^a published event where "(.*)" is going$/, (uid: string) => {
      fakeEvent = createFakeEvent('published', [uid, 'user-bob']);
    });

    when(/^"(.*)" clicks Go$/, async (uid: string) => {
      await createService(fakeEvent).toggleGo(EVENT_ID, uid);
    });

    then(/^"(.*)" is not in the attendees$/, (uid: string) => {
      expect(fakeEvent.attendees).not.toContain(uid);
      expect(fakeEvent.attendees).toContain('user-bob');
    });

    and('the event is saved', () => {
      expect(fakeEvent.save).toHaveBeenCalled();
    });
  });

  test('Nobody can go to an event that is not published yet', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeEvent: ReturnType<typeof createFakeEvent>;
    let goPromise: Promise<unknown>;

    given('a pending event without attendees', () => {
      fakeEvent = createFakeEvent('pending', []);
    });

    when(/^"(.*)" clicks Go$/, (uid: string) => {
      goPromise = createService(fakeEvent).toggleGo(EVENT_ID, uid);
    });

    then('the request is rejected as a bad request', async () => {
      await expect(goPromise).rejects.toThrow(BadRequestException);
    });

    and('the event is not saved', () => {
      expect(fakeEvent.save).not.toHaveBeenCalled();
    });
  });
});
