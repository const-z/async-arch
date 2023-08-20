import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CreateTaskRequestDTO } from './dto/create.task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../common/auth.guard';
import { User } from '../common/user.decorator';
import { IUser } from '../user/types/user';
import { TaskResponseDTO } from './dto/task.dto';
import { UserRoles } from 'src/common/users.roles';
import { IdPathParams } from './dto/id.path-params.dto';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('all')
  @UseGuards(AuthGuard([UserRoles.ADMIN, UserRoles.MANAGER]))
  @ApiSecurity('authorization', ['authorization'])
  async getTasks(): Promise<TaskResponseDTO[]> {
    const result = await this.tasksService.getTasks();

    return result;
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiSecurity('authorization', ['authorization'])
  async getMyTasks(@User() user: IUser): Promise<TaskResponseDTO[]> {
    const result = await this.tasksService.getMyTasks(user.publicId);

    return result;
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiSecurity('authorization', ['authorization'])
  async createTask(
    @Body() body: CreateTaskRequestDTO,
    @User() user: IUser,
  ): Promise<void> {
    const data = {
      creator: user,
      ...body,
    };
    await this.tasksService.createTask(data);
  }

  @Post('shuffle')
  @UseGuards(AuthGuard([UserRoles.ADMIN, UserRoles.MANAGER]))
  @ApiSecurity('authorization', ['authorization'])
  async shuffle(): Promise<void> {
    await this.tasksService.shuffle();
  }

  @Post(':id/complete')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard([UserRoles.POPUG]))
  @ApiSecurity('authorization', ['authorization'])
  async completeTask(
    @Param() params: IdPathParams,
    @User() user: IUser,
  ): Promise<void> {
    const completeTaskData = {
      taskId: params.id,
      userPublicId: user.publicId,
    };

    await this.tasksService.completeTask(completeTaskData);
  }
}
