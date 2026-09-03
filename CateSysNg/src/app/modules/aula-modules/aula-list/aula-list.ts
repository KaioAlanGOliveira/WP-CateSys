import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../models/turma.model';
import { AulaP } from '../aula-form/aula-p';
import { CommonModule } from '@angular/common';
import { Turma } from '../../turma-modules/turma/turma';
import { AulaDoain } from '../../../models/aula.model';
import { log } from 'console';
import { AulaService } from '../../../service/aula.service';
import { Aluno } from "../../aluno-modules/aluno/aluno";
import { Aula } from "../aula/aula";

@Component({
  selector: 'app-list',
  imports: [ReactiveFormsModule, TableModule, CommonModule, AulaP],
  standalone: true,
  templateUrl: './aula-list.html',
  styleUrl: './aula-list.css',
})

export class AulaList implements OnInit {

  cancelar() {
    throw new Error('Method not implemented.');
  }

  private turmaServece = inject(TurmaService);
  private aulaService = inject(AulaService);
  private cdr = inject(ChangeDetectorRef);

  exibirModal: boolean = false;
  aulaSelecionado!: AulaDoain | any;
  formTurma!: TurmaDomain;
  listAula: TurmaDomain[] = [];
  aulaFiltradas: TurmaDomain[] = [];
  aulas: AulaDoain[] = [];

  form = new FormGroup({
    codigo: new FormControl<number | null>(null),
    turmaCodigo: new FormControl<number | null>(null),
    data: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const raw = this.form.getRawValue();
    const parametros: any = {};

    if (raw.codigo != null) parametros.codigo = raw.codigo;
    if (raw.turmaCodigo != null) parametros.turmaCodigo = raw.turmaCodigo;
    if (raw.data != null) parametros.data = raw.data;

    this.aulaService.listFiltrados(parametros).subscribe({
      next: (dados) => {
        this.aulas = dados;
        this.aulaFiltradas = dados;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }

    });
  }
  novo() {
    this.form.reset();
    this.aulaSelecionado = null;
    this.abrirFormulario();
  }
  pesquisar() {
    this.carregarDados();
  }
  abrirFormulario() {
    this.exibirModal = true;
  }

  abrirFormularioCriar() {
    this.exibirModal = true;
  }

  abrirNovoPopup() {
    this.aulaSelecionado = null;
    this.abrirFormulario();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }

  selecionado(turma: any) {
    this.aulaSelecionado = turma;
    this.abrirFormulario();
  }
  apagar(dado: any) {

  }
  removerAll() {

    this.turmaServece.apagarAll().subscribe();
  }

  criar() {
    this.aulaSelecionado = this.form.getRawValue();
    this.abrirFormulario();
  }
}
