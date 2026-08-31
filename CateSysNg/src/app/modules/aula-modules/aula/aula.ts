import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../models/turma.model';
import { AulaForm } from '../aula-form/aula-form';
import { CommonModule } from '@angular/common';
import { Turma } from '../../turma-modules/turma/turma';
import { AulaDomain } from '../../../models/aula.model';
import { log } from 'console';
import { AulaService } from '../../../service/aula.service';
import { EventEmitter } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { AlunoP } from "../../aluno-modules/aluno-p/aluno-p";
import { ComponenteTurma } from "../../../shared/componente/componente-pesq-turma/componente-turma";

@Component({
  selector: 'app-aula',
  imports: [ReactiveFormsModule, TableModule, CommonModule, Dialog, ComponenteTurma],
  
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

  aulaSelecionado!: AulaDomain | any;
  formTurma!: TurmaDomain;
  listTurmas: TurmaDomain[] = [];
  turmasFiltradas: TurmaDomain[] = [];
  turmas: TurmaDomain[] = [];
  exibirModal: boolean = false;

  @Input() Selecionado: AulaDomain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  form = new FormGroup({
    codigo: new FormControl<number | null>(null, Validators.required),
    turmaCodigo: new FormControl<number | null>(null, Validators.required),
    data: new FormControl<string | null | Date>(null, Validators.required)
  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['Selecionado'] && this.Selecionado && this.form) {
      this.form.patchValue(this.Selecionado);
    }
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const codigo = this.Selecionado?.turmaCodigo;
    if (!codigo) return;

    this.aulaService.getEntity(codigo).subscribe({
      next: (dados) => {
        console.log(dados);
        
        this.form.patchValue(dados.aula);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }

    });
  }

  novo() {
    this.form.reset();
    this.aulaSelecionado = null;
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
    this.exibirModal = true;
  }
  abrirNovoPopup() {
    this.aulaSelecionado = null;
    this.abrirPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }

  selecionado(turma: any) {
    this.aulaSelecionado = turma;
    this.visivel = true;
    this.abrirPopup();
  }
  apagar(dado: any) {

  }
  removerAll() {

    this.turmaServece.apagarAll().subscribe();
  }

  criar() {
    this.aulaSelecionado = this.form.getRawValue();
    this.abrirPopup();
  }
  fecharModal() {
    this.visivel = false;
    this.visivelChange.emit(false);
    this.form.reset();
  }
}
