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
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers.authorization.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }

      request.user = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
