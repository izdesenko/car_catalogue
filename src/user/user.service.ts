import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { User } from './user.entity';
import { LoginDto, JWTPayload } from './user.dto';

const PASSWORD_SECRET = 'G8)cceeQLNm9U-]&t';
const ACCESS_TOKEN_SECRET = 'swsh23hjddnns';
const ACCESS_TOKEN_LIFE = 2 * 24 * 60 * 60;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByLoginDto(loginDto: LoginDto): Promise<User> {
    return this.userRepository.findOne({
      login: loginDto.login,
      pass: this.hashPass(loginDto.pass),
    });
  }

  async regByLoginDto(loginDto: LoginDto): Promise<User> {
    const user = new User();
    user.login = loginDto.login;
    user.pass = this.hashPass(loginDto.pass);

    return await this.userRepository.save(user);
  }

  hashPass(pass: string): string {
    return crypto
      .createHmac('sha256', PASSWORD_SECRET)
      .update(pass)
      .digest('hex');
  }

  getJWTToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      login: user.login,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: ACCESS_TOKEN_LIFE,
    });
  }

  async getUserByJWTToken(token: string): Promise<User> {
    const data: JWTPayload | null =
      token && jwt.verify(token, ACCESS_TOKEN_SECRET);
    return data && data.id && (await this.userRepository.findOne(data.id));
  }

  verifyJWTToken(token: string): boolean {
    const data: JWTPayload | null =
      token && jwt.verify(token, ACCESS_TOKEN_SECRET);
    return Boolean(data && data.id);
  }
}
