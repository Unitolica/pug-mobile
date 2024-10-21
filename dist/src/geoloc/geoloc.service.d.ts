import { HttpService } from '@nestjs/axios';
export declare class GeolocService {
    private http;
    constructor(http: HttpService);
    getGeoloc(lat: string, lon: string): Promise<string | import("axios").AxiosResponse<any, any>>;
    getAddressDescByGeoloc(lat: string, lon: string): Promise<any>;
}
