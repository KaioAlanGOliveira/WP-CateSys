import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';
import { log } from 'node:console';
import { aluno } from '../domain/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'api/aluno';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<aluno[]> {
    return this.http.get<aluno[]>(this.apiUrl);
  }
}