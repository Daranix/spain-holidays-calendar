import { Injectable, PLATFORM_ID, REQUEST, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Capacitor } from "@capacitor/core";
import { FindFestivosProvinciaResponse } from "@/shared/models/output/find-festivos-provincia.response";
import { FindFestivosProvinciaRequest } from "@/shared/models/input/find-festivos-provincia.request";
import { FindProvinciasResponse } from "@/shared/models/output/find-provincias.response";
import { FindYearResponse } from "@/shared/models/output/find-years.response";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });

  // Determinamos la base URL una sola vez
  private readonly API_BASE_URL = this.determineBaseUrl();

  private determineBaseUrl(): string {

    if (Capacitor.isNativePlatform()) {
      return environment.capacitorApiBaseUrl;
    }

    return '/api';
  }

  findFestivosProvincia({ provincia, year }: FindFestivosProvinciaRequest): Observable<FindFestivosProvinciaResponse> {
    return this.httpClient.get<FindFestivosProvinciaResponse>(`${this.API_BASE_URL}/festivos/${provincia}/${year}`);
  }

  getYears(): Observable<FindYearResponse> {
    return this.httpClient.get<FindYearResponse>(`${this.API_BASE_URL}/years`);
  }

  getProvincias(): Observable<FindProvinciasResponse> {
    return this.httpClient.get<FindProvinciasResponse>(`${this.API_BASE_URL}/provincias`);
  }

  getPing(): Observable<any> {
    return this.httpClient.get<any>(`${this.API_BASE_URL}/ping`);
  }
}
