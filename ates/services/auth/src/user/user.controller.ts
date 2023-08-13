import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { StatusDescription } from '../status.description';
import { UserEntity } from '../db/entity/user.entity';
import { CreateUserRequestDTO } from './dto/create.user.dto';
import { UserService } from './user.service';
import { UpdateUserRequestDTO } from './dto/update.user.dto';
import { AuthGuard } from '../common/auth.guard';
import { User } from '../common/user.decorator';
import { IUser } from './types/user';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async getUsers(): Promise<UserEntity[]> {
    const result = await this.appService.getUsers();

    return result;
  }

  @Post()
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StatusDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async createUser(@Body() body: CreateUserRequestDTO): Promise<void> {
    await this.appService.createUser(body);
  }

  @Patch(':userId')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async updateUser(
    @Param('userId') userId: string,
    @User() user: IUser,
    @Body() body: UpdateUserRequestDTO,
  ): Promise<void> {
    if (body.role && body.role !== user.role.name && user.id === userId) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.appService.updateUser({ id: userId, ...body });
  }

  @Delete(':userId')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async deleteUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.appService.deleteUser(userId);
  }

  @Post(':userId/block')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async blockUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.appService.blockUser(userId);
  }

  @Post(':userId/unblock')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async unblockUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.appService.unblockUser(userId);
  }
}
