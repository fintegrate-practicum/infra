import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from './currentUser.entity';
import { HttpService } from '@nestjs/axios';
import { User } from './user.entity';



@Injectable()
export class ExternalCurrentUserService {
  constructor(private readonly httpService: HttpService) {}

  async getUserDetails(auth0_user_id: string): Promise<any> {
    try {

      const userDetailsResponse = await firstValueFrom(
        this.httpService.get(`${process.env.VITE_WORKERS_SERVER_URL}/user`, {
          headers: { 'auth0-user-id': auth0_user_id },
        })     
       );
      const userId = userDetailsResponse.data.data._id; 

      const workerDetailsResponse = await firstValueFrom(
        this.httpService.get(`${process.env.VITE_WORKERS_SERVER_URL}/workers/${userId}`)
      );
      return {
        userDetails: userDetailsResponse.data.data,
        workerDetails: workerDetailsResponse.data.data,
      };
    } catch (error) {
      throw new Error('Failed to retrieve user from external server');
    }
  }

  async updateUserDetails(auth0_user_id: string, newData: CurrentUser): Promise<any> {
    try {
      const {user }:any = newData.user;
      const {employee}:any=newData.employee

      const { userEmail, mobile } = user;
      const isValidEmail = /\S+@\S+\.\S+/.test(userEmail); 
      const isValidPhone = /^\d{10}$/.test(mobile); 
      if (!isValidEmail || !isValidPhone ) {
        throw new Error('Invalid input data');
      }
      const userDetailsResponse = await firstValueFrom(
        this.httpService.put(`${process.env.VITE_WORKERS_SERVER_URL}/user`, {
          headers: { 'auth0-user-id': auth0_user_id },
        })      );
      const userId = userDetailsResponse.data.data._id; 

      
      const workerDetailsResponse = await firstValueFrom(
        this.httpService.put(`${process.env.VITE_WORKERS_SERVER_URL}/workers/${userId}`)
      );
      return {
        userDetails: userDetailsResponse.data.data,
        workerDetails: workerDetailsResponse.data.data,
      };
    } catch (error) {
      throw new Error('Failed to update user on external server');
    }
  }
}
