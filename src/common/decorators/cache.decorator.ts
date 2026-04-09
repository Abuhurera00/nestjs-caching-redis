import { SetMetadata } from '@nestjs/common';
import {
    CACHE_KEY,
    CACHE_TTL_METADATA,
} from '../redis/redis.constants';

export const Cacheable = (key?: string, ttl?: number) => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        SetMetadata(CACHE_KEY, key ?? true)(target, propertyKey, descriptor);

        if (ttl) {
            SetMetadata(CACHE_TTL_METADATA, ttl)(
                target,
                propertyKey,
                descriptor,
            );
        }
    };
};
