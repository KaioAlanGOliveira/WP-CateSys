import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { aluno } from '../domain/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'api/aluno';

  constructor(private http: HttpClient) { }

  apagar(aluno: aluno) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aluno
    });
  }

  listarTodos(): Observable<aluno[]> {
    return this.http.get<aluno[]>(this.apiUrl);
  }

  listarTodosFiltrados(filtro: aluno): Observable<aluno[]> {
    return this.http.post<aluno[]>(`${this.apiUrl}/filtrar`,  filtro);
  }

  editar(aluno: aluno) {
    return this.http.put(this.apiUrl, aluno);
  }

  salvar(aluno: aluno): Observable<aluno> {
    return this.http.post<aluno>(this.apiUrl, aluno);
  }
}