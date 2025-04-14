import { Inject, NotFoundException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../../../aplication/dto/create-user.dto';
import { UserResponseDto } from '../../../aplication/dto/user-response.dto';
import { RegisterUserUseCase } from '../../../aplication/use-case/user/register-user.usecase';
import { GetUsersUseCase } from '../../../aplication/use-case/user/get-users.usecase';
import { User } from '../../../domain/entities/user.entity';
import { GetUserByIdUseCase } from '../../../aplication/use-case/user/get-user-by-id.usecase';
import { JwtAuthGuard } from '../../../../../../libs/auth/src/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../../../libs/auth/src/decorators/current-user.decorator';
export class UserControllerV1 {
  constructor(
    @Inject(GetUsersUseCase)
    private readonly getUserUseCase: GetUsersUseCase,
    @Inject(GetUserByIdUseCase)
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) { }

  @MessagePattern({ cmd: 'users.v1.findAll' })
  async findAll() {
    const users = await this.getUserUseCase.execute();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users.map(user => new UserResponseDto(user as User));
  }

  @MessagePattern({ cmd: 'v1.api.users.profile' })
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser('sub') userId: string
  ) {
    console.log("User ID:", userId);
    const user = await this.getUserByIdUseCase.execute(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user as User);
  }

}