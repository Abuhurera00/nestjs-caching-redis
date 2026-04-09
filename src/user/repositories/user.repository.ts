import { BaseAbstractRepository } from "src/common/abstract/base.abstract.repository";
import { User, UserDocument } from "../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRepositoryInterface } from "../interfaces/user.interface";


export class UserRepository extends BaseAbstractRepository<UserDocument> implements UserRepositoryInterface {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel);
    }
}