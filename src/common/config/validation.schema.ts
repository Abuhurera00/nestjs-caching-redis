import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

    PORT: Joi.number().default(3000),

    DB_URI: Joi.string().required(),

    API_PREFIX: Joi.string().default('api'),

    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().optional(),
});
