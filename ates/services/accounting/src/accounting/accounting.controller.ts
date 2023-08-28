import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AccountingService } from './accounting.service';
import { AuthGuard } from '../common/auth.guard';
import { UserRoles } from 'src/common/users.roles';
import { IdPathParams } from './dto/id.path-params.dto';
import { GetLogQueryParams } from './dto/get-log.query.dto';
import { AccountLogResponseDTO } from './dto/log.response.dto';

@Controller('log')
@ApiTags('accounting')
export class TasksController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get(':id')
  @UseGuards(AuthGuard([UserRoles.ADMIN, UserRoles.MANAGER]))
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'date', type: Date })
  @ApiSecurity('authorization', ['authorization'])
  async getAccountLog(
    @Param() params: IdPathParams,
    @Query() query: GetLogQueryParams,
  ): Promise<AccountLogResponseDTO> {
    const result = await this.accountingService.getLog(params.id, query.date);

    return result;
  }
}
