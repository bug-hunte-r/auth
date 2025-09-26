import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './signup-dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/User';
import { InjectModel } from '@nestjs/mongoose';
import { hashdPassHandler, verifyPassHandler } from 'src/config/auth-helper';
import { LoginDto } from './login-dto/login-dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async Signup(createUserDto: CreateUserDto) {

        const isUserExist = await this.UserModel.findOne({ username: createUserDto.username })
        
        if (isUserExist) {
            throw new ConflictException('This username is already exist')
        }
        
        const hahsedPass = await hashdPassHandler(createUserDto.password)

        const allUsers = await this.UserModel.find({})

        const newUser = new this.UserModel({ ...createUserDto, password: hahsedPass, role: allUsers.length > 0 ? 'USER' : 'ADMIN' })

        newUser.save()

        return { message: 'User Signuped successfully' }
    }

    async Login(loginDto: LoginDto) {

        const isUserLogin = await this.UserModel.findOne({ username: loginDto.username })

        if (!isUserLogin) {
            throw new NotFoundException('Acount not found')
        }

        const verifyPass = await verifyPassHandler(loginDto.password, isUserLogin.password)

        if (!verifyPass) {
            throw new BadRequestException('Username or password is invalid')
        }

        return { message: 'User logined successfully' }
    }
}
