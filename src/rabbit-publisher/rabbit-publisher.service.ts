import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib/callback_api';

@Injectable()
export class RabbitPublisherService {
  private readonly logger = new Logger(RabbitPublisherService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly nameExchange: string;
  private readonly nameQueue: string;

  constructor(private configService: ConfigService) {
    this.nameExchange =
      this.configService.get<string>('RABBITMQ_EXCHANGE_NAME') || 'default_exchange';
    this.nameQueue =
      this.configService.get<string>('RABBITMQ_QUEUE_NAME') || 'default_queue';

    this.connectToRabbitMQ();
  }

  async connectToRabbitMQ() {
    try {
      const amqpHost = this.configService.get<string>('AMQP_HOST');
      const amqpPort = this.configService.get<number>('AMQP_PORT');
      const amqpUrl = `amqp://${amqpHost}:${amqpPort}`;
      const username = this.configService.get<string>('AMQP_USERNAME');
      const password = this.configService.get<string>('AMQP_PASSWORD');

      if (!amqpHost || !amqpPort) {
        throw new Error('AMQP_HOST or AMQP_PORT is not defined');
      }

      this.logger.log(`Connecting to RabbitMQ with URL: ${amqpUrl}`);

      this.connection = await new Promise<amqp.Connection>((resolve, reject) => {
        amqp.connect(amqpUrl, { username, password }, (err, conn) => {
          if (err) {
            reject(err);
          } else {
            resolve(conn);
          }
        });
      });

      this.channel = await this.connection.createChannel();
      await this.initializeRabbitMQ();
      this.logger.log('Connected and initialized RabbitMQ successfully');
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ:', error.message);
    }
  }

  async initializeRabbitMQ(): Promise<void> {
    try {
      await this.channel.assertExchange(this.nameExchange, 'direct', {
        durable: false,
      });
      await this.channel.assertQueue(this.nameQueue, { durable: true });
      await this.channel.bindQueue(this.nameQueue, this.nameExchange, 'message_type');
      this.logger.log(`Exchange and Queue initialized successfully`);
    } catch (error) {
      this.logger.error('Error initializing RabbitMQ:', error.message);
    }
  }

  async publishMessageToCommunication(message: any): Promise<void> {
    if (!this.channel) {
      this.logger.error('Channel is not initialized');
      return;
    }

    try {
      const exchangeName = message.pattern || this.nameExchange; // השתמש בברירת מחדל אם אין exchangeName
      const messageData = JSON.stringify(message);
      this.logger.log(`Publishing message to exchange: ${exchangeName}`);

      if (!exchangeName) {
        throw new Error('Exchange name is not defined in the message');
      }

      this.channel.publish(exchangeName, 'message_type', Buffer.from(messageData));
      this.logger.log(`Message published to exchange: ${exchangeName}`);
    } catch (error) {
      this.logger.error(`Error publishing message: ${error.message}`);
    }
  }
}
