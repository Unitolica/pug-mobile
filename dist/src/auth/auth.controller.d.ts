import { VerifyUserDto } from './dto/verify-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    validateUser(verifyUserDto: VerifyUserDto, response: Response): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
