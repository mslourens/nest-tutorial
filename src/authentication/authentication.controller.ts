import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import RegisterDto from 'src/authentication/dto/register.dto';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './guards/jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './request-with-user';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  async login(
    @Req() requestWithUser: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = requestWithUser;
    const token = this.authenticationService.getJwtToken(user.id);
    response.status(200).json({ user, token });
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    return user;
  }
}
