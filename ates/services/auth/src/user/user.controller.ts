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
import { ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { StatusDescription } from '../common/status.description';
import { CreateUserRequestDTO } from './dto/create.user.dto';
import { UserService } from './user.service';
import { UpdateUserRequestDTO } from './dto/update.user.dto';
import { AuthGuard } from '../common/auth.guard';
import { User } from '../common/user.decorator';
import { IUser } from './types/user';
import { GetUserResponseDTO } from './dto/get.user.dto';
import { IdPathParams } from './dto/id.path-params.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard(['admin']))
  @ApiSecurity('authorization', ['authorization'])
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async getUsers(): Promise<GetUserResponseDTO[]> {
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

  @Patch(':id')
  @UseGuards(AuthGuard(['admin']))
  @ApiSecurity('authorization', ['authorization'])
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async updateUser(
    @Param() params: IdPathParams,
    @User() user: IUser,
    @Body() body: UpdateUserRequestDTO,
  ): Promise<void> {
    const userId = Number(params.id);
    if (body.role && body.role !== user.role && user.id === userId) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.updateUser({ id: userId, ...body });
  }

  @Delete(':id')
  @UseGuards(AuthGuard(['admin']))
  @ApiSecurity('authorization', ['authorization'])
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StatusDescription.OK,
  })
  async deleteUser(
    @Param() params: IdPathParams,
    @User() user: IUser,
  ): Promise<void> {
    const userId = Number(params.id);

    if (userId === user.id) {
      throw new BadRequestException('Operation not permitted');
    }

    await this.userService.deleteUser(userId);
  }
}
