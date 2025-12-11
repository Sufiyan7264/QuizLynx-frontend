import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../service/auth';

export const CredInterceptor: HttpInterceptorFn = (req, next) => {
    let router = inject(Router);
   let auth = inject(Auth);
  const clonedRequest = req.clone({
    withCredentials: true
  });
    return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {

      console.log('Unauthorized request - logging out',error?.status);
      // If backend returns unauthorized → auto logout
      // if (error.status === 401 || error.status === 0) {
      //   auth.setLoggedOut();  // clear session/user
      //   router.navigate(['/']);
      // }

      return throwError(() => error);
    })
  );
};