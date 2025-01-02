import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientService } from './client.service';
import { OrganizationService } from './organization.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/clients')
  getClients(): any {
    return this.clientService.clients({});
  }

  @Post('/client')
  createClient(): any {
    // return this.clientService.createClient({
    //   name: 'Dante',
    //   phoneNumber: '+5585996105145',
    //   email: 'danteeng@hotmail.com',
    // });
  }


  @Get('/organizations')
  listOrganizations(): any {
    return this.organizationService.organizations({});
  }
  @Post('/organization')
  createOrganization(): any {
    return this.organizationService.createOrganization({
      name: 'Drops',
      email: 'drops@hotmail.com',
    });
  }
}
