import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptService } from '../crypt/crypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private crypt: CryptService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string, ): Promise<{ access_token: string }> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw { statusCode: 404, message: 'Not Found' };
        }

        const validatePassword = await this.crypt.compare(password, user.password);

        if (!validatePassword) {
            throw new UnauthorizedException();
        }

        return this.getToken(user.id, user.email);
    }

    async getToken(sub: string, email: string): Promise<{ access_token: string }> {
        const payload = { sub, email };
        return {access_token: await this.jwtService.signAsync(payload)};
    }
}
