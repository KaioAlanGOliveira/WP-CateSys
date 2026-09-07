import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../models/turma.model';
import { CommonModule } from '@angular/common';
import { AulaDomain } from '../../../models/aula.model';
import { AulaService } from '../../../service/aula.service';
import { EventEmitter } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { ComponenteTurma } from "../../../shared/componente/componente-pesq-turma/componente-turma";

@Component({
  selector: 'app-aula',
  imports: [ReactiveFormsModule, TableModule, CommonModule, Dialog],
  standalone: true,
  templateUrl: './aula.html',
  styleUrl: './aula.css',
})

export class Aula implements OnInit {

  cancelar() {
    this.fecharModal();
  }

  private aulaService = inject(AulaService);
  private turmaServece = inject(TurmaService);
  private cdr = inject(ChangeDetectorRef);

  exibirModalPrincipal: boolean = false;
  aulaSelecionado!: AulaDomain | any;
  formTurma!: TurmaDomain;
  listTurmas: TurmaDomain[] = [];
  turmasFiltradas: TurmaDomain[] = [];
  turmas: TurmaDomain[] = [];

  
  @Input() Selecionado: AulaDomain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

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
    this.visivel = true;
    this.exibirModalPrincipal = true;
  }

  fecharModal() {
    this.visivel = false;
    this.exibirModalPrincipal = false;
    this.visivelChange.emit(false);
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
    this.abrirPopup();
  }
  apagar(dado: any) {

  }
  removerAll() {

    this.turmaServece.apagarAll().subscribe();
  }

  criar() {
    this.aulaSelecionado = this.form.getRawValue();
    this.aulaService.salvar(this.aulaSelecionado).subscribe({
      next: (res) => {
        if (res == null) {
          alert('Já existe uma aula cadastrada para esta turma na data informada!');
          return;
        }
        this.carregarDados();
        this.fecharModal();
      },
      error: (err) => {
        console.error('Erro ao salvar a aula:', err);
      }
    });
  }
}
