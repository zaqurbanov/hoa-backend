import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService,){}

@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth(){

}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
googleCallback(@Req() req) {
   
    const tokens = this.authService.generateTokens(req.user);

    
    return {
      message: 'Uğurla giriş edildi',
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
      },
      ...tokens,
    };
  }

}
