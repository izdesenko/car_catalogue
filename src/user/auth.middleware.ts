import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(req: Request, res: Response, next: Function) {
    this.userService
      .getUserByJWTToken(req.cookies.jwt)
      .then(user => ((<any>req).authUser = user))
      .catch(ex => console.log('Auth Middleware ex:: ', ex))
      .then(() => next());
  }
}
