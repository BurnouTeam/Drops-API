import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    const input = {
      name: createClientDto.name,
      email: createClientDto.email,
      phoneNumber: createClientDto.phoneNumber,
      profilePhoto: createClientDto.profilePhoto,
      street: createClientDto.street,
      number: createClientDto.number,
      complement: createClientDto.complement,
      neighborhood: createClientDto.neighborhood,
      city: createClientDto.city,
      state: createClientDto.state,
      cep: createClientDto.cep,
      organization: {
        connect: { id: createClientDto.organizationId },
      },
    };
    return this.clientService.create(input);
  }

  @Get(':organizationId')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.clientService.find({ fields, where: { organizationId } });
  }

  @Get('overview/:time/:organizationId')
  getClientsOverview(
    @Param('time') time: string,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.clientService.getNewClients({ data: { time, organizationId } });
  }

  @Get(':organizationId/:phoneNumber')
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('phoneNumber') phoneNumber: string,
  ) {
    return this.clientService.client({ phoneNumber, organizationId });
  }

  @Patch(':organizationId/:phoneNumber')
  update(
    @Param('phoneNumber') phoneNumber: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const params = {
      where: {
        phoneNumber,
        organizationId: updateClientDto.organizationId,
      },
      data: updateClientDto,
    };
    return this.clientService.update(params);
  }

  @Delete(':organizationId/:phoneNumber')
  remove(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('phoneNumber') phoneNumber: string,
  ) {
    return this.clientService.remove({ phoneNumber, organizationId });
  }
}
