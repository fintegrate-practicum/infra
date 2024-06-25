import { Controller, Body, Get, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ExternalCurrentUserService } from './currentUser.service';

import { CurrentUser } from './currentUser.entity';
@Controller('currentUser')
export class CurrentUserController {
  constructor(private readonly externalCurrentUserService: ExternalCurrentUserService) {}

  @Get('currentUser/:auth0_user_id')
  async showDetails(@Param('auth0_user_id') auth0_user_id: string): Promise<CurrentUser | null> {
    try {
      const user = await this.externalCurrentUserService.getUserDetails(auth0_user_id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':auth0_user_id')
  async updateProfileDetails(
    @Param('auth0_user_id') auth0_user_id: string,
    @Body() newData: CurrentUser,
  ): Promise<CurrentUser> {
    try {
      const updatedUser = await this.externalCurrentUserService.updateUserDetails(auth0_user_id, newData);
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return updatedUser;
    } catch (error) {
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

