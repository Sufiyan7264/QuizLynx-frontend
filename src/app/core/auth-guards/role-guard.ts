import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const expectedRole = route.data['role']; // Get required role from routing module
    const user = auth.getCachedUser(); // Get current user

    if (user && user.role === expectedRole) {
      return true; // Authorized
    }

    // Redirect if unauthorized
    router.navigate(['/']); 
    return false;
  return true;
};
