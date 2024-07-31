import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { User } from '../schema/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async findOneByUserId(userId: string): Promise<User | undefined> {
    if (!userId) {
      throw new BadRequestException('User ID must be provided');
}
    const user = await this.userModel.findById(userId).exec();
    return user;
  }

  async checkAndAddUser(auth0_user_id: string, emailFromHeaders: string): Promise<string> {
    if(!auth0_user_id)
    throw new BadRequestException('Auth0 user ID not provided');

    if (!emailFromHeaders) {
        throw new BadRequestException('user email not provided');
    }

    const existingUserByAuth0Id = await this.findOneByUserAuth0Id(auth0_user_id);
    if (existingUserByAuth0Id) {
        return `User with id ${auth0_user_id} already exists.`;
    }

    const existingUserByEmail = await this.findOneByEmail(emailFromHeaders);
    if (existingUserByEmail) {
        await this.updateAuth0UserId(existingUserByEmail, auth0_user_id);
        return `User with email ${emailFromHeaders} already exists and was updated with the new ID ${auth0_user_id}.`;
    }

    const newUser = new User(); 
    newUser.auth0_user_id = auth0_user_id;
    newUser.userEmail = emailFromHeaders;
    await this.createUser(newUser);
    return 'User added successfully.';
}

  async findOneByUserAuth0Id(userId: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ auth0_user_id: userId }).exec();
      if(!user)
      {
        this.logger.error(`user with the id ${userId} was not found`);
        throw new NotFoundException(`user with the id ${userId} was not found`)
      }
      
      return user;
    } catch (error) {
      this.logger.error('Failed to find user', error.stack);
      throw new InternalServerErrorException('Error fetching user');
    }
  }
  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ userEmail: email }).exec();
      if(!user)
      {
        this.logger.error(`user with the email ${email} was not found`);
        throw new NotFoundException(`user with the email ${email} was not found`)
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to find user by email', error.stack);
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async updateAuth0UserId(existingUserByEmail: User | undefined, auth0_user_id: string): Promise<User | undefined> {
    if (!existingUserByEmail) {
        this.logger.error('User with this email does not exist');
        throw new NotFoundException('User not found');
    }

    try {
            if (!auth0_user_id) {
      this.logger.error('auth0_user_id is not provided');
      throw new HttpException('Auth0 user ID must be provided', HttpStatus.BAD_REQUEST);
  }
  
  if (!existingUserByEmail.auth0_user_id) {
            existingUserByEmail.auth0_user_id = auth0_user_id;
            console.log(existingUserByEmail.auth0_user_id);
            await this.updateUser(existingUserByEmail.id, existingUserByEmail);
            return existingUserByEmail;
        }
        else {
          this.logger.error('User already has an Auth0 user ID');
          throw new HttpException('User already has an Auth0 user ID', HttpStatus.CONFLICT);
      }

    } catch (error) {
      if (error.name === 'ValidationError') {
        this.logger.error('Validation error', error.stack);
        throw new HttpException('Validation error: ' + error.message, HttpStatus.BAD_REQUEST);
    } else if (error.name === 'MongoError' && error.code === 11000) {
        this.logger.error('Duplicate key error', error.stack);
        throw new HttpException('Duplicate key error: ' + error.message, HttpStatus.CONFLICT);
    } else {
        this.logger.error('Failed to update user', error.stack);
        throw new InternalServerErrorException('Error updating user');
    }
}
}

  async createUser(user: CreateUserDto): Promise<User> {
    if(!user) {
      throw new BadRequestException('user is null');
    }
    const newUser = new this.userModel(user);
    try {
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) { 
        throw new ConflictException('User with the given email already exists');
      }
      else if (error.name === 'ValidationError') { 
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Unexpected error occurred');
      }
      }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    if(!user) {
      throw new BadRequestException('user is null');
    }
    if(!id){
      throw new BadRequestException('user id not provided');
    }
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { auth0_user_id: id },
        user,
        { new: true },
      ).exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch(error)
    {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + error.message);
      } else if (error.code === 11000) { 
        throw new ConflictException('Duplicate key error: ' + error.message);
      } else {
        throw new InternalServerErrorException('An unexpected error occurred: ' + error.message);
      }
  
    }
  }
}

