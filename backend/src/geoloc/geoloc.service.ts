import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { VerifyGeolocDto } from './dto/verify-geoloc.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GeolocService {
  constructor(private http: HttpService) { }

  async getGeoloc(lat: string, lon: string) {
    const apikey = env.GEOLOC_API_KEY;
    const response = await firstValueFrom(
      this.http.get(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${apikey}`).pipe(
        catchError((error: AxiosError) => {
          return "ERR_" + lat + "_" + lon;
        }),
      ),
    );
    return response;
  }

  async getAddressDescByGeoloc(lat: string, lon: string) {
    const response = await this.getGeoloc(lat, lon);

    const jsonResponse = response as any;

    if (jsonResponse.typeof === 'string' && jsonResponse === "ERR_" + lat + "_" + lon) {
      return jsonResponse;
    }

    const address = jsonResponse.data.display_name;
    return address;
  }

}
