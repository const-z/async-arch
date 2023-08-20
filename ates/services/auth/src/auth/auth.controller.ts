import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { StatusDescription } from '../status.description';
import { LoginRequestDTO, LoginResponseDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StatusDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: StatusDescription.BAD_REQUEST })
  @ApiForbiddenResponse({
    description: StatusDescription.WRONG_LOGIN_OR_PASSWORD,
  })
  @ApiInternalServerErrorResponse({
    description: StatusDescription.INTERNAL_SERVER_ERROR,
  })
  async loginUser(@Body() body: LoginRequestDTO): Promise<LoginResponseDTO> {
    const token = await this.authService.login(body);

    return token;
  }
}
