import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchResult, StudentResult } from '../interface/interfaces';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BatchResultService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/api/batch-results`;
  getBatchResults(batchId: string, quizId: string): Observable<BatchResult> {
    return this.http.get<BatchResult>(`${environment.apiUrl}/api/analytics/batch/${batchId}/quiz/${quizId}`);
  }
  getBatchResultsByBatch(batchId: string): Observable<BatchResult[]> {
    return this.http.get<BatchResult[]>(`${this.BASE_URL}/batch/${batchId}`);
  }
  getBatchResultsByQuiz(quizId: string): Observable<BatchResult[]> {
    return this.http.get<BatchResult[]>(`${this.BASE_URL}/quiz/${quizId}`);
  }
}

