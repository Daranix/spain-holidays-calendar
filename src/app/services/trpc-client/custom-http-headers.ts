import { HttpHeaders } from "@angular/common/http";

export class CustomHttpHeaders extends HttpHeaders {

    constructor(httpHeaders: HttpHeaders) {
        super()
        Object.assign(this, httpHeaders);
    }

    forEach(
        callbackfn: (value: string, key: string) => void,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        thisArg?: any,
    ): void {

        const keys = this.keys();

        for (const key of keys) {
            const value = this.get(key);
            callbackfn.call(thisArg, value as string, key);
        }
    }

}