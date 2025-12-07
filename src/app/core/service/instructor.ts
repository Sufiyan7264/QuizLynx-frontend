import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Instructor {
    private readonly http = inject(HttpClient);
    private readonly BASE_URL = 'http://localhost:8080/api/instructor';

    getInstructorInfo(){
        return this.http.get(`${this.BASE_URL}/me`);
    }
    updateInstructorProfile(data:any){
        return this.http.post(`${this.BASE_URL}/me`,data);
    }
}