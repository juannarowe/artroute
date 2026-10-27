import { ForbiddenException } from '@nestjs/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { Event } from '../events/schema/events.schema';
import type { UserRole } from '../users/schemas/user.schema';
import { IMPORT_USER, ImportsService } from './imports.service';
import { fetchUpcomingOpenings, GrafEvent } from './graf-api';
import { fetchEventPage } from './event-page';
import { extractEventDetails } from './gemini';
import { geocodeAddress } from './geocode';

// Replace the internet calls with fakes: no GRAF, no Gemini, no OpenStreetMap
// Keep the real parseBarcelonaTime, fake only the GRAF download
jest.mock('./graf-api', () => ({
  ...jest.requireActual<typeof import('./graf-api')>('./graf-api'),
  fetchUpcomingOpenings: jest.fn(),
}));
jest.mock('./gemini');
jest.mock('./geocode');
// Keep the real decodeHtml, fake only the page download
jest.mock('./event-page', () => ({
  ...jest.requireActual<typeof import('./event-page')>('./event-page'),
  fetchEventPage: jest.fn(),
}));

const feature = loadFeature('./artbarcelona-import.feature', {
  loadRelativePath: true,
});

// A fake GRAF opening number "n"
function createOpening(n: number): GrafEvent {
  return {
    link: `https://graf.cat/events/event/opening-${n}/`,
    title: { rendered: `Opening ${n}` },
    acf: { _event_free: true },
    abe_event_venue: `Gallery ${n}`,
    abe_event_category: 'Inauguració',
    start: '2030-11-05T19:00:00+01:00',
  };
}

function givenOpenings(count: number) {
  const openings: GrafEvent[] = [];
  for (let n = 1; n <= count; n++) {
    openings.push(createOpening(n));
  }
  jest.mocked(fetchUpcomingOpenings).mockResolvedValue(openings);
}

// The AI and the map work for every opening
function givenEverythingWorks() {
  jest.mocked(fetchEventPage).mockResolvedValue({ text: 'Lloc: ...' });
  jest.mocked(extractEventDetails).mockResolvedValue({
    description: 'A photography show.',
    category: 'photography',
    address: 'Carrer de Trafalgar, 70, 08010 Barcelona',
    price: 0,
  });
  jest.mocked(geocodeAddress).mockResolvedValue({ lat: 41.39, lng: 2.17 });
}

// A fake Mongoose model: findOne(...).exec() says if the event already exists
function createFakeModel(alreadyImported: boolean) {
  return {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(alreadyImported ? { _id: '1' } : null),
    }),
    create: jest.fn().mockResolvedValue(undefined),
  };
}

type FakeModel = ReturnType<typeof createFakeModel>;

