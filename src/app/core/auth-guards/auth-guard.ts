import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';
import { map, of, catchError, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);

  // Define Guest Routes (pages logged-in users shouldn't see)
  const guestOnlyRoutes = ['/signin', '/register'];
  const currentUrl = state.url.split('?')[0]; // remove query params

  // 1. Check Session Storage immediately
  const user = authService.getCachedUser();
  const hasSessionData = Boolean(user?.username);

  // --- SCENARIO A: User is already logged in (Data exists in Session Storage) ---
  if (hasSessionData) {
    if (guestOnlyRoutes.includes(currentUrl)) {
      // Block logged-in users from visiting Signin/Register
      router.navigate(['/']); 
      return false;
    }
    // Allow access to protected routes
    return true;
  }

  // --- SCENARIO B: No Session Data ---

  // 1. If trying to access a Guest Route (Signin/Register), allow it immediately.
  if (guestOnlyRoutes.includes(currentUrl)) {
    return true;
  }

  // 2. If trying to access a Protected Route (e.g. /dashboard) with no session data.
  //    Check if a valid HttpOnly cookie exists (e.g., returned from Google Login).
  return authService.fetchProfile().pipe(
    take(1), // Ensure observable completes
    map(isAuthenticated => {
      if (isAuthenticated) {
        // SUCCESS: Cookie was valid, user data is now in SessionStorage.
        return true; 
      } else {
        // FAIL: No valid cookie found. Redirect to login.
        router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
    catchError(() => {
      // ERROR: Network error or server down. Treat as logged out.
      router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};