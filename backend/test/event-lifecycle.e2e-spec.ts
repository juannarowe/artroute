import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConnectOptions, Model } from 'mongoose';
import * as os from 'os';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { EventsModule } from '../src/events/events.module';
import { User } from '../src/users/schemas/user.schema';
import { UsersModule } from '../src/users/users.module';

jest.mock('firebase-admin/app', () => ({
  getApps: () => [{}],
  initializeApp: jest.fn(),
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: (token: string) =>
      Promise.resolve({ uid: token, email: `${token}@test.dev` }),
  }),
}));

const feature = loadFeature('./event-lifecycle.feature', {
  loadRelativePath: true,
});

const newEvent = {
  title: 'Light & Shadow',
  venue: 'Galeria Test',
  address: 'Carrer de Trafalgar, 70, 08010 Barcelona',
  lat: 41.39,
  lng: 2.17,
  date: '2030-11-05T18:00:00.000Z',
  category: 'photography',
  description: 'A night of black and white photography.',
  price: 0,
};

interface SavedEvent {
  _id: string;
  status: string;
  createdBy: string;
  attendees: string[];
}

defineFeature(feature, (test) => {
  let mongo: MongoMemoryServer;
  let app: INestApplication<App>;
  let response: Response;
  let eventId: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: '7.0.14' },
    });
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ FIREBASE_PROJECT_ID: 'test-project' })],
        }),
        MongooseModule.forRoot(mongo.getUri(), {
          runtimeAdapters: { os },
        }),
        EventsModule,
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  }, 60000);

  afterEach(async () => {
    const collections = await app
      .get<Model<User>>(getModelToken(User.name))
      .db.db!.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  function api() {
    return request(app.getHttpServer());
  }

  async function createEvent(uid: string) {
    response = await api()
      .post('/events')
      .set('Authorization', `Bearer ${uid}`)
      .send(newEvent);
    eventId = (response.body as SavedEvent)._id;
  }

  async function makeAdmin(uid: string) {
    await api().get('/users/me').set('Authorization', `Bearer ${uid}`);
    await app
      .get<Model<User>>(getModelToken(User.name))
      .updateOne({ firebaseUid: uid }, { role: 'admin' });
  }

  async function publishedEvents() {
    const list = await api().get('/events?status=published');
    return list.body as SavedEvent[];
  }

  test('A visitor cannot create an event', ({ when, then }) => {
    when('a visitor without a token creates an event', async () => {
      response = await api().post('/events').send(newEvent);
    });
    then(/^the API answers (\d+)$/, (status: string) => {
      expect(response.status).toBe(Number(status));
    });
  });

  test('The server decides the status, not the user', ({ when, then }) => {
    when(
      /^"(.*)" creates an event that says it is already "(.*)"$/,
      async (uid: string, status: string) => {
        response = await api()
          .post('/events')
          .set('Authorization', `Bearer ${uid}`)
          .send({ ...newEvent, status });
      },
    );
    then(/^the API answers (\d+)$/, (status: string) => {
      expect(response.status).toBe(Number(status));
    });
  });

  test('A new event waits for an admin before it is public', ({
    when,
    then,
    and,
  }) => {
    when(/^"(.*)" creates an event$/, async (uid: string) => {
      await createEvent(uid);
    });
    then(/^the API answers (\d+)$/, (status: string) => {
      expect(response.status).toBe(Number(status));
    });
    and(
      /^the event is "(.*)" and created by "(.*)"$/,
      async (status: string, uid: string) => {
        const saved = await api().get(`/events/${eventId}`);
        expect(saved.body).toMatchObject({ status, createdBy: uid });
      },
    );
    and('the public list of published events is empty', async () => {
      expect(await publishedEvents()).toHaveLength(0);
    });
  });

  test('An admin publishes the event and users can go', ({
    given,
    and,
    when,
    then,
  }) => {
    given(/^"(.*)" created an event$/, async (uid: string) => {
      await createEvent(uid);
    });
    and(/^"(.*)" is an admin$/, async (uid: string) => {
      await makeAdmin(uid);
    });
    when(/^"(.*)" publishes the event$/, async (uid: string) => {
      response = await api()
        .patch(`/events/${eventId}/status`)
        .set('Authorization', `Bearer ${uid}`)
        .send({ status: 'published' });
      expect(response.status).toBe(200);
    });
    then(
      /^the public list of published events has (\d+) event$/,
      async (count: string) => {
        expect(await publishedEvents()).toHaveLength(Number(count));
      },
    );
    when(/^"(.*)" marks Go on the event$/, async (uid: string) => {
      response = await api()
        .post(`/events/${eventId}/go`)
        .set('Authorization', `Bearer ${uid}`);
    });
    then(/^the event has (\d+) attendee$/, async (count: string) => {
      const saved = await api().get(`/events/${eventId}`);
      expect((saved.body as SavedEvent).attendees).toHaveLength(Number(count));
    });
  });

  test('Only the owner or an admin can delete an event', ({
    given,
    when,
    then,
  }) => {
    given(/^"(.*)" created an event$/, async (uid: string) => {
      await createEvent(uid);
    });
    when(/^"(.*)" deletes the event$/, async (uid: string) => {
      response = await api()
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${uid}`);
    });
    then(/^the API answers (\d+)$/, (status: string) => {
      expect(response.status).toBe(Number(status));
    });
    when(/^"(.*)" deletes the event$/, async (uid: string) => {
      response = await api()
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${uid}`);
    });
    then(/^the API answers (\d+)$/, (status: string) => {
      expect(response.status).toBe(Number(status));
    });
  });
});
