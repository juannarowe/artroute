import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreate(uid: string, email?: string, name?: string) {
    const existingUser = await this.userModel
      .findOne({ firebaseUid: uid })
      .exec();
    if (existingUser) {
      return existingUser;
    }
    return this.userModel.create({ firebaseUid: uid, email, name });
  }

  async updateName(uid: string, name: string) {
    const user = await this.findOrCreate(uid);
    user.name = name;
    return user.save();
  }
}
