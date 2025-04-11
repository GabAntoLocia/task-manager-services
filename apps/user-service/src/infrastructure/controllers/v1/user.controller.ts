import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Inject,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from '../../../aplication/dto/create-user.dto';
import { LoginUserDto } from '../../../aplication/dto/login-user.dto';
import { UserResponseDto } from '../../../aplication/dto/user-response.dto';
import { RegisterUserUseCase } from '../../../aplication/use-case/register-user.usecase';
import { AuthenticateUserUseCase } from '../../../aplication/use-case/auth/authenticate-user.usecase';
import { GetUsersUseCase } from '../../../aplication/use-case/get-users.usecase';
import { User } from '../../../domain/entities/user.entity';
import { GetUserByIdUseCase } from 'apps/user-service/src/aplication/use-case/get-user-by-id.usecase';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {
  constructor(
    @Inject(RegisterUserUseCase)
    private readonly registerUser: RegisterUserUseCase,
    @Inject(GetUsersUseCase)
    private readonly getUserUseCase: GetUsersUseCase,

    @Inject(GetUserByIdUseCase)
    private readonly getUserByIdUseCase: GetUserByIdUseCase,

  ) { }

  @Get()
  async findAll() {
    try {
      const users = await this.getUserUseCase.execute();
      return users.map(user => new UserResponseDto(user as User));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }

  @Get('profile/')
  @MessagePattern('user.get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser('sub') userId: string
  ) {
    try {
      const user = await this.getUserByIdUseCase.execute(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserResponseDto(user as User);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.registerUser.execute(body);
      return new UserResponseDto(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}