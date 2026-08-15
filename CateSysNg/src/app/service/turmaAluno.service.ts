import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaDomain } from '../models/turma.model';
import { HttpParamsObject } from '../core/http/http-params-object';
import { TurmaAluno } from '../models/TurmaAluno.model';
import { TurmaAlunoId } from '../models/TurmaAlunoId.model';
import { Turma } from '../modules/turma-modules/turma/turma';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class TurmaAlunoService {

  private apiUrl = 'api/turma';

  constructor(private http: HttpClient) { }

  apagar(turma: TurmaDomain) {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, {
      body: turma
    });
  }

  getEntity(turma: TurmaAlunoId): Observable<TurmaDomain> {

    return this.http.get<TurmaDomain>(`${this.apiUrl}/${turma}`);
  }

  getListAT(turma: any): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.apiUrl}/ListAlunoT/${turma}`);
  }

  listFiltrados(filtro: TurmaDomain): Observable<TurmaDomain[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
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