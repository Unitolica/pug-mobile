import { UserService } from '../user/user.service';
import { CryptService } from '../crypt/crypt.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private crypt;
    private jwtService;
    constructor(userService: UserService, crypt: CryptService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        access_token: string;
    }>;
    getToken(sub: string, email: string): Promise<{
        access_token: string;
    }>;
}
