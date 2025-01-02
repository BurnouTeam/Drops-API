import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OrganizationService } from './organization.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('/organizations')
  // listOrganizations(): any {
  //   return this.organizationService.organizations({});
  // }
  // @Post('/organization')
  // createOrganization(): any {
  //   return this.organizationService.createOrganization({
  //     name: 'Drops',
  //     email: 'drops@hotmail.com',
  //   });
  // }
}
