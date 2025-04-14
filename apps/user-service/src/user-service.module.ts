import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserPrismaRepository } from '../prisma/user.repository';
import { RegisterUserUseCase } from './aplication/use-case/user/register-user.usecase';
import { AuthenticateUserUseCase } from './aplication/use-case/auth/authenticate-user.usecase';
import { UserControllerV1 } from './infrastructure/controllers/v1/user.controller';
import { GetUsersUseCase } from './aplication/use-case/user/get-users.usecase';
import { GenerateTokensUseCase } from './aplication/use-case/auth/generate-token-usecase';
import { GetUserByIdUseCase } from './aplication/use-case/user/get-user-by-id.usecase';
import { AuthControllerV1 } from './infrastructure/controllers/v1/auth.controller';
import { LogoutUserUseCase } from './aplication/use-case/auth/logout-user.usecase';
import { RefreshTokensUseCase } from './aplication/use-case/auth/refresh-tokens.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../libs/auth/src/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../../libs/auth/src/guards/jwt-refresh.guard';
import { AuthModule } from '@app/libs/auth';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    AuthModule,
    // Configuración para que también pueda actuar como cliente de otros microservicios
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002
        }
      }
    ])
  ],
  controllers: [UserControllerV1, AuthControllerV1],
  providers: [
    ConfigService,
    PrismaService,
    JwtAuthGuard,
    JwtRefreshGuard,
    {
      provide: UserPrismaRepository,
      useFactory: (prismaService: PrismaService) => new UserPrismaRepository(prismaService),
      inject: [PrismaService],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (userRepo: UserPrismaRepository) => new GetUsersUseCase(userRepo),
      inject: [UserPrismaRepository],
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: UserPrismaRepository) => new RegisterUserUseCase(repo),
      inject: [UserPrismaRepository],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (repo: UserPrismaRepository, jwt: GenerateTokensUseCase) =>
        new AuthenticateUserUseCase(repo, jwt),
      inject: [UserPrismaRepository, GenerateTokensUseCase],
    },
    {
      provide: GenerateTokensUseCase,
      useFactory: (jwtService: JwtService) => new GenerateTokensUseCase(jwtService),
      inject: [JwtService],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepo: UserPrismaRepository) => new GetUserByIdUseCase(userRepo),
      inject: [UserPrismaRepository],
    },
    {
      provide: LogoutUserUseCase,
      useFactory: (userRepo: UserPrismaRepository) => new LogoutUserUseCase(userRepo),
      inject: [UserPrismaRepository],
    },
    {
      provide: RefreshTokensUseCase,
      useFactory: (userRepo: UserPrismaRepository, jwt: GenerateTokensUseCase) =>
        new RefreshTokensUseCase(userRepo, jwt),
      inject: [UserPrismaRepository, GenerateTokensUseCase],
    }
  ],
  exports: [
    // Exportar servicios que puedan ser consumidos por otros módulos
    AuthenticateUserUseCase,
    GenerateTokensUseCase,
    UserPrismaRepository
  ]
})
export class UserServiceModule { }