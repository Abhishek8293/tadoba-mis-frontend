import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  if (!localStorageService.isLoggedIn()) {
    // Not logged in → go to login
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles: string[] = route.data['roles'] || [];
  const userRole = localStorageService.getUserRole();

  if (
    expectedRoles.length > 0 &&
    userRole &&
    !expectedRoles.includes(userRole)
  ) {
    // Role mismatch → send to respective home instead of login
    if (userRole === 'ADMIN') {
      router.navigate(['/admin/home']);
    } else if (userRole === 'EMPLOYEE') {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};
