import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    
    // Get backend URL from environment or construct from request origin
    const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:4000';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || `${backendUrl}/auth/google/callback`;

    if (!clientID || !clientSecret) {
      throw new Error('Google OAuth credentials are missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      fullName: name.givenName + ' ' + name.familyName,
      avatar: photos[0]?.value,
      provider: 'google',
      accessToken,
    };
    done(null, user);
  }
}

