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
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }
  setLoggedOut() {
    try {
      this.isLoggedIn$.next(false);
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  }

  click(){
    return this.http.get(`${this.BASE_URL}/quiz/get`);
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
    return this.http.patch(`${this.BASE_URL}/update-password`,data);
  }
  forgotPassword(data:any){
    return this.http.post(`${this.BASE_URL}/forgot-password`,data);
  }
  

  
}
