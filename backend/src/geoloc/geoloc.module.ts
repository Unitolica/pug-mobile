import { Global, Module } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GeolocService],
  exports: [GeolocService],
})
export class GeolocModule {}
