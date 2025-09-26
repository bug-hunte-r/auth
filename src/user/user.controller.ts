import { Controller, Get, Post, Body, Param, HttpCode, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/model/User';
import { Model } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, @InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  @Post('signup')
  @HttpCode(201)
  async Signup(@Body() createUserDto: CreateUserDto) {

    const isUserExist = await this.UserModel.findOne({ username: createUserDto.username })
    
    if (isUserExist) {
      throw new ConflictException('This username is already exist')
    }
    
    const newUser = await this.userService.Signup(createUserDto)

    return newUser
  }
}
