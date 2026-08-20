import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaDomain } from '../models/turma.model';
import { HttpParamsObject } from '../core/http/http-params-object';
import { dot } from 'node:test/reporters';
import { Turma } from '../modules/turma-modules/turma/turma';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private apiUrl = 'api/turma';

  constructor(private http: HttpClient) { }

  salvar(dto: any): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(this.apiUrl, dto);
  }

  apagar(turma: TurmaDomain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: turma
    });
  } 
  apagarAll() {
    return this.http.get(`${this.apiUrl}/apagarAll`)
  }

  getEntity(codTurma: number): Observable<TurmaDomain> {

    return this.http.get<TurmaDomain>(`${this.apiUrl}/${codTurma}`);
  }

  listFiltrados(filtro: TurmaDomain): Observable<TurmaDomain[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  editar(turma: any): Observable<TurmaDomain> {
    return this.http.put(this.apiUrl, turma);
  }
}