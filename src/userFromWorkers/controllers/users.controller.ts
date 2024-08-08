import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../schema/user.entity';

@ApiTags('User')
@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  getWorker(@Param('id') auth0_user_id: string) {
    return this._userService.findOneByUserAuth0Id(auth0_user_id);
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this._userService.findOneByEmail(email);
  }

  @Get('jwt')
  @UseGuards(AuthGuard('jwt'))
  async getUserByToken(@Request() req): Promise<User> {
    const auth0_user_id = req.user.id;
    return this._userService.findOneByUserAuth0Id(auth0_user_id);
  }

  @Put('jwt')
  @UseGuards(AuthGuard('jwt'))
  async checkAndAddUser(@Request() req): Promise<string> {
    return this._userService.checkAndAddUser(req.user);
  }

  @Post('')
  async createUser(@Body() user: CreateUserDto) {
    return this._userService.createUser(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this._userService.updateUser(id, user);
  }

  @Get(':id/businesses')
  async getUserBusinesses(@Param('id') userId: string) {
    return this._userService.getUserBusinesses(userId);
  }

  @Get(':userId/business/:businessId')
  async getUserRoleInBusiness(
    @Param('userId') userId: string,
    @Param('businessId') businessId: string,
  ) {
    return this._userService.getUserRoleInBusiness(userId, businessId);
  }
}
