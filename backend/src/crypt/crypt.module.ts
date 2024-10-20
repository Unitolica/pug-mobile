import { Global, Module } from '@nestjs/common';
import { CryptService } from './crypt.service';

@Global()
@Module({
  providers: [CryptService],
  exports: [CryptService],
})
export class CryptModule {}