function runImport(fakeModel: FakeModel, role: UserRole) {
  const service = new ImportsService(fakeModel as unknown as Model<Event>);
  return service.importFromArtBarcelona({ uid: `user-${role}`, role });
}

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetAllMocks();
    givenEverythingWorks();
  });

  test('An admin imports new openings as pending events', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeModel: FakeModel;
    let result: { imported: number; skipped: number };

    given(/^the agenda has (\d+) new openings$/, (count: string) => {
      givenOpenings(Number(count));
      fakeModel = createFakeModel(false);
    });
    and('the AI can read every opening', () => {
      givenEverythingWorks();
    });
    when(
      /^a user with role "(.*)" runs the import$/,
      async (role: UserRole) => {
        result = await runImport(fakeModel, role);
      },
    );
    then(
      /^the result is (\d+) imported and (\d+) skipped$/,
      (imported: string, skipped: string) => {
        expect(result).toEqual({
          imported: Number(imported),
          skipped: Number(skipped),
        });
      },
    );
    and(
      /^every saved event is "(.*)" and created by "(.*)"$/,
      (status: string, createdBy: string) => {
        expect(createdBy).toBe(IMPORT_USER);
        expect(fakeModel.create).toHaveBeenCalledTimes(2);
        for (const callNumber of [1, 2]) {
          expect(fakeModel.create).toHaveBeenNthCalledWith(
            callNumber,
            expect.objectContaining({ status, createdBy }),
          );
        }
      },
    );
  });

  test('Openings that were already imported are skipped', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeModel: FakeModel;
    let result: { imported: number; skipped: number };

    given(
      /^the agenda has (\d+) openings that are already in the database$/,
      (count: string) => {
        givenOpenings(Number(count));
        fakeModel = createFakeModel(true);
      },
    );
    when(
      /^a user with role "(.*)" runs the import$/,
      async (role: UserRole) => {
        result = await runImport(fakeModel, role);
      },
    );
    then(
      /^the result is (\d+) imported and (\d+) skipped$/,
      (imported: string, skipped: string) => {
        expect(result).toEqual({
          imported: Number(imported),
          skipped: Number(skipped),
        });
      },
    );
    and('no event is saved', () => {
      expect(fakeModel.create).not.toHaveBeenCalled();
    });
  });

  test('Openings without AI details or coordinates are skipped', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeModel: FakeModel;
    let result: { imported: number; skipped: number };

    given(/^the agenda has (\d+) new openings$/, (count: string) => {
      givenOpenings(Number(count));
      fakeModel = createFakeModel(false);
    });
    and('the AI cannot read the first opening', () => {
      // First call: Gemini fails. Second call: the normal details.
      jest.mocked(extractEventDetails).mockResolvedValueOnce(null);
    });
    and('the address of the second opening is not found on the map', () => {
      // Only the second opening reaches the map step
      jest.mocked(geocodeAddress).mockResolvedValueOnce(null);
    });
    when(
      /^a user with role "(.*)" runs the import$/,
      async (role: UserRole) => {
        result = await runImport(fakeModel, role);
      },
    );
    then(
      /^the result is (\d+) imported and (\d+) skipped$/,
      (imported: string, skipped: string) => {
        expect(result).toEqual({
          imported: Number(imported),
          skipped: Number(skipped),
        });
      },
    );
    and('no event is saved', () => {
      expect(fakeModel.create).not.toHaveBeenCalled();
    });
  });

  test('One run imports at most 10 openings', ({ given, when, then, and }) => {
    let fakeModel: FakeModel;
    let result: { imported: number; skipped: number };

    given(/^the agenda has (\d+) new openings$/, (count: string) => {
      givenOpenings(Number(count));
      fakeModel = createFakeModel(false);
    });
    and('the AI can read every opening', () => {
      givenEverythingWorks();
    });
    when(
      /^a user with role "(.*)" runs the import$/,
      async (role: UserRole) => {
        result = await runImport(fakeModel, role);
      },
    );
    then(
      /^the result is (\d+) imported and (\d+) skipped$/,
      (imported: string, skipped: string) => {
        expect(result).toEqual({
          imported: Number(imported),
          skipped: Number(skipped),
        });
      },
    );
  });

  test('A normal user cannot import', ({ given, when, then, and }) => {
    let fakeModel: FakeModel;
    let importPromise: Promise<unknown>;

    given(/^the agenda has (\d+) new openings$/, (count: string) => {
      givenOpenings(Number(count));
      fakeModel = createFakeModel(false);
    });
    when(/^a user with role "(.*)" runs the import$/, (role: UserRole) => {
      importPromise = runImport(fakeModel, role);
    });
    then('the import is forbidden', async () => {
      await expect(importPromise).rejects.toThrow(ForbiddenException);
    });
    and('no event is saved', () => {
      expect(fakeModel.create).not.toHaveBeenCalled();
    });
  });

  test('The opening time is read as Barcelona time', ({
    given,
    when,
    then,
    and,
  }) => {
    let fakeModel: FakeModel;

    given(/^the agenda has an opening at "(.*)"$/, (start: string) => {
      const opening = { ...createOpening(1), start };
      jest.mocked(fetchUpcomingOpenings).mockResolvedValue([opening]);
      fakeModel = createFakeModel(false);
    });
    and('the AI can read every opening', () => {
      givenEverythingWorks();
    });
    when(
      /^a user with role "(.*)" runs the import$/,
      async (role: UserRole) => {
        await runImport(fakeModel, role);
      },
    );
    then(/^the event is saved at "(.*)"$/, (expectedDate: string) => {
      expect(fakeModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ date: new Date(expectedDate) }),
      );
    });
  });
});
