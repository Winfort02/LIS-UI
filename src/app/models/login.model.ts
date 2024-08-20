import { ILogin } from '../interfaces/login.interface';

export class Login implements ILogin {
  email!: string;
  password!: string;
}
