import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';

@Module({

  imports:[
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    
    
  ],
  controllers:[AuthController],
  providers: [AuthService,GoogleStrategy,JwtStrategy]
})
export class AuthModule {}
