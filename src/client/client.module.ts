import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientEventListener } from './client.event';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService, ClientEventListener],
  exports: [ClientService, ClientEventListener],
})
export class ClientModule {}
