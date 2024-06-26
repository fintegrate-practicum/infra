import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
    private readonly workersServiceUrl = 'http://localhost:5673/api';
    
    constructor(private readonly httpService: HttpService) { }

    async getUserById(userId: string): Promise<any> {
        try {
            const response = await this.httpService.get(`${this.workersServiceUrl}/user/${userId}`).toPromise();
            return response.data;
        } catch (error) {
            throw new HttpException('Failed to fetch user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsersByBusinessId(businessId: string): Promise<any[]> {
        try {
            const response = await this.httpService.get(`${this.workersServiceUrl}/business/${businessId}/users`).toPromise();
            return response.data;
        } catch (error) {
            throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
