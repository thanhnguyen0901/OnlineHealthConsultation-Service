import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getRequiredEnv } from '../../../common/config/env.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getRequiredEnv('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, role: payload.role };
  }
}
