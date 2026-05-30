import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import  { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    
   async profile(@Req() req):Promise<User|null>{
    return this.usersService.profile(req.user);
   }


}
