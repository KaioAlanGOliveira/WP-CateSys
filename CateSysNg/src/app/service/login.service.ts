import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';
import { log } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'api/login';

  constructor(private http: HttpClient) { }

  listarTodos(loginDto: loginDto): Observable<any> {
    console.log(this.http.post(this.apiUrl, loginDto));
    
    return this.http.post(this.apiUrl, loginDto);
  }
}