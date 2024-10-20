import { Injectable } from '@nestjs/common';
import { compare, hash as hashFunc } from 'bcrypt';

@Injectable()
export class CryptService {
    async encrypt(originalPassword: string): Promise<string> {
        const hash = await hashFunc(originalPassword, 1);
        return hash;
    }

    async compare(originalPassword: string, hashedPassword: string): Promise<boolean> { 
        const result = await compare(originalPassword, hashedPassword);
        return result;
    }
}
