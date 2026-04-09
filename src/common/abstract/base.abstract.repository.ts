import {
  QueryFilter,
  UpdateQuery,
  QueryOptions,
  MongooseUpdateQueryOptions,
  AnyBulkWriteOperation,
  PipelineStage,
  Model,
  Document,
} from 'mongoose';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends Document>
  implements BaseInterfaceRepository<T> {
  protected constructor(private readonly model: Model<T>) { }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const docs = await this.model.insertMany(data);
    return docs as unknown as T[];
  }

  async findOne(
    filter: QueryFilter<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async findById(id: string, options?: QueryOptions<T>): Promise<T | null> {
    return this.model.findById(id, null, options).exec();
  }

  async findAll(
    filter: QueryFilter<T> = {},
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, ...options })
      .exec();
  }

  async updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, ...options })
      .exec();
  }

  async updateMany(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    // options?: QueryOptions<T>,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<{ matched: number; modified: number }> {
    const result = await this.model.updateMany(filter, update, options).exec();
    return {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    };
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteMany(
    filter: QueryFilter<T>,
  ): Promise<{ deleted: number }> {
    const result = await this.model.deleteMany(filter).exec();
    return { deleted: result.deletedCount };
  }

  async aggregate<R = unknown>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline).exec();
  }

  async bulkWrite(
    operations: AnyBulkWriteOperation<any>[],
  ): Promise<{
    ok: number;
    insertedCount: number;
    modifiedCount: number;
    deletedCount: number;
  }> {
    const result = await this.model.bulkWrite(operations);
    return {
      ok: result.ok,
      insertedCount: result.insertedCount,
      modifiedCount: result.modifiedCount,
      deletedCount: result.deletedCount,
    };
  }

  async count(filter: QueryFilter<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return result !== null;
  }
}