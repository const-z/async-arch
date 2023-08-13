import { Controller, Get, HttpStatus, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { StatusDescription } from '../status.description';
import { CreateUserRequestDTO } from './dto/create.account.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  test() {
    return 'test';
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StatusDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async openAccount(@Body() body: CreateUserRequestDTO): Promise<void> {
    await this.appService.createUser(body);
  }
}
