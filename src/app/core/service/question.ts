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

  // Get all questions for a quiz
  getQuestionsByQuiz(quizId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.BASE_URL}/quiz/${quizId}`);
  }

  // Get a single question by ID
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.BASE_URL}/${id}`);
  }

  // Create a new question
  createQuestion(question: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${this.BASE_URL}/add/${question.quizId}`, question);
  }

  // Update a question
  updateQuestion(id: string, question: Partial<CreateQuestionRequest>): Observable<Question> {
    return this.http.put<Question>(`${this.BASE_URL}/update/${id}`, question);
  }

  // Delete a question
  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/delete/${id}`);
  }
}

