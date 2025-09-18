import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
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

  const token = getCookie('JWT_TOKEN');
  const isLoggedIn = Boolean(token);

  if (!isLoggedIn) {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};
