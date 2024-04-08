import { Inject, Injectable, PLATFORM_ID, inject } from "@angular/core";
import { CreateTRPCProxyClient, createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from '../../../server/application/trpc';
import { Observable, firstValueFrom, from } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FetchEsque } from "@trpc/client/dist/internals/types";
import { CustomHttpResponse } from "./custom-http-response";
import { DiaFestivo, Mes } from "@/shared/models/common";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Capacitor } from "@capacitor/core";
import { environmnet } from "../environments/environment";

type TRPCClient = typeof createTRPCProxyClient<AppRouter>;
@Injectable({ providedIn: 'root' })
export class TRPCClientService {

  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private customFetch: FetchEsque = async (input, init) => {
    const response = await firstValueFrom(this.httpClient.request<unknown>(init?.method || 'GET', input.toString(), { body: init?.body, observe: 'response' }));
    return new CustomHttpResponse(response);
  };

  private client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: this.baseUrl(this.platformId),
        fetch: this.customFetch
      })
    ],
  });

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  private baseUrl(platformId: Object) {
    let url = '/api';
    if(isPlatformServer(platformId)) {
      const envBaseUrl = process.env['BASE_URL'];
      if(!envBaseUrl) {
        throw new Error('BASE_URL env variable not specified')
      }
      url = envBaseUrl;
    } else if(isPlatformBrowser(platformId) && Capacitor.isNativePlatform()) {
      url = environmnet.capacitorApiBaseUrl;
    }
    return url;
  }

  findFestivosProvincia(provincia: string, year: number): Observable<Record<string, Array<DiaFestivo>>> {
    return from(this.client.findFestivosProvincia.query({ provincia, year }));
  }

  getYears() {
    return from(this.client.getYears.query());
  }

  getProvincias() {
    return from(this.client.getProvincias.query());
  }

};