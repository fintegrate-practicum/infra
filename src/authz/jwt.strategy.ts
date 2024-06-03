import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const config = {
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
        handleSigningKeyError: (err) => console.error(err), // do it better in real app!
      }),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}`,
      algorithms: ["RS256"],
    };
    console.log("====================== config ======================", config);
    super(config);
  }

  async validate(payload: any) {
    const { aud, sub } = payload;
    if (typeof aud !== "string" && aud.length > 0) {
      if (!aud.includes(process.env.AUTH0_AUDIENCE)) {
        throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
      }
    } else if (aud !== process.env.AUTH0_AUDIENCE) {
      throw new HttpException("Invalid audience.", HttpStatus.UNAUTHORIZED);
    }
    return { userId: sub, username: payload.username };
  }
}
