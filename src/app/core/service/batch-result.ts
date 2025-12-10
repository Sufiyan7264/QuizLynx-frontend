import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchResult, StudentResult } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BatchResultService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/batch-results';

  // Get results for a specific batch and quiz
  getBatchResults(batchId: string, quizId: string): Observable<BatchResult> {
    return this.http.get<BatchResult>(`${this.BASE_URL}/batch/${batchId}/quiz/${quizId}`);
  }

  // Get results for all quizzes in a batch
  getBatchResultsByBatch(batchId: string): Observable<BatchResult[]> {
    return this.http.get<BatchResult[]>(`${this.BASE_URL}/batch/${batchId}`);
  }

  // Get results for a specific quiz across all batches
  getBatchResultsByQuiz(quizId: string): Observable<BatchResult[]> {
    return this.http.get<BatchResult[]>(`${this.BASE_URL}/quiz/${quizId}`);
  }
}

