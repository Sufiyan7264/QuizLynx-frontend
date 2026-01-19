import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';
import { map, of, catchError, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  const guestOnlyRoutes = ['/signin', '/register'];
  const currentUrl = state.url.split('?')[0]; // remove query params
  const user = authService.getCachedUser();
  const hasSessionData = Boolean(user?.username);
  if (hasSessionData) {
    if (guestOnlyRoutes.includes(currentUrl)) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }
  if (guestOnlyRoutes.includes(currentUrl)) {
    return true;
  }
  return authService.fetchProfile().pipe(
    take(1), // Ensure observable completes
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};