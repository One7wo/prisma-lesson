import {PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    public async validate(payload: {userId: number}) {
        const user = await this.usersService.findOne(payload.userId);
        if(!user) {
            throw new UnauthorizedException();
        }
        return user
    }
}