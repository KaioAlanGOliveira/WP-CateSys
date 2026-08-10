import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AulaD } from '../models/aula.model';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private apiUrl = 'api/aula';

  constructor(private http: HttpClient) { }

  apagar(aula: AulaD) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aula
    });
  }

  listarTodos(): Observable<AulaD[]> {
    return this.http.get<AulaD[]>(this.apiUrl);
  }

  listFiltrados(filtro: AulaD): Observable<AulaD[]> {
    return this.http.post<AulaD[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(aula: AulaD) {
    return this.http.put(this.apiUrl, aula);
  }

  salvar(aula: AulaD): Observable<AulaD> {
    return this.http.post<AulaD>(this.apiUrl, aula);
  }
}