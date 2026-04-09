export type AppConfig = {
    app: {
        port: number;
        env: string;
        apiPrefix: string;
    };
};

export type DatabaseConfig = {
    database: {
        uri: string;
    };
};

export type RedisConfig = {
    redis: {
        host: string;
        port: number;
        password: string;
    };
};

export type AllConfig = AppConfig & DatabaseConfig & RedisConfig;
