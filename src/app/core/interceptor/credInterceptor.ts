import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../service/auth';

// --- STATE VARIABLES (Must be outside the function) ---
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const CredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // 1. Always enable Credentials (Cookies)
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // 2. Check if error is 401 (Unauthorized)
      // We must Exclude login/refresh calls to avoid infinite loops
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh-token')) {
        return handle401Error(clonedRequest, next, auth, router);
      }

      // If generic error or 403 Forbidden, just throw it
      return throwError(() => error);
    })
  );
};

// --- HELPER FUNCTION ---
const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: Auth,
  router: Router
) => {
  
  // CASE A: If we are NOT already refreshing, start the process
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null); // Signal others to wait

    return auth.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true); // Signal completion
        
        // Retry the original failed request
        return next(request);
      }),
      catchError((err) => {
        isRefreshing = false;
        
        // If Refresh Fails (Session truly dead), Logout
        console.log('Session expired, logging out...');
        auth.setLoggedOut();
        router.navigate(['/']); // Redirect to Login/Home
        
        return throwError(() => err);
      })
    );
  } 
  
  // CASE B: We ARE already refreshing (requests 2, 3, 4...)
  else {
    return refreshTokenSubject.pipe(
      filter(token => token != null), // Wait until subject becomes true
      take(1),                        // Take only the first emission
      switchMap(() => {
        // Retry the request once refresh is done
        return next(request);
      })
    );
  }
};