import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(
      private readonly configService: ConfigService,
    private authService: AuthService,
    ){
     super({
      clientID:configService.get<string>("GOOGLE_CLIENT_ID") as string,
      clientSecret:configService.get<string>("GOOGLE_CLIENT_SECRET_KEY") as string,
      callbackURL:configService.get<string>("GOOGLE_CALLBACK_URL") as string,
      scope: ["email", "profile"],
      
     })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: Error | null, user?: any) => void): Promise<any> {

      const {name,emails,photos} = profile
      const googleUser = {
          email: emails?.[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0].value,
      googleId: profile?.id,
      }
      const user = await this.authService.createOrFindUser(googleUser);
    done(null, user);
        
    }



}