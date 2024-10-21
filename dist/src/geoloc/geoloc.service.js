"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const process_1 = require("process");
const rxjs_1 = require("rxjs");
let GeolocService = class GeolocService {
    constructor(http) {
        this.http = http;
    }
    async getGeoloc(lat, lon) {
        const apikey = process_1.env.GEOLOC_API_KEY;
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${apikey}`).pipe((0, rxjs_1.catchError)((error) => {
            return "ERR_" + lat + "_" + lon;
        })));
        return response;
    }
    async getAddressDescByGeoloc(lat, lon) {
        const response = await this.getGeoloc(lat, lon);
        const jsonResponse = response;
        if (jsonResponse.typeof === 'string' && jsonResponse === "ERR_" + lat + "_" + lon) {
            return jsonResponse;
        }
        const address = jsonResponse.data.display_name;
        return address;
    }
};
exports.GeolocService = GeolocService;
exports.GeolocService = GeolocService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GeolocService);
//# sourceMappingURL=geoloc.service.js.map