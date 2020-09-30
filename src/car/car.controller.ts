import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth.guard';
import { CarService } from './car.service';
import { CarEditDto } from './car.dto';
import { Car } from './car.entity';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async list(@Req() req, @Res() res) {
    const cars: Car[] = await this.carService.findAll();
    res.render('car/list', { cars, authUser: req.authUser });
  }

  @Get('/edit/:id?')
  @UseGuards(AuthGuard)
  async editCar(@Req() req, @Res() res, err) {
    let car: Car;

    if (req.params.id) {
      car = await this.carService.findById(req.params.id);
    }
    res.render('car/edit', { car, authUser: req.authUser });
  }

  @Post('/edit/:id?')
  @UseGuards(AuthGuard)
  async saveCar(@Req() req, @Res() res, @Body('name') name: string, err) {
    const up: CarEditDto = {
      id: req.params.id,
      name,
    };

    try {
      if (!name) {
        throw new Error('Name should not be empty');
      }
      const car: Car = await this.carService.editCar(up);

      res.redirect(`/car/${car.id}`);
    } catch (ex) {
      res.render('car/edit', { car: up, error: ex.toString() });
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteCar(@Req() req, @Res() res, @Param('id') id: number) {
    try {
      await this.carService.deleteCarById(id);

      res.status(200).end();
    } catch (ex) {
      res.status(400).send(ex.toString());
    }
  }

  @Get(':id')
  async showCar(@Req() req, @Res() res, @Param('id') id: number) {
    const car: Car = await this.carService.findById(id);
    res.render('car/show', { car, authUser: req.authUser });
  }
}
