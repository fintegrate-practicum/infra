import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "../user/user.type";

@Controller("admin")
export class AdminController {
    constructor(private readonly userService: UserService) { }

    @Get("user/:id")
    async getUserById(@Param("id") id: string): Promise<User> {
        return await this.userService.getUserById(id);
    }

    @Get("business/:businessId/users")
    async getUsersByBusinessId(
        @Param("businessId") businessId: string,
    ): Promise<User[]> {
        return await this.userService.getUsersByBusinessId(businessId);
    }
}
