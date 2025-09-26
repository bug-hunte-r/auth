import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/User';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async Signup(createUserDto: CreateUserDto) {

        const newUser = new this.UserModel(createUserDto)

        newUser.save()

        return { message: 'User Signuped successfully' }
    }
}
