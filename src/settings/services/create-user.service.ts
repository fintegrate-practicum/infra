import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly AUTH0_DOMAIN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly rabbitPublisherService: RabbitPublisherService,
  ) {
    this.AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');
  }

  // פונקציה ליצירת משתמש ב-Auth0 ושליחת הודעה
  async createUserAndNotify(email: string, name: string): Promise<string> {
    try {
      // יצירת קישור להשלמת הרישום ב-Auth0
      const registrationLink = await this.createRegistrationLink(email, name);

      // שליחת הודעה לעובד עם הקישור להשלמת הרישום
      await this.sendNotificationToEmployee(email, registrationLink);

      // יצירת משתמש ב-Auth0 והחזרת ה-ID של המשתמש
      const userId = await this.createUserInAuth0(email, name);

      return userId;
    } catch (error) {
      console.error('Error creating user in Auth0 and notifying employee: ', error);
      throw error;
    }
  }

  // יצירת קישור להשלמת הרישום ב-Auth0
  private async createRegistrationLink(email: string, name: string): Promise<string> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://${this.AUTH0_DOMAIN}/api/v2/users`,
          {
            email,
            name,
            connection: 'Username-Password-Authentication'
          }
        )
      );

      const userId = response.data.user_id; // מקבל את ה-ID של המשתמש שנוצר ב-Auth0
      const registrationLink = `https://${this.AUTH0_DOMAIN}/continue-registration?user_id=${userId}`;

      return registrationLink;
    } catch (error) {
      console.error('Error calling Auth0 API: ', error);
      throw error;
    }
  }

  // שליחת הודעה לעובד 
  private async sendNotificationToEmployee(email: string, registrationLink: string) {
    try {
      const loginMessage = {
        pattern: 'message_queue',
        data: {
          to: email,
          subject: 'Notification from Your App',
          text: `Hello,\n\nThis is a notification from your application.\n\nFinish your registration using the following link:\n${registrationLink}`
        },
      };

      console.log('Sending notification message:', loginMessage.data);
      await this.rabbitPublisherService.publishMessageToCommunication(loginMessage);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

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

  // פונקציה ליצירת משתמש ב-Auth0 והחזרת ה-ID של המשתמש
  private async createUserInAuth0(email: string, name: string): Promise<string> {
    try {
      
      const response = await lastValueFrom(
        this.httpService.post(
          `https://${this.AUTH0_DOMAIN}/api/v2/users`,
          {
            email,
            name,
            connection: 'Username-Password-Authentication'
          }
        )
      );
      if (!response || !response.data) {
        throw new Error('Invalid response from Auth0 API');
      }
      const { user_id } = response.data;
      if (!user_id) {
        throw new Error('User ID not found in response');
      }
            
      return response.data.user_id; 
    } catch (error) {
      console.error('Error calling Auth0 API: ', error);
      throw error;
    }
  }
}
