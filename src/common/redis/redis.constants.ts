import { buildCacheKey } from "./redis.utils";

export const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

export const CACHE_TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
} as const;


export const CACHE_KEY = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';


export const CACHE_PREFIX = 'app:v1';

export const CacheKeys = {
    USER: {
        all: buildCacheKey('users'),
        byId: (id: string) => buildCacheKey('users', { id }),
    },
};
