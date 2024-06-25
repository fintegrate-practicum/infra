import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from './currentUser.entity';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class ExternalCurrentUserService {
  constructor(private readonly httpService: HttpService) {}

  async getUserDetails(auth0_user_id: string): Promise<any> {
    try {

      const userDetailsResponse = await firstValueFrom(
        this.httpService.get(`http://localhost:4000/workers/user/${auth0_user_id}`)
      );
      
      const workerDetailsResponse = await firstValueFrom(
        this.httpService.get(`http://localhost:4000/workers/employee/${auth0_user_id}`)
      );
      return {
        userDetails: userDetailsResponse.data,
        workerDetails: workerDetailsResponse.data,
      };
    } catch (error) {
      throw new Error('Failed to retrieve user from external server');
    }
  }

  async updateUserDetails(auth0_user_id: string, newData: CurrentUser): Promise<any> {
    try {
      const {user } = newData;
      const {employee}=newData

      const { userEmail, mobile } = user;
      const isValidEmail = /\S+@\S+\.\S+/.test(userEmail); 
      const isValidPhone = /^\d{10}$/.test(mobile); 
      if (!isValidEmail || !isValidPhone ) {
        throw new Error('Invalid input data');
      }
      const userDetailsResponse = await firstValueFrom(
        this.httpService.put(`http://localhost:4000/workers/user/${auth0_user_id}`,user)
      );
      
      const workerDetailsResponse = await firstValueFrom(
        this.httpService.put(`http://localhost:4000/workers/employee/${auth0_user_id}`,employee)
      );
      return {
        userDetails: userDetailsResponse.data,
        workerDetails: workerDetailsResponse.data,
      };
    } catch (error) {
      throw new Error('Failed to update user on external server');
    }
  }
}
