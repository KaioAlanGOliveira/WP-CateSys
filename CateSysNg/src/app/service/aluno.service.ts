import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlunoD } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'api/aluno';

  constructor(private http: HttpClient) { }

  apagar(aluno: AlunoD) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aluno
    });
  }

  listarTodos(): Observable<AlunoD[]> {
    return this.http.get<AlunoD[]>(this.apiUrl);
  }

  listarTodosFiltrados(filtro: AlunoD): Observable<AlunoD[]> {
    return this.http.post<AlunoD[]>(`${this.apiUrl}/filtrar`,  filtro);
  }

  editar(aluno: AlunoD) {
    return this.http.put(this.apiUrl, aluno);
  }

  salvar(aluno: AlunoD): Observable<AlunoD> {
    return this.http.post<AlunoD>(this.apiUrl, aluno);
  }
}