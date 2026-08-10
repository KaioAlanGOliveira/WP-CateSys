import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'api/login';

  constructor(private http: HttpClient) { }

  logar(loginDto: LoginDto): Observable<any> {
    return this.http.post(this.apiUrl, loginDto);
  }
}