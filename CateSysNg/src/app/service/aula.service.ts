import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginDto } from '../models/login.model';
import { log } from 'node:console';
import { AulaDomain } from '../models/aula.model';
import { AulaDto } from '../models/aulaDto.model';
import { HttpParamsObject } from '../core/http/http-params-object';
@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private apiUrl = 'api/aula';

  constructor(private http: HttpClient) { }

  apagar(aula: any): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(this.apiUrl, { body: aula });
  }

  listarTodos(): Observable<AulaDomain[]> {
    return this.http.get<AulaDomain[]>(this.apiUrl);
  }

  listFiltrados(filtro: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { params: new HttpParamsObject(filtro) });
  }

  salvar(aula: AulaDomain): Observable<AulaDomain> {
    return this.http.post<AulaDomain>(this.apiUrl, aula);
  }

  editar(aula: AulaDto): Observable<any> {
    return this.http.put(this.apiUrl, aula);
  }

  list(): Observable<AulaDomain[]> {
    return this.http.get<AulaDomain[]>(`${this.apiUrl}/listTA`);
  }

  getEntity(codAula: number): Observable<AulaDto> {
    return this.http.get<AulaDto>(`${this.apiUrl}/${codAula}`);
  }
}