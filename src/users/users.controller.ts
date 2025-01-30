import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':organizationId')
  async findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.usersService.find({
      where: { organizationId: organizationId },
      fields: fields,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne({ id: id });
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const input = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      profilePhoto: createUserDto.profilePhoto,
      organization: {
        connect: { id: createUserDto.organizationId },
      },
    };

    return this.usersService.create(input);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post(':organizationId')
  create(@Body() createUserDto: CreateUserDto): any {
    const input = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      profilePhoto: createUserDto.profilePhoto,
      organization: {
        connect: { id: createUserDto.organizationId },
      },
    };
    return this.usersService.create(input);
  }
}
