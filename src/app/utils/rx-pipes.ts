import { Observable, catchError, of, startWith, map } from "rxjs";

export interface Loading<T> { loading: boolean; error: boolean; data: T | null };
export const LOADING_INITIAL_VALUE = { loading: true, error: false, data: null } as const;
export function loading<T>(): (source: Observable<T>) => Observable<Loading<T>> {
    return (source: Observable<T>) => source.pipe(
        map((v) => ({ loading: false, error: false, data: v })),
        startWith(LOADING_INITIAL_VALUE),
        catchError((err) => of({ loading: false, error: true, data: null}))
    )
}

