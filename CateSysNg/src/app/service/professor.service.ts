import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';
import { log } from 'node:console';
import { professor } from '../domain/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private apiUrl = 'api/professor';

  constructor(private http: HttpClient) { }

  apagar(professor: professor) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: professor
    });
  }

  listarTodos(): Observable<professor[]> {
    return this.http.get<professor[]>(this.apiUrl);
  }

  listFiltrados(filtro: { nome?: string | null, matricula?: number | null }): Observable<professor[]> {
    return this.http.post<professor[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(professor: professor) {
    return this.http.put(this.apiUrl, professor);
  }

  salvar(professor: professor): Observable<professor> {
    return this.http.post<professor>(this.apiUrl, professor);
  }
}