import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RabbitPublisherService } from '../../../../orders/src/rabbit-publisher/rabbit-publisher.service';
import { Auth0Service } from './auth.service'; // סרוויס לניהול זהות והתחברות

@Injectable()
export class AuthService {
  private readonly AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;

  constructor(
    private readonly httpService: HttpService,
    private readonly rabbitPublisherService: RabbitPublisherService,
    private readonly auth0Service: Auth0Service // סרוויס לניהול זהות והתחברות
  ) {}

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

  // שליחת הודעה לעובד (במקרה זה דוא"ל נמצא בשירות ה-RabbitMQ)
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

      return response.data.user_id; // מחזיר את ה-ID של המשתמש שנוצר ב-Auth0
    } catch (error) {
      console.error('Error calling Auth0 API: ', error);
      throw error;
    }
  }
}
