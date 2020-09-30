import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { Car } from './car.entity';
import { CarEditDto } from './car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }

  findById(id: number): Promise<Car> {
    return this.carRepository.findOne(id);
  }

  async editCar(carEditDto: CarEditDto): Promise<Car> {
    let car: Car;
    if (carEditDto.id) {
      car = await this.carRepository.findOne(carEditDto.id);
    } else {
      car = new Car();
    }

    car.name = carEditDto.name;

    return this.carRepository.save(car);
  }

  deleteCarById(id: number) {
    return this.carRepository.delete(id);
  }
}
