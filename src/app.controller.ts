import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  start(@Res() res) {
    res.redirect('/car');
  }
}
