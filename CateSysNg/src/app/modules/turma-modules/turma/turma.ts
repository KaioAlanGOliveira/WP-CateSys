import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaDomain } from '../../../domain/turma.model';
import { TurmaP } from '../turma-p/turma-p';
import { RadioButton } from "primeng/radiobutton";



@Component({
  selector: 'app-turma',
  imports: [ReactiveFormsModule, TableModule, TurmaP, RadioButton],
  standalone: true,
  templateUrl: './turma.html',
  styleUrl: './turma.css',
})

export class Turma implements OnInit {

  private turmaServece = inject(TurmaService);
  private cdr = inject(ChangeDetectorRef);

  exibirModalPrincipal: boolean = false;
  turmaSelecionado!: any;
  formturma!: TurmaDomain;
  listTurmas: TurmaDomain[] = [];
  turmasFiltrados: any[] = [];

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const filtro = this.form.value as TurmaDomain;
    // this.turmaServece.listFiltrados(filtro).subscribe({
    //   next: (dados) => {

    //     this.listTurmas = dados || [];
    //     this.turmasFiltrados = dados || [];
    //     this.cdr.detectChanges();
    //   },
    //   error: (err) => {
    //     console.error('Erro ao carregar os turmaes:', err);
    //   }
    // });

    this.turmaServece.listarTodos().subscribe({
      next: (dados) => {
        this.listTurmas = dados || [];
        this.turmasFiltrados = dados || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar os turmaes:', err);
      }
    });
  }
  novo() {
    this.form.reset();
    this.turmaSelecionado = null;
    this.abrirMeuPopup();
  }
  pesquisar(termoNome: string, termoMatricula: string) {

    if (!termoNome && !termoMatricula) {
      this.turmasFiltrados = [...this.listTurmas];
      return;
    }
    this.form.patchValue({
      nome: termoNome,
      matricula: termoMatricula ? Number(termoMatricula) : null
    });
    this.carregarDados();
  }
  abrirMeuPopup() {
    this.exibirModalPrincipal = true;
  }
  add() {
    this.form.reset();
    this.turmaSelecionado = null;
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(turma: TurmaDomain) {
    //this.form.patchValue(turma);
    this.turmaSelecionado = turma;
    this.abrirMeuPopup();
  }
}
