import { BadGatewayException, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)private UserModel:Model<User>
  ) {
    
  }

async findOne(email:string):Promise<User|null>{
  try {
    const user = await this.UserModel.findOne({email:email});
    return user;
  } catch (error) {
    throw new BadGatewayException(error);
  }
}

async createUserByGoogle(googleUser:{
  email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
}):Promise<User>{
  try {
    const user = await this.UserModel.create({
      email:googleUser.email,
      firstName:googleUser.firstName,
      lastName:googleUser.lastName,
      picture:googleUser.picture,
      googleId:googleUser.googleId,

      role:'user',
      level:'level1'
    });
    return user;
  } catch (error) {
    throw new BadGatewayException(error);
  }
}

async findById(id: string): Promise<User | null> {
  try {
    const user = await this.UserModel.findById(id);
    return user;
  } catch (error) {
    throw new BadGatewayException(error);
  }
}

async profile(reqUser):Promise<User|null>{
  try {
    
    const user = await this.UserModel.findOne({googleId:reqUser.googleId});
    
    return user;
  } catch (error) {
    throw new BadGatewayException(error);
  }
}



  
}
