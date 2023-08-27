import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { StatusDescription } from '../common/status.description';
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
  async loginUser(@Body() body: LoginRequestDTO): Promise<LoginResponseDTO> {
    const token = await this.authService.login(body);

    return token;
  }
}
