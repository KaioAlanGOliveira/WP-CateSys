import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../models/login.model';
import { log } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'api/login';

  constructor(private http: HttpClient) { }

  logar(loginDto: loginDto): Observable<any> {
    return this.http.post(this.apiUrl, loginDto);
  }
}