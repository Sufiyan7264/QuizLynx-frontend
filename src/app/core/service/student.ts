import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interface/interfaces';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/api/instructor/students`;
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.BASE_URL}`);
  }
  getStudentsByBatch(batchId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/api/batches/${batchId}/students`);
  }
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.BASE_URL}/${id}`);
  }
}

