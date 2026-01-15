import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { otpConfig, registerConfig, signConfig, UserInfo } from '../interface/interfaces';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly STORAGE_KEY = 'cachedUser';
  private readonly BASE_URL = 'https://localhost:8080/auth'
  private readonly http = inject(HttpClient);
  public isLoggedIn$ = new BehaviorSubject<boolean>(!!this.getCachedUser());
  private readonly userSubject = new BehaviorSubject<UserInfo | null>(this.getCachedUser());
  public user$ = this.userSubject.asObservable();
  private readonly router = inject(Router);

  getCachedUser(): UserInfo | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as UserInfo : null;
    } catch {
      return null;
    }
  }
  fetchProfile(): Observable<boolean> {
    return this.http.get<UserInfo>(`${this.BASE_URL}/me`).pipe(
      tap((user: UserInfo) => {
        // Success: Save to storage
        this.setLoggedIn(user); 
      }),
      map(() => true), // Transform response to "true" (Allowed)
      catchError(() => {
        // Error: Token invalid or missing
        this.setLoggedOut();
        return of(false); // Transform error to "false" (Blocked)
      })
    );
  }
  public setLoggedIn(user: UserInfo) {
    this.isLoggedIn$.next(true);
    this.userSubject.next(user);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
  public setLoggedOut() {
    this.isLoggedIn$.next(false);
    this.userSubject.next(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  signin(data: signConfig) {
    return this.http.post<UserInfo>(`${this.BASE_URL}/login`, data).pipe(
      tap((responseUser: UserInfo) => {
        this.setLoggedIn(responseUser);
      })
    );
  }
  register(data:registerConfig){
    return this.http.post(`${this.BASE_URL}/register`,data);
  }
  verifyOtp(data: otpConfig) {
    return this.http.post<UserInfo>(`${this.BASE_URL}/verify-otp`, data).pipe(
      tap((responseUser: UserInfo) => {
        this.setLoggedIn(responseUser);
      })
    );
  }
  resendOtp(data:otpConfig){
    return this.http.post(`${this.BASE_URL}/resend-otp`,data);
  }
  // logout() {
  //   return this.http.post(`${this.BASE_URL}/logout`, {}).pipe(
  //     tap(() => this.setLoggedOut()) // Clear state even if server errors
  //   );
  // }
  updatePassword(data:any){
    return this.http.patch(`${this.BASE_URL}/change-password`,data);
  }
  forgotPassword(data:any){
    return this.http.post(`${this.BASE_URL}/forgot-password`,data);
  }

  refreshToken() {
    // We don't need to pass data, the HttpOnly cookie does the work
    return this.http.post(`${this.BASE_URL}/refresh-token`, {});
  }

  logout() {
    return this.http.post(`${this.BASE_URL}/logout`, {}).pipe(
      tap(() => {
        this.setLoggedOut();
        this.router.navigate(['/']); // Navigate to home/login
      })
    );
  }
}
