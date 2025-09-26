import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/User';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async Signup(createUserDto: CreateUserDto) {

        const allUsers = await this.UserModel.find({})

        const newUser = new this.UserModel({ ...createUserDto, role: allUsers.length > 0 ? 'USER' : 'ADMIN' })

        newUser.save()

        return { message: 'User Signuped successfully' }
    }
}
