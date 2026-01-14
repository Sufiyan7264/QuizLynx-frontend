import { HttpClient, HttpParams } from '@angular/common/http';
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
  searchQuery<T>(searchQuery: string) {
    return this.http.get(`${this.BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`);
  }
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
  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`https://localhost:8080/auth/delete-account`);
  }
  getDashboardData():Observable<any> {
    return this.http.get(`${this.BASE_URL}/dashboard`)
  }
    getByCategory<T>() {
    return this.http.get(`${this.BASE_URL}/explore/categories`);
  }
  getByTrending<T>(payload:any) {
    const params = new HttpParams()
  .set('page', payload.page)
  .set('size', payload.size);
    return this.http.get(`${this.BASE_URL}/explore/trending`,{params});
  }
  getByGenerateQuiz<T>(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/explore/generate`, payload);
  }
  createAiTopics<T>(payload: any): Observable<any> {
    return this.http.post(`https://localhost:8080/api/ai/generate-from-topic`, payload);
  }
  getMistakeQuiz():Observable<any> {
    return this.http.get(`https://localhost:8080/api/quiz/getFailedQuiz`)
  }
  getLeaderboard():Observable<any>{
    return this.http.get(`${this.BASE_URL}/explore/leaderboard`);
  }
}

