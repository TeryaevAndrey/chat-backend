import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(login: string, password: string) {
    const user = await this.usersService.findUserByLogin(login);

    if (user) {
      throw new ConflictException('A user with that name already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersService.createUser(login, hashedPassword);

    await this.usersService.saveUser(newUser);

    const userDTO = new UserResponseDto(newUser);

    return userDTO;
  }

  async signIn(login: string, password: string) {
    const user = await this.usersService.findUserByLogin(login);

    if (!user) {
      throw new NotFoundException('The user does not exist');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const userDTO = new UserResponseDto(user);

    const payload = { id: user.id };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token,
      user: userDTO,
    };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
