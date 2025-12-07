import { HttpInterceptorFn } from '@angular/common/http';

export const CredInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true
  });
  return next(clonedRequest);
};