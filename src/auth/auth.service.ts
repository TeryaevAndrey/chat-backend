import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRes } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async signUp(login: string, password: string) {
    const user = await this.usersService.findUserByLogin(login);

    if(user) {
        throw new NotFoundException("A user with that name already exists");
    }

    const newUser =  
  }
}
