import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ClientEventListener {
  private readonly logger = new Logger(ClientEventListener.name);

  onModuleInit() {
    this.logger.log('ClientEventListener is registered!');
  }

  @OnEvent('client.update')
  handleEvent(payload: any) {
    console.log('hello');
    this.logger.log(`Processing client.update event: ${payload}`);
  }
}
