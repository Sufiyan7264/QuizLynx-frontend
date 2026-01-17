import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const expectedRoles = route.data['role'];
  const user = auth.getCachedUser();
  if (user && user.role) {
    if (Array.isArray(expectedRoles)) {
      if (expectedRoles.includes(user.role)) {
        return true;
      }
    }
    else if (user.role === expectedRoles) {
      return true;
    }
  }
  if (user?.role === 'INSTRUCTOR') router.navigate(['/dashboard']);
  else if (user?.role === 'STUDENT') router.navigate(['/student-dashboard']);
  else router.navigate(['/user-dashboard']);

  return false;
};