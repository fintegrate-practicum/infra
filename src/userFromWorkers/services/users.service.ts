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

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOneByUserId(userId: string): Promise<User | undefined> {
    if (!userId) {
      throw new BadRequestException('User ID must be provided');
    }
    const user = await this.userModel.findById(userId).exec();
    return user;
  }

  async checkAndAddUser(user: any, userId: string): Promise<string> {
    const user_id_from_metadate = userId.split('|');
    const auth0_user_id = user_id_from_metadate[1];
    if (!auth0_user_id) {
      throw new BadRequestException('Auth0 user ID not provided');
    }
    if (!user.email) {
      throw new BadRequestException('user email not provided');
    }
    let existingUserByAuth0Id: User;
    try {
      existingUserByAuth0Id = await this.findOneByUserAuth0Id(auth0_user_id);
    } catch (error) {
      this.logger.log(`user with ${auth0_user_id} isn't exist`);
    }
    if (existingUserByAuth0Id) {
      return `User with id ${auth0_user_id} already exists.`;
    }
    let existingUserByEmail: User;
    try {
      existingUserByEmail = await this.findOneByEmail(user.email);
    } catch (error) {
      this.logger.log('existingUserByEmail');
    }
    if (existingUserByEmail) {
      await this.updateAuth0UserId(existingUserByEmail, auth0_user_id);
      return `User with email ${user.email} already exists and was updated with the new ID ${auth0_user_id}.`;
    }
    const newUser = new CreateUserDto();
    newUser.auth0_user_id = auth0_user_id;
    newUser.userEmail = user.email;
    newUser.userName = user.name;
    newUser.registeredAt = user.created_at;
    newUser.lastLogin = user.last_login;
    await this.createUser(newUser);
    return 'User added successfully.';
  }

  async findOneByUserAuth0Id(userId: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ auth0_user_id: userId }).exec();
    if (!user) {
      this.logger.error(`user with the id ${userId} was not found`);
      throw new NotFoundException(`user with the id ${userId} was not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ userEmail: email }).exec();
      if (!user) {
        this.logger.error(`user with the email ${email} was not found`);
        throw new NotFoundException(`user with the email ${email} was not found`);
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to find user by email', error.stack);
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async updateAuth0UserId(
    existingUserByEmail: User | undefined,
    auth0_user_id: string,
  ): Promise<User | undefined> {
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
      } else {
        this.logger.error('User already has an Auth0 user ID');
        throw new HttpException('User already has an Auth0 user ID', HttpStatus.CONFLICT);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.logger.error('Validation error', error.stack);
        throw new HttpException(
          'Validation error: ' + error.message,
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.name === 'MongoError' && error.code === 11000) {
        this.logger.error('Duplicate key error', error.stack);
        throw new HttpException(
          'Duplicate key error: ' + error.message,
          HttpStatus.CONFLICT,
        );
      } else {
        this.logger.error('Failed to update user', error.stack);
        throw new InternalServerErrorException('Error updating user');
      }
    }
  }

  async createUser(user: CreateUserDto): Promise<User> {
    if (!user) {
      throw new BadRequestException('user is null');
    }
    const newUser = new this.userModel(user);
    try {
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with the given email already exists');
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Unexpected error occurred');
      }
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    if (!user) {
      throw new BadRequestException('user is null');
    }
    if (!id) {
      throw new BadRequestException('user id not provided');
    }
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate({ auth0_user_id: id }, user, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + error.message);
      } else if (error.code === 11000) {
        throw new ConflictException('Duplicate key error: ' + error.message);
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred: ' + error.message,
        );
      }
    }
  }

  async getUserBusinesses(
    userId: string,
  ): Promise<{ businessId: string; role: string }[]> {
    const user = await this.findOneByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.businessRoles;
  }

  async getUserRoleInBusiness(
    userId: string,
    businessId: string,
  ): Promise<{ role: string } | { message: string }> {
    const user = await this.findOneByUserId(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const businessRole = user.businessRoles.find((br) => br.businessId === businessId);

    if (!businessRole) {
      return {
        message: `User with ID ${userId} does not have a role in business with ID ${businessId}`,
      };
    }

    return { role: businessRole.role };
  }
}
