import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from '../../bot-webhook/events/event';
import { ClientService } from '../client.service';

@Injectable()
export class ClientListener {
  constructor(private clientService: ClientService) {}

  @OnEvent('client.update')
  async handleUpdateClientEvent(event: Event) {
    // handle and process "OrderCreatedEvent" event
    console.log('From ClientListener', event);
    const client = await this.clientService.find({
      where: { phoneNumber: '+5585996105145', organizationId: 2 },
    });

    console.log(client);
  }
}
