import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'; 


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [
    JwtAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [
    JwtAuthGuard,
    JwtRefreshGuard,
    JwtModule,
  ],
})
export class AuthModule {}