import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // First request of a new user creates them in MongoDB (role "user").
  // The role is NEVER taken from the request: only the database decides it.
  async findOrCreate(uid: string, email?: string, name?: string) {
    const existingUser = await this.userModel
      .findOne({ firebaseUid: uid })
      .exec();
    if (existingUser) {
      return existingUser;
    }
    return this.userModel.create({ firebaseUid: uid, email, name });
  }

  // Change the name of the logged-in user (the same pattern as events: find, change, save)
  async updateName(uid: string, name: string) {
    const user = await this.findOrCreate(uid);
    user.name = name;
    return user.save();
  }
}
