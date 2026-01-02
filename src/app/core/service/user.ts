import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UpdateProfileRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/users';

  // Get current user profile
  getCurrentUserProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/me`);
  }

  // Update user profile
  updateProfile(data: UpdateProfileRequest): Observable<any> {
    return this.http.put(`${this.BASE_URL}/me`, data);
  }
  getDashboard(): Observable<any> {
    return this.http.get(`https://localhost:8080/api/student/dashboard`);
  }

  // Delete account
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/me`);
  }
}

