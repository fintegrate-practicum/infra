import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { UserService } from '../user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const config = {
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
        handleSigningKeyError: (err) =>{ console.error(err)
          throw new HttpException("Error retrieving signing key.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        , // do it better in real app!
      }),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}`,
      algorithms: ["RS256"],
    };
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
    const user = await this.userService.getUserById(sub);
    if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
    }
    
    return user;
  }
}
