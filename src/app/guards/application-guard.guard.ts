import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { inject } from '@angular/core';

export const applicationGuardGuard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonService);
  const router = inject(Router);
  if (!commonService.isLogin()) {
    router.navigate(['/security']);
    return false;
  }
  return true;
};
