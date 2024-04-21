import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Capacitor } from "@capacitor/core";
import { environmnet } from "../../environments/environment";
import { FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindFestivosProvinciaRequest } from "@/shared/models/input/find-festivos-provincia.request";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";
import { FindYearResponse } from "@/shared/models/output/find-years.response";

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly API_BASE_URL = this.baseUrl(this.platformId);

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  private baseUrl(platformId: Object) {
    let url = '/api';
    if(isPlatformServer(platformId)) {
      const envBaseUrl = process.env['BASE_URL'] ? `${process.env['BASE_URL']}/api` : 'http://localhost:4200/api';
      if(!envBaseUrl) {
        throw new Error('BASE_URL env variable not specified')
      }
      url = envBaseUrl;
    } else if(isPlatformBrowser(platformId) && Capacitor.isNativePlatform()) {
      url = `${environmnet.capacitorApiBaseUrl}/api`;
    }
    return url;
  }
  
  findFestivosProvincia({ provincia, year }: FindFestivosProvinciaRequest): Observable<FindFestivosProvinciaResponse> {
    const url = (`${this.API_BASE_URL}/festivos/${provincia}/${year}`);
    return this.httpClient.get<FindFestivosProvinciaResponse>(url);
  }

  getYears(): Observable<FindYearResponse> {
    const url = (`${this.API_BASE_URL}/years`)
    return this.httpClient.get<FindYearResponse>(url);
  }

  getProvincias(): Observable<FindProvinciasResponse> {
    const url = (`${this.API_BASE_URL}/provincias`)
    return this.httpClient.get<FindProvinciasResponse>(url);
  }
}
