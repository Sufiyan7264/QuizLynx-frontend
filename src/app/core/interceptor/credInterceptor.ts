import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../service/auth';
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const CredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh-token')) {
        return handle401Error(clonedRequest, next, auth, router);
      }
      return throwError(() => error);
    })
  );
};
const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: Auth,
  router: Router
) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null); // Signal others to wait

    return auth.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true); // Signal completion
        return next(request);
      }),
      catchError((err) => {
        isRefreshing = false;
        console.log('Session expired, logging out...');
        auth.setLoggedOut();
        router.navigate(['/']); // Redirect to Login/Home

        return throwError(() => err);
      })
    );
  }
  else {
    return refreshTokenSubject.pipe(
      filter(token => token != null), // Wait until subject becomes true
      take(1),                        // Take only the first emission
      switchMap(() => {
        return next(request);
      })
    );
  }
};