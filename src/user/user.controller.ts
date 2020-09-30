import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  index(@Req() req, @Res() res, err) {
    res.redirect(`/user/${req.authUser ? req.authUser.id : 'login'}`);
  }

  @Get('login')
  loginForm(@Req() req, @Res() res, err) {
    if (req.authUser) {
      res.redirect(`/user/${req.authUser.id}`);
    } else {
      res.render('user/login');
    }
  }

  @Post('login')
  async loginSubmit(@Req() req, @Res() res, @Body() loginDto: LoginDto) {
    if (req.authUser) {
      return res.redirect(`/user/${req.authUser.id}`);
    }

    let user: User;
    if (loginDto.submit == 'Register') {
      user = await this.userService.regByLoginDto(loginDto);
    } else {
      user = await this.userService.findByLoginDto(loginDto);
    }

    let url = '/user/login';
    if (user) {
      url = `/user/${user.id}`;
      const accessToken: string = this.userService.getJWTToken(user);
      res.cookie('jwt', accessToken);
    }

    res.redirect(url);
  }

  @Get(':id')
  async getUser(@Req() req, @Res() res, @Param('id') id: number) {
    const user = await this.userService.findById(id);
    if (user) {
      res.render('user/profile', { user, authUser: req.authUser });
    } else {
      res.status(404).end();
    }
  }

  @Post('logout')
  async logoutUser(@Req() req, @Res() res, @Param('id') id: number) {
    res.clearCookie('jwt');
    res.redirect('/car');
  }
}
