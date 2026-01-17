import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz, CreateQuizRequest, QuestionWrapper } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/quiz';
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/student/active-quizzes`);
  }
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/all`);
  }
  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.BASE_URL}/start/${id}`);
  }
  getQuizQuestions(quizId: any): Observable<QuestionWrapper[]> {
    return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}/${quizId}`);
  }
  createQuiz(quiz: CreateQuizRequest): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.BASE_URL}`, quiz);
  }
  updateQuiz(id: string, quiz: Partial<CreateQuizRequest>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.BASE_URL}/${id}`, quiz);
  }
  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
  getQuizzesByBatch(batchId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/batch/${batchId}`);
  }
  getQuizBycategory(name: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/category/${name}`);
  }
}

