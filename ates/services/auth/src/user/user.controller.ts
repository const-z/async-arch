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
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

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
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async getUsers(): Promise<UserEntity[]> {
    const result = await this.userService.getUsers();

    return result;
  }

  @Post()
  @UseGuards(AuthGuard(['admin']))
  @ApiSecurity('authorization', ['authorization'])
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StatusDescription.CREATED,
  })
  async createUser(@Body() body: CreateUserRequestDTO): Promise<void> {
    await this.userService.createUser(body);
  }

  @Patch(':userId')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async updateUser(
    @Param('userId') userId: string,
    @User() user: IUser,
    @Body() body: UpdateUserRequestDTO,
  ): Promise<void> {
    if (body.role && body.role !== user.role.name && user.id === userId) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.updateUser({ id: userId, ...body });
  }

  @Delete(':userId')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async deleteUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.deleteUser(userId);
  }

  @Post(':userId/block')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async blockUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.blockUser(userId);
  }

  @Post(':userId/unblock')
  @UseGuards(AuthGuard(['admin']))
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async unblockUser(
    @Param('userId') userId: string,
    @User() user: IUser,
  ): Promise<void> {
    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.unblockUser(userId);
  }
}
