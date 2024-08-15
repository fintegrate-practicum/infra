import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { ConfigService } from '@nestjs/config';
import { Message } from '../../interface/message.interface';

@Injectable()
export class AuthService {
  private readonly AUTH0_DOMAIN: string;
  private readonly AUTH0_API_TOKEN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly rabbitPublisherService: RabbitPublisherService,
  ) {
    this.AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');
    this.AUTH0_API_TOKEN = this.configService.get<string>('AUTH0_API_TOKEN');
  }

  // פונקציה ליצירת משתמש ב-Auth0 ושליחת הודעה
  async createUserAndNotify(
    email: string,
    name: string,
    password: string,
  ): Promise<string> {
    try {
      const userId = await this.createUserInAuth0(email, name, password);
      if (!userId) {
        throw new Error('Failed to create user in Auth0');
      }
      const connections = await this.getConnectionsForUser(email, userId);
      const registrationLink = await this.createRegistrationLink(userId);
      await this.sendNotificationToEmployee(email, name, registrationLink, connections);
      return userId;
    } catch (error) {
      console.error('Error creating user in Auth0 and notifying employee: ', error);
      throw new HttpException('User creation failed', 500);
    }
  }

  // יצירת קישור להשלמת הרישום ב-Auth0
  private async createRegistrationLink(userId: string): Promise<string> {
    return `https://${this.AUTH0_DOMAIN}/continue-registration?user_id=${userId}`;
  }
  private async sendNotificationToEmployee(
    email: string,
    userName: string,
    registrationLink: string,
    connections: any[],
  ) {
    try {
      const message: Message = {
        pattern: 'message_exchange',
        data: {
          to: email,
          subject: 'Notification from Your App',
          type: 'email',
          kindSubject: 'new Employee',
          name: userName,
          invitationLink: registrationLink,
          connection: connections,
          businessId: '1',
        },
      };

      await this.rabbitPublisherService.publishMessageToCommunication(message);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // פונקציה לקבלת האפשרויות להתחברות עבור משתמש לפי כתובת האימייל שלו
  async getConnectionsForUser(email: string, userId: string): Promise<any[]> {
    try {
      const userIdentity = await this.httpService
        .get(`https://${this.AUTH0_DOMAIN}/api/v2/users/${userId}/identities`, {
          headers: {
            'Authorization': `Bearer ${this.AUTH0_API_TOKEN}`, // הוספת טוקן ההרשאה
            'Content-Type': 'application/json',
          },
        })
        .toPromise();

      return userIdentity.data;
    } catch (error) {
      console.error(
        'Error fetching user identities from Auth0: ',
        error.response ? error.response.data : error.message,
      );
      throw new HttpException(
        'Failed to fetch user identities from Auth0',
        error.response?.status || 500,
      );
    }
  }

  // פונקציה ליצירת משתמש ב-Auth0 והחזרת ה-ID של המשתמש
  private async createUserInAuth0(
    email: string,
    name: string,
    password: string,
  ): Promise<any> {
    try {
      const response = await this.httpService
        .post(
          `https://${this.AUTH0_DOMAIN}/api/v2/users`,
          {
            email,
            name,
            password,
            connection: 'Username-Password-Authentication',
          },
          {
            headers: {
              'Authorization': `Bearer ${this.AUTH0_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      const user_id = response.data.user_id;
      return user_id;
    } catch (error) {
      console.error(
        'Error calling Auth0 API: ',
        error.response ? error.response.data : error.message,
      );
      throw new HttpException(
        'Failed to create user in Auth0',
        error.response?.status || 500,
      );
    }
  }
}
