export declare class CryptService {
    encrypt(originalPassword: string): Promise<string>;
    compare(originalPassword: string, hashedPassword: string): Promise<boolean>;
}
