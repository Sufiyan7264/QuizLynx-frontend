import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, CreateQuestionRequest } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/question';
  getQuestionsByQuiz(quizId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.BASE_URL}/quiz/${quizId}`);
  }
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.BASE_URL}/${id}`);
  }
  createQuestion(question: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${this.BASE_URL}/add/${question.quizId}`, question);
  }
  updateQuestion(id: string, question: Partial<CreateQuestionRequest>): Observable<Question> {
    return this.http.put<Question>(`${this.BASE_URL}/update/${id}`, question);
  }
  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/delete/${id}`);
  }
}

