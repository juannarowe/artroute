import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UpdateMeDto } from './dto/update-me.dto';

const feature = loadFeature('./profile.feature', { loadRelativePath: true });

interface FakeUser {
  firebaseUid: string;
  name: string;
  save: jest.Mock;
}

function createService(fakeUser: FakeUser) {
  const fakeModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser),
    }),
  } as unknown as Model<User>;
  return new UsersService(fakeModel);
}

async function countErrors(body: object) {
  const dto = plainToInstance(UpdateMeDto, body);
  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return errors.length;
}

defineFeature(feature, (test) => {
  test('A user changes their name', ({ given, when, then, and }) => {
    let fakeUser: FakeUser;

    given(/^a user called "(.*)"$/, (name: string) => {
      fakeUser = { firebaseUid: 'user-ana', name, save: jest.fn() };
    });

    when(/^they change their name to "(.*)"$/, async (newName: string) => {
      await createService(fakeUser).updateName('user-ana', newName);
    });

    then(/^their name is "(.*)"$/, (name: string) => {
      expect(fakeUser.name).toBe(name);
    });

    and('the user is saved', () => {
      expect(fakeUser.save).toHaveBeenCalled();
    });
  });

  test('The name cannot be too short', ({ when, then }) => {
    let errorCount: number;

    when(/^a user sends the name "(.*)"$/, async (name: string) => {
      errorCount = await countErrors({ name });
    });

    then('the request body is invalid', () => {
      expect(errorCount).toBeGreaterThan(0);
    });
  });

  test('The role cannot be sent', ({ when, then }) => {
    let errorCount: number;

    when(
      /^a user sends the name "(.*)" and the role "(.*)"$/,
      async (name: string, role: string) => {
        errorCount = await countErrors({ name, role });
      },
    );

    then('the role is not accepted', () => {
      expect(errorCount).toBeGreaterThan(0);
    });
  });
});
