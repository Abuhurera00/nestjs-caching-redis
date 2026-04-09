import {
    QueryFilter,
    UpdateQuery,
    QueryOptions,
    PipelineStage,
    AnyBulkWriteOperation,
    Document,
} from 'mongoose';

export interface BaseInterfaceRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    createMany(data: Partial<T>[]): Promise<T[]>;

    findOne(filter: QueryFilter<T>, options?: QueryOptions<T>): Promise<T | null>;
    findById(id: string, options?: QueryOptions<T>): Promise<T | null>;
    findAll(filter?: QueryFilter<T>, options?: QueryOptions<T>): Promise<T[]>;

    updateById(
        id: string,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<T | null>;
    updateOne(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<T | null>;
    updateMany(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<{ matched: number; modified: number }>;

    delete(id: string): Promise<T | null>;
    deleteMany(filter: QueryFilter<T>): Promise<{ deleted: number }>;

    aggregate<R = unknown>(pipeline: PipelineStage[]): Promise<R[]>;
    bulkWrite(
        operations: AnyBulkWriteOperation<any>[],
    ): Promise<{ ok: number; insertedCount: number; modifiedCount: number; deletedCount: number }>;

    count(filter?: QueryFilter<T>): Promise<number>;
    exists(filter: QueryFilter<T>): Promise<boolean>;
}