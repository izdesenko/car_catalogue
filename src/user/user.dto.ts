export class LoginDto {
  login: string;
  pass: string;
  submit: string;
}

export class JWTPayload {
  id: number;
  login: string;
}
