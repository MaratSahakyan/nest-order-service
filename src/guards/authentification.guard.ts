import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthentificationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      if (!token) {
        console.log('ssss');
        throw new UnauthorizedException();
      }

      console.log('token', token);

      console.log('aaaaa');
      request.user = await this.jwtService.verify(token);
      console.log('request.user', request.user);
    } catch (error) {
      console.log('lll', error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
