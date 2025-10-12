// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);

//   // Check if user is stored in sessionStorage
//   const getStoredUser = (): { username: string; role: string } | null => {
//     try {
//       const raw = sessionStorage.getItem('cachedUser'); // your storage key
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   };

//   const user = getStoredUser();
//   const isLoggedIn = Boolean(user?.username);

//   if (!isLoggedIn) {
//     router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
//     return false;
//   }

//   return true;
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Get user from sessionStorage
  const getStoredUser = (): { username: string; role: string } | null => {
    try {
      const raw = sessionStorage.getItem('cachedUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();
  const isLoggedIn = Boolean(user?.username);

  // Routes that are only for guests
  const guestOnlyRoutes = ['/signin', '/register'];

  const currentUrl = state.url;

  if (isLoggedIn && guestOnlyRoutes.includes(currentUrl)) {
    console.log(currentUrl)
    // Logged-in users cannot access guest-only routes
    router.navigate(['/']); // redirect to landing page
    return false;
  }

  if (!isLoggedIn && !guestOnlyRoutes.includes(currentUrl)) {
    console.log(currentUrl)

    // Not logged-in users cannot access protected routes
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true; // allow access
};
