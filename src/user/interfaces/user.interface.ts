import { BaseInterfaceRepository } from "src/common/abstract/base.interface.repository";
import { UserDocument } from "../schemas/user.schema";


export interface UserRepositoryInterface extends BaseInterfaceRepository<UserDocument> { }