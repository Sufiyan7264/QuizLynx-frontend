import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Batch, CreateBatchRequest } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/batches';
  getBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.BASE_URL}`);
  }
  getBatchById(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.BASE_URL}/${id}`);
  }
  getBatchByIdForStudent(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.BASE_URL}/student/${id}`);
  }
  createBatch(batch: CreateBatchRequest): Observable<Batch> {
    return this.http.post<Batch>(`${this.BASE_URL}`, batch);
  }
  updateBatch(id: string, batch: Partial<CreateBatchRequest>): Observable<Batch> {
    return this.http.put<Batch>(`${this.BASE_URL}/${id}`, batch);
  }
  deleteBatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
  addStudentsToBatch(batchId: string, studentIds: string[]): Observable<Batch> {
    return this.http.post<Batch>(`${this.BASE_URL}/${batchId}/students`, { studentIds });
  }
  removeStudentsFromBatch(batchId: string, studentIds: string[]): Observable<Batch> {
    return this.http.delete<Batch>(`${this.BASE_URL}/${batchId}/students`, {
      body: { studentIds }
    });
  }
  joinBatchByCode(code: string): Observable<Batch> {
    return this.http.post<Batch>(`https://localhost:8080/api/instructor/bind-by-code`, { code });
  }
  getBatchByCode(code: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.BASE_URL}/code/${code}`);
  }
  getStudentBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.BASE_URL}/student/my-batches`);
  }
}

