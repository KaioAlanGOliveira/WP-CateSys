import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaDomain } from '../domain/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private apiUrl = 'api/turma';

  constructor(private http: HttpClient) { }

  apagar(turma: TurmaDomain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: turma
    });
  }

  listarTodos(): Observable<TurmaDomain[]> {
    return this.http.get<TurmaDomain[]>(this.apiUrl);
  }

  listFiltrados(filtro: TurmaDomain): Observable<TurmaDomain[]> {
    return this.http.post<TurmaDomain[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(turma: TurmaDomain): Observable<TurmaDomain> {
    return this.http.put(this.apiUrl, turma);
  }

  salvar(turma: TurmaDomain): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(this.apiUrl,{
      body: turma
    });
  }
}