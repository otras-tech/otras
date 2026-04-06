import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { forwardRef } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenCleanupService } from './token-cleanup.service';
import { AuthRepository } from './repository/auth.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    UserModule,
    forwardRef(() => AdminModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Direct process.env access for absolute reliability in production-grade bootstrap
        const secret = (process.env.JWT_ACCESS_SECRET || config.get<string>('JWT_ACCESS_SECRET') || 'secret').trim();
        console.log(`[AUTH-SIGNER-PROOF] Secret Length: ${secret.length}, Prefix: ${secret.substring(0, 4)}...`);
        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
  ],


  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenCleanupService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
