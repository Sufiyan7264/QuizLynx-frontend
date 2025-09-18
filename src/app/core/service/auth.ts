import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { signConfig } from '../interface/interfaces';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly BASE_URL = 'http://localhost:8080/auth'
  private readonly http = inject(HttpClient);

  signin(data:signConfig){
    return this.http.post(`${this.BASE_URL}/login`,data);
  }
  
}
