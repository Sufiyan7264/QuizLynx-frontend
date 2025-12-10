import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'https://localhost:8080/api/students';

  // Get all students for the current instructor
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.BASE_URL}`);
  }

  // Get students by batch
  getStudentsByBatch(batchId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.BASE_URL}/batch/${batchId}`);
  }

  // Get a single student by ID
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.BASE_URL}/${id}`);
  }
}

