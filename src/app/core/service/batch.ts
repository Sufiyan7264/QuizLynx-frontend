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

  // Get all batches for the current instructor
  getBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.BASE_URL}`);
  }

  // Get a single batch by ID
  getBatchById(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.BASE_URL}/${id}`);
  }

  // Create a new batch
  createBatch(batch: CreateBatchRequest): Observable<Batch> {
    return this.http.post<Batch>(`${this.BASE_URL}`, batch);
  }

  // Update a batch
  updateBatch(id: string, batch: Partial<CreateBatchRequest>): Observable<Batch> {
    return this.http.put<Batch>(`${this.BASE_URL}/${id}`, batch);
  }

  // Delete a batch
  deleteBatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Add students to a batch
  addStudentsToBatch(batchId: string, studentIds: string[]): Observable<Batch> {
    return this.http.post<Batch>(`${this.BASE_URL}/${batchId}/students`, { studentIds });
  }

  // Remove students from a batch
  removeStudentsFromBatch(batchId: string, studentIds: string[]): Observable<Batch> {
    return this.http.delete<Batch>(`${this.BASE_URL}/${batchId}/students`, { 
      body: { studentIds } 
    });
  }

  // Join a batch using a code (for students)
  joinBatchByCode(code: string): Observable<Batch> {
    return this.http.post<Batch>(`${this.BASE_URL}/join`, { code });
  }

  // Get batch by code (for preview before joining)
  getBatchByCode(code: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.BASE_URL}/code/${code}`);
  }

  // Get enrolled batches for the current student
  getStudentBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.BASE_URL}/student/enrolled`);
  }
}

