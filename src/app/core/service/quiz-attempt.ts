import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizAttempt, QuizResults, QuestionWrapper } from '../interface/interfaces';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/api/quiz`;
  startQuizAttempt(quizId: string): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.BASE_URL}/start`, { quizId });
  }
  getQuizQuestions(quizId: string): Observable<QuestionWrapper[]> {
    return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}/quiz/${quizId}/questions`);
  }
  submitQuizAttempt(request: any, quizId: any): Observable<QuizResults> {
    return this.http.post<QuizResults>(`${this.BASE_URL}/submit/${quizId}`, request);
  }
  getQuizResult(attemptId: string): Observable<QuizResults> {
    return this.http.get<QuizResults>(`${this.BASE_URL}/result/${attemptId}`);
  }
  startQuiz(quizId: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${quizId}/start`, null);
  }
  getAttemptStatus(quizId: string) {
    return this.http.get<any>(`${this.BASE_URL}/${quizId}/attempt-status`);
  }
  getQuizResultByQuizId(quizId: string): Observable<QuizResults> {
    return this.http.get<QuizResults>(`${this.BASE_URL}/quiz/${quizId}/result`);
  }
  getStudentAttempts(payload: any): Observable<QuizResults[]> {
    const params = new HttpParams()
      .set("page", payload.page)
      .set("size", payload.size)
    return this.http.get<QuizResults[]>(`${this.BASE_URL}/my-attempts`, { params });
  }
  pauseQuiz(quizId: string, seconds: number) {
    return this.http.post(`${this.BASE_URL}/${quizId}/pause`, {
      remainingSeconds: seconds
    });
  }
}

