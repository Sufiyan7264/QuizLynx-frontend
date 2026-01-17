import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/instructor/students';
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.BASE_URL}`);
  }
  getStudentsByBatch(batchId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`https://localhost:8080/api/batches/${batchId}/students`);
  }
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.BASE_URL}/${id}`);
  }
}

