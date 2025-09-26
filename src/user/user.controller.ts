import { Controller, Get, Post, Body, Param, HttpCode, ConflictException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/model/User';
import { Model } from 'mongoose';
import { generateToken } from 'src/config/auth-helper';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, @InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  @Post('signup')
  @HttpCode(201)
  async Signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {

    const isUserExist = await this.UserModel.findOne({ username: createUserDto.username })

    if (isUserExist) {
      throw new ConflictException('This username is already exist')
    }

    const token = generateToken({ username: createUserDto.username })

    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 48
    })

    const newUser = await this.userService.Signup(createUserDto)

    res.status(201).json({
      newUser
    })
    
  }
}
