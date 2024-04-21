import EventEmitter from "node:events";

class CacheEventEmitter extends EventEmitter {};

interface CacheValue<T> {
    data: T,
    expiration: Date
}

class CacheManager {

    private cache = new Map<string, unknown>();
    private subscriberManagerStore = new Map<string, CacheEventEmitter>

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

        const cacheData = this.getData(key);
        const now = new Date().getTime();

        // If there's no cache data or the data expired
        if(!cacheData || now > cacheData.expiration.getTime()) {
            
            // If there's no event emitter associated to that get ...
            if(!this.subscriberManagerStore.has(key)) {

                // Create event emitter
                const subscriberManager = new CacheEventEmitter();
                this.subscriberManagerStore.set(key, subscriberManager);

                // Run the method to fetch the data
                try {
                    const result = await method();
                    const data = { data: result, expiration: new Date(now + cacheTime) } satisfies CacheValue<T>;
                    this.storeData(key, data); // Store the data into the cache
                    subscriberManager.emit('value', result);
                    this.subscriberManagerStore.delete(key); // Delete event emitter
                    return result;
                } catch(ex) {
                    this.subscriberManagerStore.delete(key);
                    subscriberManager.emit('error', ex);
                    throw ex;
                }
            }

            // This is executed only when the fetch of the data is in progress to avoid duplicated calls to the method.

            const eventManager = this.subscriberManagerStore.get(key)!;

            return new Promise((resolve, reject) => {

                eventManager.on('value', (value: T) => {
                    resolve(value);
                });

                eventManager.on('error', (err) => {
                    reject(err)
                });

            });

        }

        // If the data is already cached just return it :)

        return this.getData<T>(key)!.data;

    }

    private getData<T>(key: string): CacheValue<T> | undefined {
        return this.cache.get(key) as CacheValue<T>;
    }

    private storeData(key: string, data: CacheValue<unknown>): void {
        this.cache.set(key, data)
    }

}

export const MemoryCacheStorage = new CacheManager();