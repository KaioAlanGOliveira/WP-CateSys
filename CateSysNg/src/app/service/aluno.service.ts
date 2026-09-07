import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { alunoDomain } from '../models/aluno.model';
import { HttpParamsObject } from '../core/http/http-params-object';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'api/aluno';

  constructor(private http: HttpClient) { }

  apagar(aluno: alunoDomain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aluno
    });
  }

  getEntity(aluno: alunoDomain): Observable<alunoDomain> {

    return this.http.get<alunoDomain>(`${this.apiUrl}/${aluno.matricula}`);
  }

  listarTodos(): Observable<alunoDomain[]> {
    return this.http.get<alunoDomain[]>(this.apiUrl+"/ListAlunos");
  }

  listarTodosFiltrados(filtro: alunoDomain): Observable<alunoDomain> {
    return this.http.get<alunoDomain>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  editar(aluno: alunoDomain): Observable<alunoDomain> {
    return this.http.put(this.apiUrl, aluno);
  }

  salvar(aluno: alunoDomain): Observable<alunoDomain> {
    return this.http.post<alunoDomain>(this.apiUrl, aluno);
  }
}