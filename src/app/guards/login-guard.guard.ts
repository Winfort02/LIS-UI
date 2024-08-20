import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonService);
  const router = inject(Router);

  if (commonService.isLogin()) {
    router.navigate(['/application']);
    return false;
  }
  return true;
};
