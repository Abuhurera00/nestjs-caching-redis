import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
    constructor(@Inject(REDIS_CLIENT_TOKEN) private readonly redis: Redis) { }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(
        key: string,
        value: unknown,
        ttlSeconds?: number,
    ): Promise<void> {
        const stringValue = JSON.stringify(value);

        if (ttlSeconds) {
            await this.redis.set(key, stringValue, 'EX', ttlSeconds);
        } else {
            await this.redis.set(key, stringValue);
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1;
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    async remember<T>(
        key: string,
        ttl: number,
        callback: () => Promise<T>,
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached) return cached;

        const fresh = await callback();

        await this.set(key, fresh, ttl);

        return fresh;
    }
}
