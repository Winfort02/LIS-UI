import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { TokenService } from '../services/token.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (commonService.isLogin() && tokenService.isAdmin()) {
    router.navigate(['/application']);
    return false;
  }
  if (commonService.isLogin() && !tokenService.isAdmin()) {
    router.navigate(['/application/test']);
    return false;
  }
  return true;
};
