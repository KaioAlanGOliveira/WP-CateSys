import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../models/login.model';
import { log } from 'node:console';
import { professor } from '../models/professor.model';

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

  listFiltrados(filtro: professor): Observable<professor[]> {
    return this.http.post<professor[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(professor: professor) {
    return this.http.put(this.apiUrl, professor);
  }

  salvar(professor: professor): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(this.apiUrl,{
      body: professor
    });
  }
}