import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {AuthEntity} from "./entity/auth.entity";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtSerwice: JwtService) {}

    public async login(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        const isPasswordValid = user.password === password;

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            accessToken: this.jwtSerwice.sign({
                userId: user.id
            })
        };
    }
}
