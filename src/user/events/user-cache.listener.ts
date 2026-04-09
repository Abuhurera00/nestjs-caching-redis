import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "src/common/redis/redis.service";
import { USER_EVENTS } from "./user.events";
import { OnEvent } from "@nestjs/event-emitter";
import { CacheKeys } from "src/common/redis/redis.constants";
import { User } from "../schemas/user.schema";

@Injectable()
export class UserCacheListener {
    private readonly logger = new Logger(UserCacheListener.name);

    constructor(
        private readonly redisService: RedisService,
    ) { }

    @OnEvent(USER_EVENTS.CREATED)
    async handleUserCreated(user: User) {
        this.logger.log(`Clearing cache for User Created Event: key ${CacheKeys.USER.all} and email ${user.email}`);
        await this.redisService.del(CacheKeys.USER.all);
    }

    @OnEvent(USER_EVENTS.UPDATED)
    async handleUserUpdated({ id }: { id: string }) {
        this.logger.log(`Clearing cache for User Updated Event: key ${CacheKeys.USER.all} and ${CacheKeys.USER.byId(id)}`);
        await Promise.all([
            this.redisService.del(CacheKeys.USER.all),
            this.redisService.del(CacheKeys.USER.byId(id)),
        ]);
    }

    @OnEvent(USER_EVENTS.DELETED)
    async handleUserDeleted({ id }: { id: string }) {
        this.logger.log(`Clearing cache for User Deleted Event: key ${CacheKeys.USER.all} and ${CacheKeys.USER.byId(id)}`);
        await Promise.all([
            this.redisService.del(CacheKeys.USER.all),
            this.redisService.del(CacheKeys.USER.byId(id)),
        ]);
    }
}