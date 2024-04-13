import { HttpResponse } from "@angular/common/http";
import { HeadersEsque, ResponseEsque, ResponseType } from "@trpc/client/dist/internals/types";
import { CustomHttpHeaders } from "./custom-http-headers";

export class CustomHttpResponse<T> implements ResponseEsque {

    headers: HeadersEsque;
    ok: boolean;
    status: number;
    statusText: string;
    type: ResponseType;
    url: string;
    redirected: boolean;

    constructor(private httpResponse: HttpResponse<T>) {
        this.headers = new CustomHttpHeaders(this.httpResponse.headers);
        Object.assign(this, httpResponse);
        this.redirected = [301, 302, 307, 308].includes(httpResponse.status);
        this.status = this.httpResponse.status;
        this.statusText = this.httpResponse.statusText;
        this.ok = this.httpResponse.ok;
        this.type = 'basic';
        this.url = this.httpResponse.url!;
    }



    clone(): ResponseEsque {
        return new CustomHttpResponse(this.httpResponse.clone());
    }

    async json(): Promise<T> {
        return this.httpResponse.body!;
    }



}