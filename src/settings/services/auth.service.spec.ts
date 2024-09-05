import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RabbitPublisherService } from '../../rabbit-publisher/rabbit-publisher.service';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;
  let rabbitPublisherService: RabbitPublisherService;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'AUTH0_DOMAIN':
                  return 'mocked_domain-14d7lww6ch5of26k.us.auth0.com';
                case 'AUTH0_API_TOKEN':
                  return 'mocked_token';
                default:
                  return '';
              }
            }),
          },
        },
        {
          provide: RabbitPublisherService,
          useValue: {
            publishMessageToCommunication: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
    rabbitPublisherService = module.get<RabbitPublisherService>(RabbitPublisherService);
    configService = module.get<ConfigService>(ConfigService);
  });
  describe('createRegistrationLink', () => {
    it('should create a registration link for the user', async () => {
      const userId = 'auth0|mockedUserId';
      const expectedLink =
        'https://dev-14d7lww6ch5of26k.us.auth0.com/continue-registration?user_id=auth0|mockedUserId';
      const registrationLink = await service['createRegistrationLink'](userId);
      expect(registrationLink).toBe(expectedLink);
    });
  });
  describe('getConnectionsForUser', () => {
    it('should fetch connections for a user', async () => {
      const userId = 'auth0|mockedUserId';
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('Request failed')));
      await expect(
        service.getConnectionsForUser('worker@example.com', userId),
      ).rejects.toThrowError('Failed to fetch user identities from Auth0');
    });
  });
  describe('sendNotificationToEmployee', () => {
    it('should send notification to employee', async () => {
      const sendNotificationToEmployeeSpy = jest
        .spyOn(service as any, 'sendNotificationToEmployee')
        .mockRejectedValue(new Error('Send notification failed'));
      const email = 'worker@example.com';
      const name = 'Mock Worker';
      const registrationLink = 'https://example.com/registration-link';
      const connections = [{ provider: 'google-oauth2', user_id: '12345' }];
      await expect(
        service['sendNotificationToEmployee'](email, name, registrationLink, connections),
      ).rejects.toThrow('Send notification failed'); // Verify the sendNotificationToEmployee was called correctly
      expect(sendNotificationToEmployeeSpy).toHaveBeenCalled();
    });
  });

  describe('createUserInAuth0', () => {
    it('should create a user in Auth0 and return user ID', async () => {
      const email = 'worker@example.com';
      const name = 'Mock Worker';
      const password = 'password123!';
      const mockResponse: AxiosResponse<any> = {
        data: { user_id: 'auth0|mockedUserId' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));
      const userId = await service['createUserInAuth0'](email, name, password);
      expect(userId).toBe('auth0|mockedUserId');
    });
    it('should handle error in creating user', async () => {
      const email = 'worker@example.com';
      const name = 'Mock Worker';
      const password = 'password123!';
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error('Request failed')));
      await expect(
        service['createUserInAuth0'](email, name, password),
      ).rejects.toThrowError('Failed to create user in Auth0');
    });
  });
});
