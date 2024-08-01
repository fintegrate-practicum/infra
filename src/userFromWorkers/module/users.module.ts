import { Module } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UsersController],
})
export class UserModule {}
