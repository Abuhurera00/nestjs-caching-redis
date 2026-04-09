import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_EVENTS } from './events/user.events';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    this.eventEmitter.emit(USER_EVENTS.CREATED, user);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return {
      message: 'User fetched successfully',
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.updateById(id, updateUserDto);
    this.eventEmitter.emit(USER_EVENTS.UPDATED, { id });
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.delete(id);
    this.eventEmitter.emit(USER_EVENTS.DELETED, { id });
    return {
      message: 'User deleted successfully',
      data: user,
    };
  }
}
