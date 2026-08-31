import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../models/turma.model';
import { CommonModule } from '@angular/common';
import { AulaDomain } from '../../../models/aula.model';
import { AulaService } from '../../../service/aula.service';
import { Aula } from "../aula/aula";
import { AulaForm } from "../aula-form/aula-form";

@Component({
  selector: 'app-list',
  imports: [ReactiveFormsModule, TableModule, CommonModule, Aula, AulaForm],
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
  exibirModalForm: boolean = false;
  aulaSelecionado!: AulaDomain | any;
  formTurma!: TurmaDomain;
  listAula: TurmaDomain[] = [];
  aulaFiltradas: AulaDomain[] = [];
  aula: AulaDomain[] = [];
  abrirNovoPopupValid!: boolean;

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

        this.aula = dados;
        this.aulaFiltradas = dados;
        console.log(JSON.stringify(this.aulaFiltradas));
        this.listAula = dados;
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
    const { codigo, data, turmaCodigo } = this.form.value;
    if (!codigo && !data && !turmaCodigo) {
      this.aulaFiltradas = [...this.listAula];
      return;
    }

    this.carregarDados();
  }
  abrirFormulario() {
    this.exibirModal = true;
  }

  abrirFormularioCriar() {
    this.exibirModal = true;
  }

  abrirNovoPopup() {
    this.exibirModal = true;
    this.aulaSelecionado = null;
    this.abrirFormulario();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }

  selecionado(turma: any) {
    this.abrirNovoPopupValid = false
    this.exibirModalForm = true;
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
