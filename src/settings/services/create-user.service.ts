import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import nodemailer from 'nodemailer';


@Injectable()
export class AuthService {
  private readonly AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN ;

  constructor(private readonly httpService: HttpService) { }

  // פונקציה ליצירת משתמש ב-Auth0 ושליחת הודעה
  async createUserAndNotify(email: string, name: string) {
    try {
      // יצירת משתמש ב-Auth0 וקבלת ה-ID של המשתמש
      const userId = await this.createUserInAuth0(email, name);
      // שליחת הודעה לעובד (ניתן להוסיף פונקציות לשליחת מייל כאן)
      this.sendNotificationToEmployee(email);
      return userId;
    } catch (error) {
      console.error('Error creating user in Auth0 and notifying employee: ', error);
      throw error;
    }
  }

  // פונקציה לשליחת הודעה לעובד (לדוגמה: מייל)
  private async sendNotificationToEmployee(email: string) {
    // אתחול המשתנה transporter
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com', // כתובת ה-SMTP שלך
        port: 587, // יכול להיות גם 465 ל-SSL
        secure: false, // true אם תשתמש ב-SSL/TLS
        auth: {
            user: 'elemetorkamatech2@gmail.com', // כתובת הדוא"ל שלך
            pass: 'Kamatech' // סיסמת הדוא"ל שלך
        }
    });

    // הגדרת ההודעה
    let mailOptions = {
        from: 'elemetorkamatech2@gmail.com', // כתובת הדוא"ל היוצא
        to: email, // כתובת הדוא"ל לשליחה
        subject: 'Notification from Your App', // נושא ההודעה
        text: 'Hello,\n\nThis is a notification from your application.' // תוכן ההודעה
    };

    // שליחת המייל
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('Email sent: ' + info.response);
    });
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
}