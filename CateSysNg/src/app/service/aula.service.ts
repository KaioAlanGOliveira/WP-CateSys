import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../models/login.model';
import { log } from 'node:console';
import { AulaDoain } from '../models/aula.model';
import { AulaDto } from '../models/aulaDto.model';
import { HttpParamsObject } from '../core/http/http-params-object';
import { Presenca } from '../models/presenca.model';

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
    console.log(filtro);
    return this.http.get<any>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  editar(aula: AulaDoain) {
    return this.http.put(this.apiUrl, aula);
  }

  salvar(aula: AulaDoain): Observable<AulaDoain> {
    return this.http.post<AulaDoain>(this.apiUrl, aula);
  }

  list(): Observable<AulaDoain[]> {
    return this.http.get<AulaDoain[]>(`${this.apiUrl}/listTA`);
  }

  getEntity(codTurma: number): Observable<AulaDoain> {
    return this.http.get<AulaDoain>(`${this.apiUrl}/filtro/${codTurma}`);
  }


  getListAT(turma: any): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.apiUrl}/ListAlunoT/${turma}`);
  }
}