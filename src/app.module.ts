import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthMiddleware } from './user/auth.middleware';

import { Car } from './car/car.entity';
import { CarModule } from './car/car.module';
import { CarService } from './car/car.service';
import { CarController } from './car/car.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Car]),
  ],
  controllers: [AppController, UserController, CarController],
  providers: [UserService, CarService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CarController);
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
