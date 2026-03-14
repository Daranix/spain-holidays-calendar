import EventEmitter from "node:events";

class CacheEventEmitter extends EventEmitter {};

interface CacheValue<T> {
    data: T,
    expiration: Date
}

class CacheManager {

    private cache = new Map<string, unknown>();
    private subscriberManagerStore = new Map<string, CacheEventEmitter>();

    /**
     * The objective of this method is avoid multiple calls to an API or external service and also cache that data for specific time.
     * For that, if the request to fetch the data is in progress it creates a event emitter where the next calls to the method can subscribe.
     * When the fetch of the data is completed the data is stored on the cache and the subscribers are notified with the data.
     * @param key - Key used to identify the data.
     * @param method - Method used to fetch the data 
     * @param cacheTime - Time to cache the data (in ms)
     * @returns
     */
    async register<T>(key: string, method: () => Promise<T>, cacheTime: number): Promise<T> {

        const cacheData = this.getData<T>(key);
        const now = new Date().getTime();

        // If the data is already cached and not expired, just return it :)
        if (cacheData && now <= cacheData.expiration.getTime()) {
            return cacheData.data;
        }

        // If something is already fetching this key, wait for the event
        if (this.subscriberManagerStore.has(key)) {
            const eventManager = this.subscriberManagerStore.get(key)!;
            return new Promise((resolve, reject) => {
                // We use 'once' to avoid memory leaks
                eventManager.once('value', (value: any) => resolve(value));
                eventManager.once('error', (err: any) => reject(err));
            });
        }

        // Otherwise, we are the ones who fetch the data
        const subscriberManager = new CacheEventEmitter();
        this.subscriberManagerStore.set(key, subscriberManager);

        try {
            const result = await method();
            const data = { data: result, expiration: new Date(now + cacheTime) } satisfies CacheValue<T>;
            this.storeData(key, data);
            subscriberManager.emit('value', result);
            this.subscriberManagerStore.delete(key);
            return result;
        } catch (ex) {
            this.subscriberManagerStore.delete(key);
            subscriberManager.emit('error', ex);
            throw ex;
        }
    }

    private getData<T>(key: string): CacheValue<T> | undefined {
        return this.cache.get(key) as CacheValue<T>;
    }

    private storeData(key: string, data: CacheValue<unknown>): void {
        this.cache.set(key, data)
    }

}

export const MemoryCacheStorage = new CacheManager();