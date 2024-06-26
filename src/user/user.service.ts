import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { User } from "./user.type";

@Injectable()
export class UserService {
    private readonly workersServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.workersServiceUrl = this.configService.get<string>(
            "WORKERS_SERVICE_URL",
        );
    }

    async getUserById(userId: string): Promise<User> {
        try {
            const response = await this.httpService
                .get<User>(`${this.workersServiceUrl}/admin/user/${userId}`)
                .toPromise();
            return response.data;
        } catch (error) {
            throw new HttpException(
                "Failed to fetch user",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUsersByBusinessId(businessId: string): Promise<User[]> {
        try {
            const response = await this.httpService
                .get<User[]>(`${this.workersServiceUrl}/admin/business/${businessId}/users`)
                .toPromise();
            return response.data;
        } catch (error) {
            throw new HttpException(
                "Failed to fetch users",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
