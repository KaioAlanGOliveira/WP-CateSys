import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';
import { log } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'api/login';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<any> {
    console.log(this.http.get(this.apiUrl));
    
    return this.http.get(this.apiUrl);
  }
}