import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient) { }

  listarTodos(loginD: loginDto) {
   return this.http.post<{ mensagem: string }>(this.apiUrl, {
      body: loginD
    });
  }
}