import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './create-user.service';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
//import { HttpResponse } from 'axios';

describe('AuthService', () => {
  let authService: AuthService;
  let httpService: HttpService;
  let rabbitPublisherService: RabbitPublisherService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: RabbitPublisherService,
          useValue: {
            publishMessageToCommunication: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_auth0_domain'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
    rabbitPublisherService = module.get<RabbitPublisherService>(RabbitPublisherService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createUserAndNotify', () => {
    it('should create user in Auth0, generate a registration link, and send a notification', async () => {
      const email = 'tehila3118@gmail.com';
      const name = 'Test User';
      const userId = 'mocked_user_id';
      const registrationLink = `https://mocked_auth0_domain/continue-registration?user_id=${userId}`;
      const mockMessage = {
        pattern: 'message_queue',
        data: {
          to: email,
          subject: 'Notification from Your App',
          text: `Hello,\n\nThis is a notification from your application.\n\nFinish your registration using the following link:\n${registrationLink}`,
        },
      };

      // Mock responses for HttpService post requests
      (httpService.post as jest.Mock)
        .mockReturnValueOnce(of({ data: { user_id: userId } })) // Mocked response for user creation
        .mockReturnValueOnce(of({})); // Mocked response for registration link creation

      // Mock RabbitMQ service
      (rabbitPublisherService.publishMessageToCommunication as jest.Mock)
        .mockReturnValue(Promise.resolve());

      // Call the method
      const result = await authService.createUserAndNotify(email, name);

      // Assertions
      expect(result).toBe(userId);
      expect(httpService.post).toHaveBeenCalledTimes(2); // Expect two calls to httpService.post
      expect(rabbitPublisherService.publishMessageToCommunication).toHaveBeenCalledWith(
        mockMessage,
      );
    });
  });

  describe('createRegistrationLink', () => {
    it('should create a registration link for the user', async () => {
      const email = 'tehila3118@gmail.com';
      const name = 'Test User';
      const userId = 'mocked_user_id';
      const registrationLink = `https://mocked_auth0_domain/continue-registration?user_id=${userId}`;

      // Mock response for HttpService post request
      (httpService.post as jest.Mock).mockReturnValueOnce(
        of({ data: { user_id: userId } }),
      );

      // Call the method
      const result = await authService['createRegistrationLink'](email, name);

      // Assertions
      expect(result).toBe(registrationLink);
      expect(httpService.post).toHaveBeenCalledWith(
        `https://mocked_auth0_domain/api/v2/users`,
        { email, name, connection: 'Username-Password-Authentication' },
      );
    });

    it('should throw an error if Auth0 API call fails', async () => {
      const email = 'tehila3118@gmail.com';
      const name = 'Test User';

      // Mock response for HttpService post request
      (httpService.post as jest.Mock).mockReturnValueOnce(
        throwError(() => new Error('Auth0 API call failed')),
      );

      // Call the method and assert error is thrown
      await expect(authService['createRegistrationLink'](email, name)).rejects.toThrow(
        'Auth0 API call failed',
      );
    });
  });

  describe('sendNotificationToEmployee', () => {
    it('should send a notification to the employee', async () => {
      const email = 'tehila3118@gmail.com';
      const registrationLink =
        'https://mocked_auth0_domain/continue-registration?user_id=mocked_user_id';
      const mockMessage = {
        pattern: 'message_queue',
        data: {
          to: email,
          subject: 'Notification from Your App',
          text: `Hello,\n\nThis is a notification from your application.\n\nFinish your registration using the following link:\n${registrationLink}`,
        },
      };

      // Mock RabbitMQ service
      (rabbitPublisherService.publishMessageToCommunication as jest.Mock)
        .mockReturnValue(Promise.resolve());

      // Call the method
      await authService['sendNotificationToEmployee'](email, registrationLink);

      // Assertions
      expect(rabbitPublisherService.publishMessageToCommunication).toHaveBeenCalledWith(
        mockMessage,
      );
    });

    it('should throw an error if sending notification fails', async () => {
      const email = 'tehila3118@gmail.com';
      const registrationLink =
        'https://mocked_auth0_domain/continue-registration?user_id=mocked_user_id';

      // Mock RabbitMQ service
      (rabbitPublisherService.publishMessageToCommunication as jest.Mock)
        .mockReturnValue(Promise.reject(new Error('Failed to send notification')));

      // Call the method and assert error is thrown
      await expect(
        authService['sendNotificationToEmployee'](email, registrationLink),
      ).rejects.toThrow('Failed to send notification');
    });
  });

  describe('getConnectionsForUser', () => {
    it('should fetch user connections from Auth0', async () => {
      const email = 'tehila3118@gmail.com';
      const userId = 'mocked_user_id';
      const mockedIdentityData = { identity: 'mocked_identity_data' };

      // Mock response for HttpService get requests
      (httpService.get as jest.Mock)
        .mockReturnValueOnce(of({ data: [{ user_id: userId }] })) // Mocked response for user fetch
        .mockReturnValueOnce(of({ data: mockedIdentityData })); // Mocked response for user identities

      // Call the method
      const result = await authService.getConnectionsForUser(email);

      // Assertions
      expect(result).toBe(mockedIdentityData);
      expect(httpService.get).toHaveBeenCalledTimes(2); // Expect two calls to httpService.get
    });

    it('should throw an error if fetching user connections fails', async () => {
      const email = 'tehila3118@gmail.com';

      // Mock response for HttpService get requests
      (httpService.get as jest.Mock).mockReturnValueOnce(
        throwError(() => new Error('Error fetching user')),
      );

      // Call the method and assert error is thrown
      await expect(authService.getConnectionsForUser(email)).rejects.toThrow(
        'Error fetching user',
      );
    });
  });

  describe('createUserInAuth0', () => {
    it('should create a user in Auth0 and return the user ID', async () => {
      const email = 'tehila3118@gmail.com';
      const name = 'Test User';
      const userId = 'mocked_user_id';

      // Mock response for HttpService post request
      (httpService.post as jest.Mock).mockReturnValueOnce(
        of({ data: { user_id: userId } }),
      );

      // Call the method
      const result = await authService['createUserInAuth0'](email, name);

      // Assertions
      expect(result).toBe(userId);
      expect(httpService.post).toHaveBeenCalledWith(
        `https://mocked_auth0_domain/api/v2/users`,
        { email, name, connection: 'Username-Password-Authentication' },
      );
    });

    it('should throw an error if Auth0 API call fails', async () => {
      const email = 'tehila3118@gmail.com';
      const name = 'Test User';

      // Mock response for HttpService post request
      (httpService.post as jest.Mock).mockReturnValueOnce(
        throwError(() => new Error('Auth0 API call failed')),
      );

      // Call the method and assert error is thrown
      await expect(authService['createUserInAuth0'](email, name)).rejects.toThrow(
        'Auth0 API call failed',
      );
    });
  });
});
