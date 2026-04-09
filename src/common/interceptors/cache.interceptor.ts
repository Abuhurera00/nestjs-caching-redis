import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../redis/redis.service';
import {
    CACHE_KEY,
    CACHE_TTL_METADATA,
    CACHE_PREFIX,
    CACHE_TTL,
} from '../redis/redis.constants';
import { buildCacheKey } from '../redis/redis.utils';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CacheInterceptor.name);
    constructor(
        private readonly reflector: Reflector,
        private readonly redisService: RedisService,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const cacheKeyMeta = this.reflector.get<string | boolean>(
            CACHE_KEY,
            context.getHandler(),
        );


        if (!cacheKeyMeta) {
            this.logger.log('No cache key metadata found');
            return next.handle();
        }

        const ttl =
            this.reflector.get<number>(
                CACHE_TTL_METADATA,
                context.getHandler(),
            ) ?? CACHE_TTL.MEDIUM;

        const request = context.switchToHttp().getRequest();

        const key =
            typeof cacheKeyMeta === 'string'
                ? buildCacheKey(
                    cacheKeyMeta,
                    request.params,
                    request.query,
                )
                : buildCacheKey(`${request.method}:${request.url}`);;

        const cached = await this.redisService.get(key);

        if (cached) {
            this.logger.log(`Cache hit for key: ${key}`);
            return of(cached);
        }

        return next.handle().pipe(
            tap(async (response) => {
                await this.redisService.set(key, response, ttl);
                this.logger.log(`Cache miss for key: ${key}`);
            }),
        );
    }
}
