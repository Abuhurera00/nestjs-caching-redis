import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { validationSchema } from './validation.schema';
import redisConfig from './redis.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, redisConfig],
            validationSchema,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
    ],
})
export class AppConfigModule { }
