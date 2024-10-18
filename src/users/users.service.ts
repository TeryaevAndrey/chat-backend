import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async findUserByLogin(login: string) {
    return await this.UserRepository.findOneBy({ login });
  }

  async getAllUsers() {
    return await this.UserRepository.find();
  }

createUser(login: string, password: string) {
    const newUser = this.UserRepository.create({
      login,
      password,
    });

    return newUser;
  }

  async saveUser(user: User) {
    return await this.UserRepository.save(user);
  }
}
