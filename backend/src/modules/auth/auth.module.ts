import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenCleanupService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    PassportModule,
    JwtModule,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
