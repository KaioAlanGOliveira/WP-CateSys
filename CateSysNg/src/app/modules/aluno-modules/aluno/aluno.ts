import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { AlunoService } from '../../../service/aluno.service';
import { LoginDto } from '../../../models/login.model';
import { TableModule } from 'primeng/table';
import { AlunoD } from '../../../models/aluno.model';
import { log } from 'node:console';
import { AlunoP } from "../aluno-p/aluno-p";


@Component({
  selector: 'app-aluno',
  imports: [ReactiveFormsModule, TableModule, AlunoP],
  standalone: true,
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})

export class Aluno implements OnInit {

  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);
  
  listAlunos: AlunoD[] = [];
  alunosFiltrados: any[] = [];

  exibirModalPrincipal: boolean = false;
  alterar: boolean = false;
  alunoSelecionado!: any;
  formAluno!: Aluno;

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required)
  });
  matricula: any;
  nomeRazaoSocial: any;

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const dado = this.form.getRawValue() as AlunoD;
    this.alunoServece.listarTodos().subscribe({
      next: (dados) => {
        this.listAlunos = dados || [];
        this.alunosFiltrados = dados || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  novoPagamento() {
    this.alterar = false;
    this.exibirModalPrincipal = true;
    this.abrirMeuPopup();
  }
  pesquisar(termoNome: string, termoMatricula: string) {

    if (!termoNome && !termoMatricula) {
      this.alunosFiltrados = [...this.listAlunos];
      return;
    }

    const buscaNome = termoNome ? termoNome.toLocaleLowerCase().trim() : '';
    const buscaMatricula = termoMatricula ? termoMatricula.trim() : '';

    this.alunosFiltrados = this.listAlunos.filter(a =>
      (buscaNome && a.nome && a.nome.toLocaleLowerCase().includes(buscaNome.toLocaleLowerCase().trim())) ||
      (buscaMatricula && a.matricula && String(a.matricula).includes(buscaMatricula.trim()))
    );
  }
  abrirMeuPopup() {
    this.exibirModalPrincipal = true;
    this.alterar = true;
  }
  add() {
    this.alterar = false;
    this.form.reset();
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(aluno: AlunoD) {
    this.alterar = true;
    this.alunoSelecionado = aluno;
    this.form.patchValue(aluno);
    this.abrirMeuPopup();
  }
}
