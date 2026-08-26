import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaDomain } from '../models/turma.model';
import { HttpParamsObject } from '../core/http/http-params-object';
import { dot } from 'node:test/reporters';
import { Turma } from '../modules/turma-modules/turma/turma';
import { TurmaDto } from '../models/turmaDto.model';
import { Aula } from '../modules/aula-modules/aula/aula';
import { AulaDoain } from '../models/aula.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private apiUrl = 'api/turma';

  constructor(private http: HttpClient) { }

  salvar(dto: TurmaDto): Observable<any> {
    return this.http.post<TurmaDto>(this.apiUrl, dto);
  }

  apagar(turma: TurmaDto) {
    return this.http.post(`${this.apiUrl}/remover`, turma);
  }

  apagarAll() {
    return this.http.get(`${this.apiUrl}/apagarAll`)
  }

  getEntity(codTurma: number): Observable<AulaDoain> {

    return this.http.get<AulaDoain>(`${this.apiUrl}/${codTurma}`);
  }

  listFiltrados(filtro: TurmaDomain): Observable<TurmaDomain[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  editar(turma: TurmaDto): Observable<any> {
    return this.http.put(this.apiUrl, turma);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listTA`);
  }
}