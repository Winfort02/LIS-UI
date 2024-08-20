import { Message } from 'primeng/api';

export class CustomResponse<T> {
  response!: Array<T> | T;
  message: Message[] = [];

  constructor(response: T, message: Message[]) {
    this.response = response;
    this.message = message;
  }
}

export class CommonSuccessResponse<T> {
  data!: T[] | T;
  statusCode!: number;
  success!: boolean;
}
