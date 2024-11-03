import { Injectable } from '@angular/core';
import { LocalKeys, UserType } from '../enums/common.enum';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  /**
   * Method to get authenticated token
   * @returns token or null
   */
  private getAccessToken(): string | null {
    return localStorage.getItem(LocalKeys.accessToken);
  }

  /**
   * Method to decode access token
   * @returns current user detail or null
   */
  decodeAccessToken(): User | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1])) as User;
  }

  /**
   * Method to check if the current user is admin or not
   * @returns true or false
   */
  isAdmin(): boolean {
    const user = this.decodeAccessToken();
    if (!user) return false;
    return user.role === UserType.ADMIN;
  }
}
