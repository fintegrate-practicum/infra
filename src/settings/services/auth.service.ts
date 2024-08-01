import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config'; 


@Injectable()
export class Auth0Service {
    private readonly AUTH0_DOMAIN: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {    this.AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');}

  // פונקציה לקבלת האפשרויות להתחברות עבור משתמש לפי כתובת האימייל שלו
  async getConnectionsForUser(email: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${this.AUTH0_DOMAIN}/api/v2/users-by-email`,
          {
            params: { email },
          }
        )
      );

      const userId = response.data[0].user_id;
      const userIdentity = await lastValueFrom(
        this.httpService.get(
          `https://${this.AUTH0_DOMAIN}/api/v2/users/${userId}/identities`
        )
      );

      return userIdentity.data;
    } catch (error) {
      console.error('Error fetching user identities from Auth0: ', error);
      throw error;
    }
  }
}
