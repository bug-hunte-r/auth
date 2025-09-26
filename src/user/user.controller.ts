import { Controller, Get, Post, Body, Param, HttpCode, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './signup-dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/model/User';
import { Model } from 'mongoose';
import { generateToken } from 'src/config/auth-helper';
import type { Response } from 'express';
import { LoginDto } from './login-dto/login-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, @InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  @Post('signup')
  @HttpCode(201)
  async Signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {

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
