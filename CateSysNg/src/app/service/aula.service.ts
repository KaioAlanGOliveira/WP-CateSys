import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../models/login.model';
import { log } from 'node:console';
import { AulaDomain } from '../models/aula.model';
import { AulaDto } from '../models/aulaDto.model';
import { HttpParamsObject } from '../core/http/http-params-object';
import { Presenca } from '../models/presenca.model';

@Injectable({
  providedIn: 'root'
})

export class AulaService {


  private apiUrl = 'api/aula';

  constructor(private http: HttpClient) { }

  apagar(aula: AulaDomain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: aula
    });
  }

  listarTodos(): Observable<AulaDomain[]> {
    return this.http.get<AulaDomain[]>(this.apiUrl);
  }

  listFiltrados(filtro: AulaDomain): Observable<AulaDomain[]> {
    return this.http.get<AulaDomain[]>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  editar(aula: any) {
    return this.http.put(this.apiUrl, aula);
  }
  create(aula: AulaDto): Observable<AulaDomain> {
    return this.http.post<AulaDomain>(`${this.apiUrl}/create`, aula);
  }

  salvar(aula: AulaDto): Observable<AulaDomain> {
    return this.http.post<AulaDomain>(`${this.apiUrl}`, aula);
  }

  criar(aula: AulaDomain): Observable<AulaDomain> {
    return this.http.post<AulaDomain>(`${this.apiUrl}/criar`, aula);
  }

  list(): Observable<AulaDomain[]> {
    return this.http.get<AulaDomain[]>(`${this.apiUrl}/listTA`);
  }

  getEntity(codTurma: number): Observable<AulaDto> {
    return this.http.get<AulaDto>(`${this.apiUrl}/filtradosDTO/${codTurma}`);
  }

  getListAT(codTurma: any): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.apiUrl}/ListAlunoT/${codTurma}`);
  }
}