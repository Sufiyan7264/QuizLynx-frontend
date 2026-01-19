import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const childAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const getStoredUser = (): { username: string; role: string } | null => {
    try {
      const raw = sessionStorage.getItem('cachedUser'); // your storage key
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();

  if (!user || !user.role) {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const role = user.role;

  const unrestrictedRoles = new Set(['INSTRUCTOR', 'ADMIN', 'USER']);
  if (unrestrictedRoles.has(role)) {
    return true; // allowed for these roles
  }

  const restrictedPrefixes = [
    '/question/create',
    '/question/update',
    '/quiz/create',
    '/quiz/update',
    '/leaderboard',
    '/quiz/score',
    '/question/all',
    '/dashboard'
  ];

  const currentUrl = state.url || `/${route.routeConfig?.path ?? ''}`;
  const isRestrictedForStudent = restrictedPrefixes.some(p => currentUrl.startsWith(p));

  if (role === 'STUDENT' && isRestrictedForStudent) {
    router.navigate(['/quiz'], { queryParams: { denied: 'true' } });
    return false;
  }

  return true;
};
