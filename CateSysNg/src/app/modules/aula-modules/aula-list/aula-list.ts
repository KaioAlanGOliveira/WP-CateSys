import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TurmaService } from '../../../service/turma.service';
import { AulaService } from '../../../service/aula.service';
import { TurmaDomain } from '../../../models/turma.model';
import { AulaDomain } from '../../../models/aula.model';
import { Aula } from "../aula/aula";
import { AulaForm } from "../aula-form/aula-form";

@Component({
  imports: [ReactiveFormsModule, TableModule, CommonModule, Aula, AulaForm],
  standalone: true,
  templateUrl: './aula-list.html',
  styleUrl: './aula-list.css',
})
export class AulaList implements OnInit {

  private turmaServece = inject(TurmaService);
  private aulaService = inject(AulaService);
  private cdr = inject(ChangeDetectorRef);

  // ==================== ÚNICA VARIÁVEL DE CONTROLE ====================
  popupAberto: 'form' | 'visualizar' | null = null;

  aulaSelecionado!: AulaDomain | any;
  formTurma!: TurmaDomain;
  listAula: AulaDomain[] = [];
  aulaFiltradas: AulaDomain[] = [];

  form = new FormGroup({
    codigo: new FormControl<number | null>(null),
    turmaCodigo: new FormControl<number | null>(null),
    data: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const filtros = this.form.value as AulaDomain;

    this.aulaService.listFiltrados(filtros).subscribe({
      next: (dados) => {
        this.listAula = dados;
        this.aulaFiltradas = dados;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }
    });
  }

  pesquisar() {
    const { codigo, data, turmaCodigo } = this.form.value;
    if (!codigo && !data && !turmaCodigo) {
      this.aulaFiltradas = [...this.listAula];
      return;
    }
    this.carregarDados();
  }

  // ==================== CONTROLE CENTRAL DO POPUP ====================
  abrirPopup(tipo: 'form' | 'visualizar'): void {
    this.popupAberto = tipo;
  }

  fecharPopup(): void {
    this.popupAberto = null;
    this.aulaSelecionado = null;
  }

  retornoPopUp(valor: boolean): void {
    if (!valor) {
      this.fecharPopup();
      this.carregarDados();
    }
  }

  // ==================== AÇÕES ====================

  // Botão "+" -> novo cadastro
  novo(): void {
    this.form.reset();
    this.aulaSelecionado = null;
    this.abrirPopup('form');
  }

  // Duplo clique na tabela -> editar
  selecionado(aula: AulaDomain): void {
    this.aulaSelecionado = aula;
    this.abrirPopup('form');
  }

  // Visualizar uma aula específica
  visualizar(aula: AulaDomain): void {
    this.aulaSelecionado = aula;
    this.abrirPopup('visualizar');
  }

  apagar(dado: any) {
  }

  removerAll() {
    this.turmaServece.apagarAll().subscribe();
  }
}