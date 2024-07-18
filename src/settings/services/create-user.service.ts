import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RabbitPublisherService } from '../../../../orders/src/rabbit-publisher/rabbit-publisher.service';


@Injectable()
export class AuthService {
  private readonly AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;

  constructor(
    private readonly httpService: HttpService,
    private readonly rabbitPublisherService: RabbitPublisherService,
  ) {}

  // פונקציה ליצירת משתמש ב-Auth0 ושליחת הודעה
  async createUserAndNotify(email: string, name: string) {
    try {
      // יצירת משתמש ב-Auth0 וקבלת ה-ID של המשתמש
      const userId = await this.createUserInAuth0(email, name);
      // שליחת הודעה לעובד
      await this.sendNotificationToEmployee(email);
      return userId;
    } catch (error) {
      console.error('Error creating user in Auth0 and notifying employee: ', error);
      throw error;
    }
  }

  // פונקציה ליצירת משתמש ב-Auth0 והחזרת ה-ID של המשתמש
  private async createUserInAuth0(email: string, name: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://${this.AUTH0_DOMAIN}/api/v2/users`,
          {
            email,
            name,
            connection: 'Username-Password-Authentication',
            password: 'TempPassword123!', // סיסמה זמנית לעובד, רצוי לשלוח לו לינק לאיפוס סיסמה לאחר הרישום
          }
        )
      );
      return response.data.user_id; // מחזיר את ה-ID של המשתמש שנוצר
    } catch (error) {
      console.error('Error calling Auth0 API: ', error);
      throw error;
    }
  }

  // שליחת הודעה לעובד (במקרה זה דוא"ל נמצא בשירות ה-RabbitMQ)
  private async sendNotificationToEmployee(email: string) {
    try {
      const message = {
        pattern: 'message_queue',
        data: {
          to: email,
          subject: 'Notification from Your App',
          text: 'Hello,\n\nThis is a notification from your application.'
        },
      };

      console.log('Sending notification message:', message.data);
      await this.rabbitPublisherService.publishMessageToCommunication(message);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}
