import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuizAttempt, QuizResults, QuestionWrapper } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/quiz';

  // Start a quiz attempt (records startedAt time)
  startQuizAttempt(quizId: string): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.BASE_URL}/start`, { quizId });
  }

  // Get questions for a quiz (without correct answers)
  getQuizQuestions(quizId: string): Observable<QuestionWrapper[]> {
    return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}/quiz/${quizId}/questions`);
  }

  // Submit quiz attempt (sends responses, backend grades and saves result)
  submitQuizAttempt(request: any,quizId:any): Observable<QuizResults> {
    return this.http.post<QuizResults>(`${this.BASE_URL}/submit/${quizId}`, request);
  }

  // Get quiz result by attempt ID
  getQuizResult(attemptId: string): Observable<QuizResults> {
    return this.http.get<QuizResults>(`${this.BASE_URL}/result/${attemptId}`);
  }
  startQuiz(quizId: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${quizId}/start`,null);
  }
  getAttemptStatus(quizId: string) {
    return this.http.get<any>(`${this.BASE_URL}/${quizId}/attempt-status`);
  }

  // Get quiz result by quiz ID (for current student)
  getQuizResultByQuizId(quizId: string): Observable<QuizResults> {
    return this.http.get<QuizResults>(`${this.BASE_URL}/quiz/${quizId}/result`);
  }

  // Get all quiz attempts/results for the current student
  getStudentAttempts(payload:any): Observable<QuizResults[]> {
    const params = new HttpParams()
    .set("page",payload.page)
    .set("size",payload.size)
    return this.http.get<QuizResults[]>(`${this.BASE_URL}/my-attempts`,{params});
  }
  pauseQuiz(quizId: string, seconds: number) {
    return this.http.post(`${this.BASE_URL}/${quizId}/pause`, { 
      remainingSeconds: seconds 
    });
  }
}

