import {
    Body,
    Controller,
    Post,
    HttpException,
    HttpStatus,
    Inject,
    UseGuards,
} from '@nestjs/common';

import { LoginUserDto } from '../../../aplication/dto/login-user.dto';
import { AuthenticateUserUseCase } from '../../../aplication/use-case/authenticate-user.usecase';
import { LogoutUserUseCase } from '../../../aplication/use-case/logout-user.usecase';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { RefreshTokensUseCase } from 'apps/user-service/src/aplication/use-case/refresh-tokens.usecase';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
    constructor(
        @Inject(AuthenticateUserUseCase)
        private readonly authenticateUser: AuthenticateUserUseCase,
        @Inject(LogoutUserUseCase)
        private readonly logoutUser: LogoutUserUseCase,
        @Inject(RefreshTokensUseCase )
        private readonly refreshTokensUseCase: RefreshTokensUseCase,
    ) { }

    @Post('login')
    async login(@Body() body: LoginUserDto): Promise<{ accessToken: string }> {
        try {
            return await this.authenticateUser.execute(body.email, body.password);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

    @Post('logout')
    @MessagePattern('user.get-profile')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser('sub') userId: string): Promise<{ message: string }> {
        try {
            await this.logoutUser.execute(userId);
            return { message: 'Logout successful' };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('refresh-token')
    @UseGuards(JwtRefreshGuard)
    @MessagePattern('auth.refresh')
    async refresh(
      @CurrentUser('sub') userId: string,
      @CurrentUser('refreshToken') refreshToken: string
    ) {
      return this.refreshTokensUseCase.execute(userId, refreshToken);
    }

}