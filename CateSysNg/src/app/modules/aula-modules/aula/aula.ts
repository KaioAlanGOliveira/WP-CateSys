import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../models/turma.model';
import { AulaP } from '../aula-p/aula-p';
import { CommonModule } from '@angular/common';
import { Turma } from '../../turma-modules/turma/turma';
import { AulaDoain } from '../../../models/aula.model';
import { log } from 'console';
import { AulaService } from '../../../service/aula.service';

@Component({
  selector: 'app-turma',
  imports: [ReactiveFormsModule, TableModule, AulaP, CommonModule],
  standalone: true,
  templateUrl: './aula.html',
  styleUrl: './aula.css',
})

export class Aula implements OnInit {

  cancelar() {
    throw new Error('Method not implemented.');
  }

  private aulaService = inject(AulaService);
  private turmaServece = inject(TurmaService);
  private cdr = inject(ChangeDetectorRef);

  exibirModalPrincipal: boolean = false;
  turmaSelecionado!: AulaDoain | any;
  formTurma!: TurmaDomain;
  listTurmas: TurmaDomain[] = [];
  turmasFiltradas: TurmaDomain[] = [];
  turmas: TurmaDomain[] = [];

  form = new FormGroup({
    turmaCodigo: new FormControl<number | null>(null, Validators.required),
    data: new FormControl<string | null>(null, Validators.required)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.aulaService.list().subscribe({
      next: (dados) => {
        this.turmas = dados;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }

    });
  }
  novo() {
    this.form.reset();
    this.turmaSelecionado = null;
    this.abrirPopup();
  }
  pesquisar() {
    const filtro = this.form.value;
    if (!filtro) {
      this.turmasFiltradas = [...this.listTurmas];
      return;
    }
    this.form.patchValue({});

    this.carregarDados();
  }
  abrirPopup() {
    this.exibirModalPrincipal = true;
  }
  abrirNovoPopup() {
    this.turmaSelecionado = null;
    this.abrirPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }

  selecionado(turma: any) {
    this.turmaSelecionado = turma;
    this.abrirPopup();
  }
  apagar(dado: any) {

  }
  removerAll() {

    this.turmaServece.apagarAll().subscribe();
  }

  criar() {
    this.turmaSelecionado = this.form.getRawValue();
    this.abrirPopup();
  }
}
