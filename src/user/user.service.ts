import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './signup-dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/User';
import { InjectModel } from '@nestjs/mongoose';
import { hashdPassHandler, verifyPassHandler, verifyTokenHandler } from 'src/config/auth-helper';
import { LoginDto } from './login-dto/login-dto';
import { Request } from 'express';

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

    async getMe(req: Request) {

            const token = req.cookies?.['token']            

            if (!token) {
                throw new UnauthorizedException('Token not found')
            }

            const verifiedToken = await verifyTokenHandler(token)

            if (!verifiedToken) {
                throw new UnauthorizedException('Token not valid')
            }

            const mainUser = await this.UserModel.findOne({ username: verifiedToken.username }).select('-password')

            return mainUser
    }

    async getAllUsers(req: Request){

        const isUserOrAdmin = await this.getMe(req)

        if (isUserOrAdmin?.role === 'ADMIN') {
            const allUser = await this.UserModel.find({})
            return allUser
        } else {
            throw new BadRequestException('You do not have access to this route.')
        }
        
    }
}
