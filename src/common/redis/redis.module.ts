import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [
        {
            provide: REDIS_CLIENT_TOKEN,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return new Redis({
                    host: config.get('redis.host'),
                    port: config.get('redis.port'),
                    // password: config.get('redis.password'),
                });
            },
        },
        RedisService
    ],
    exports: [REDIS_CLIENT_TOKEN, RedisService],
})
export class RedisModule { }
