import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaD } from '../models/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private apiUrl = 'api/turma';

  constructor(private http: HttpClient) { }

  apagar(turma: TurmaD) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: turma
    });
  }

  listarTodos(): Observable<TurmaD[]> {
    return this.http.get<TurmaD[]>(this.apiUrl);
  }

  listFiltrados(filtro: TurmaD): Observable<TurmaD[]> {
    return this.http.post<TurmaD[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(turma: TurmaD): Observable<TurmaD> {
    return this.http.put(this.apiUrl, turma);
  }

  salvar(turma: TurmaD): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(this.apiUrl,{
      body: turma
    });
  }
}