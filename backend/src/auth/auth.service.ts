import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(loginId: string, pass: string): Promise<any> {
        let user = await this.userService.findByEmail(loginId);
        
        if (!user) {
            user = await this.userService.findByOtrId(loginId);
        }

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, otrId: user.otrId };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(data: any) {
        const user = await this.userService.create(data);
        return this.login(user);
    }
}
