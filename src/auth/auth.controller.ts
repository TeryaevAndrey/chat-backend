import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    userData: AuthUserDto,
  ) {
    await this.authService.signUp(userData.login, userData.password);

    return {
      message: 'Registration was successful',
    };
  }

  @Post('/sign-in')
  async signIn(
    @Body()
    userData: AuthUserDto,
  ) {
    const { access_token, refresh_token, user } = await this.authService.signIn(
      userData.login,
      userData.password,
    );

    return {
      message: 'You have successfully logged in',
      access_token,
      refresh_token,
      user,
    };
  }
}
