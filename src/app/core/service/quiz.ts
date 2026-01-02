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

  // Get all quizzes for the current instructor
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/student/active-quizzes`);
  }
  // Get all quizzes for the current instructor
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/all`);
  }

  // Get a single quiz by ID
  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.BASE_URL}/start/${id}`);
  }
  // Inside your QuizService (Angular)

// Matches Backend: @GetMapping("/{id}")
getQuizQuestions(quizId: any): Observable<QuestionWrapper[]> {
  return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}/${quizId}`);
}

  // Create a new quiz
  createQuiz(quiz: CreateQuizRequest): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.BASE_URL}`, quiz);
  }

  // Update a quiz
  updateQuiz(id: string, quiz: Partial<CreateQuizRequest>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.BASE_URL}/${id}`, quiz);
  }

  // Delete a quiz
  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Get quizzes by batch
  getQuizzesByBatch(batchId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE_URL}/batch/${batchId}`);
  }
}

