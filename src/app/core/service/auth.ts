import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { otpConfig, registerConfig, signConfig, UserInfo } from '../interface/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private STORAGE_KEY = 'cachedUser';
  private readonly BASE_URL = 'http://localhost:8080/auth'
  private readonly http = inject(HttpClient);
  public isLoggedIn$ = new BehaviorSubject<boolean>(!!this.getCachedUser());

 private userSubject = new BehaviorSubject<UserInfo | null>(this.getCachedUser());
  public user$ = this.userSubject.asObservable();

  getCachedUser(): UserInfo | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as UserInfo : null;
    } catch {
      return null;
    }
  }
  setLoggedIn(user: UserInfo) {
    try {
      this.isLoggedIn$.next(true);
      this.userSubject.next(user);          // NEW: notify subscriber
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }
  setLoggedOut() {
    try {
      this.isLoggedIn$.next(false);
      this.userSubject.next(null);          // NEW: notify subscriber
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  }

  signin(data:signConfig){
    return this.http.post(`${this.BASE_URL}/login`,data,{withCredentials: true});
  }
  register(data:registerConfig){
    return this.http.post(`${this.BASE_URL}/register`,data);
  }
  verifyOtp(data:otpConfig){
    return this.http.post(`${this.BASE_URL}/verify-otp`,data,{withCredentials:true});
  }
  resendOtp(data:otpConfig){
    return this.http.post(`${this.BASE_URL}/resend-otp`,data);
  }
  logout(){
    return this.http.post(`${this.BASE_URL}/logout`,null,{withCredentials:true,observe:'response'});
  }
  updatePassword(data:any){
    return this.http.post(`${this.BASE_URL}/reset-password`,data);
  }
  forgotPassword(data:any){
    return this.http.post(`${this.BASE_URL}/forgot-password`,data);
  }
  

  
}
