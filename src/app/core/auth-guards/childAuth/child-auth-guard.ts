import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const childAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const documentRef = inject(DOCUMENT);

  const getCookie = (name: string): string | null => {
    const cookies = (documentRef?.cookie ?? '').split(';');
    for (const cookie of cookies) {
      const [rawName, ...rest] = cookie.trim().split('=');
      if (rawName === name) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return null;
  };

  const decodeJwtPayload = (jwt: string): Record<string, unknown> | null => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const jsonPayload = atob(base64 + padding);
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const token = getCookie('JWT_TOKEN');
  if (!token) {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const payload = decodeJwtPayload(token);
  const role = (payload?.['role'] as string | undefined) || null;

  if (!role) {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const unrestrictedRoles = new Set(['INSTRUCTOR', 'ADMIN', 'USER']);
  if (unrestrictedRoles.has(role)) {
    return true;
  }

  const restrictedPrefixes = [
    '/question/create',
    '/question/update',
    '/quiz/create',
    '/quiz/update',
    '/leaderboard',
    '/quiz/score',
    '/question/all'
  ];

  const currentUrl = state.url || `/${route.routeConfig?.path ?? ''}`;
  const isRestrictedForStudent = restrictedPrefixes.some(p => currentUrl.startsWith(p));

  if (role === 'STUDENT' && isRestrictedForStudent) {
    router.navigate(['/'], { queryParams: { denied: 'true' } });
    return false;
  }

  return true;
};
