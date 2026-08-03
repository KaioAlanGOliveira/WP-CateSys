import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../domain/login.model';
import { log } from 'node:console';
import { AulaDoain } from '../domain/aula.model';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private apiUrl = 'api/aula';

  constructor(private http: HttpClient) { }

  apagar(aula: AulaDoain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aula
    });
  }

  listarTodos(): Observable<AulaDoain[]> {
    return this.http.get<AulaDoain[]>(this.apiUrl);
  }

  listFiltrados(filtro: AulaDoain): Observable<AulaDoain[]> {
    return this.http.post<AulaDoain[]>(`${this.apiUrl}/filtrar`, filtro);
  }

  editar(aula: AulaDoain) {
    return this.http.put(this.apiUrl, aula);
  }

  salvar(aula: AulaDoain): Observable<AulaDoain> {
    return this.http.post<AulaDoain>(this.apiUrl, aula);
  }
}