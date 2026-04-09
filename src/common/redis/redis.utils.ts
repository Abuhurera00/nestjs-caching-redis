import { CACHE_PREFIX } from '../redis/redis.constants';

export const buildCacheKey = (
    base: string,
    params?: Record<string, any>,
    query?: Record<string, any>,
) => {
    let key = `${CACHE_PREFIX}:${base}`;

    if (params && Object.keys(params).length > 0) {
        key += `:${Object.values(params).join(':')}`;
    }

    if (query && Object.keys(query).length > 0) {
        key += `:q=${JSON.stringify(query)}`;
    }

    return key;
};
