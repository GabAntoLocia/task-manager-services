import {
  Inject,
  UseGuards,
  Controller,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthenticateUserUseCase } from '../../../aplication/use-case/auth/authenticate-user.usecase';
import { LogoutUserUseCase } from '../../../aplication/use-case/auth/logout-user.usecase';
import { RefreshTokensUseCase } from '../../../aplication/use-case/auth/refresh-tokens.usecase';
import { JwtAuthGuard } from '../../../../../../libs/auth/src/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../../../../../libs/auth/src/guards/jwt-refresh.guard';
import { CurrentUser } from '../../../../../../libs/auth/src/decorators/current-user.decorator';
import { LoginUserDto } from '../../../aplication/dto/login-user.dto';
import { UserResponseDto } from 'apps/user-service/src/aplication/dto/user-response.dto';
import { CreateUserDto } from 'apps/user-service/src/aplication/dto/create-user.dto';
import { RegisterUserUseCase } from 'apps/user-service/src/aplication/use-case/user/register-user.usecase';

@Controller()
export class AuthControllerV1 {
  constructor(
    @Inject(AuthenticateUserUseCase)
    private readonly authenticateUser: AuthenticateUserUseCase,
    @Inject(LogoutUserUseCase)
    private readonly logoutUser: LogoutUserUseCase,
    @Inject(RefreshTokensUseCase)
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    @Inject(RegisterUserUseCase)
    private readonly registerUser: RegisterUserUseCase,
  ) { }

  @MessagePattern({ cmd: 'v1.api.auth.login' })
  async login(@Payload() body: LoginUserDto): Promise<{ accessToken: string }> {
    return await this.authenticateUser.execute(body.email, body.password);
  }

  @MessagePattern({ cmd: 'v1.api.auth.logout' })
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser('sub') userId: string): Promise<{ message: string }> {
    await this.logoutUser.execute(userId);
    return { message: 'Logout successful' };
  }

  @MessagePattern({ cmd: 'v1.api.auth.refresh' })
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser('sub') userId: string,
    @CurrentUser('refreshToken') refreshToken: string
  ) {
    return this.refreshTokensUseCase.execute(userId, refreshToken);
  }

  @MessagePattern({ cmd: 'v1.api.auth.register' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Payload() body: CreateUserDto): Promise<UserResponseDto> {

    console.log("Registering user:", body);
    // Las validaciones del DTO ya lanzarán BadRequestException automáticamente
    const user = await this.registerUser.execute(body);
    return new UserResponseDto(user);
  }
}