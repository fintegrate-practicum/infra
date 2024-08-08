import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib/callback_api';
import { logger } from 'src/logger';

@Injectable()
export class RabbitPublisherService {
  private readonly logger = new Logger(RabbitPublisherService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly nameExchange: string = 'message_queue';
  private readonly nameQueue: string = 'message_queue';

  constructor(private configService: ConfigService) {
    const nameExchange: string =
      process.env.RABBITMQ_EXCHANGE_NAME ||
      this.configService.get('RABBITMQ_EXCHANGE_NAME');
    const nameQueue: string =
      process.env.RABBITMQ_QUEUE_NAME || this.configService.get('RABBITMQ_QUEUE_NAME');

    this.connectToRabbitMQ();
    this.logger.log('connected to rabbit');
  }

  async connectToRabbitMQ() {
    try {
      const amqpUrl = `amqp://${this.configService.get('AMQP_HOST')}:${this.configService.get('AMQP_PORT')}`;
      const username = this.configService.get('AMQP_USERNAME');
      const password = this.configService.get('AMQP_PASSWORD');

      this.connection = await new Promise<amqp.Connection>((resolve, reject) => {
        amqp.connect(
          amqpUrl,
          {
            username,
            password,
          },
          (err, conn) => {
            if (err) {
              reject(err);
            } else {
              resolve(conn);
            }
          },
        );
      });

      this.channel = await this.connection.createChannel();
      // this.channel = await new Promise<amqp.Channel>((resolve, reject) => {
      //   this.connection.createChannel((err, channel) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(channel);
      //     }
      //   });
      // });

      await this.initializeRabbitMQ();
    } catch (error) {
      logger.error('Error connecting to RabbitMQ:', error);
    }
  }

  async initializeRabbitMQ(): Promise<void> {
    try {
      await this.channel.assertExchange(this.nameExchange, 'direct', {
        durable: false,
      });
      await this.channel.assertQueue(this.nameQueue, { durable: true });
      await this.channel.bindQueue(this.nameQueue, this.nameExchange, 'message_type');
    } catch (error) {
      logger.error('Error initializing RabbitMQ:', error);
    }
  }

  async publishMessageToCommunication(message: any): Promise<void> {
    if (!this.channel) {
      logger.error('Channel is not initialized');
      return;
    }

    try {
      const exchangeName = message.pattern;
      const messageData = JSON.stringify(message);
      this.logger.log(messageData);

      this.channel.publish(exchangeName, 'message_type', Buffer.from(messageData));
      this.logger.log(`Message published to exchange :  ${exchangeName} `);
    } catch (error) {
      this.logger.error(`Message not published with routing key ${error} `);
    }
  }
}
