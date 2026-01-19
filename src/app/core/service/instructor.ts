import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class Instructor {
    private readonly http = inject(HttpClient);
    private readonly BASE_URL = `${environment.apiUrl}/api/instructor`;

    getInstructorInfo() {
        return this.http.get(`${this.BASE_URL}/me`);
    }
    updateInstructorProfile(data: any) {
        return this.http.post(`${this.BASE_URL}/me`, data);
    }
    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.BASE_URL}/dashboard`);
    }
}