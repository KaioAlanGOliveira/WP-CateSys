import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfessorD } from '../models/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private apiUrl = 'api/professor';

  constructor(private http: HttpClient) { }

  apagar(professor: ProfessorD) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: professor
    });
  }

  listarTodos(): Observable<ProfessorD[]> {
    return this.http.get<ProfessorD[]>(this.apiUrl);
  }

  listFiltrados(filtro: ProfessorD): Observable<ProfessorD[]> {
    return this.http.post<ProfessorD[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(professor: ProfessorD) {
    return this.http.put(this.apiUrl, professor);
  }

  salvar(professor: ProfessorD): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(this.apiUrl,{
      body: professor
    });
  }
}