import { Controller, Get, Post, Body, Param, HttpCode, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/model/User';
import { Model } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

}
