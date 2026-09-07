import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { AlunoService } from '../../../service/aluno.service';
import { loginDto } from '../../../models/login.model';
import { TableModule } from 'primeng/table';
import { alunoDomain } from '../../../models/aluno.model';
import { log } from 'node:console';
import { AlunoForm } from "../aluno-form/aluno-form";


@Component({
  selector: 'app-aluno',
  imports: [ReactiveFormsModule, TableModule, AlunoForm],
  standalone: true,
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})

export class Aluno implements OnInit {

  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);
  
  listAlunos: alunoDomain[] = [];
  alunosFiltrados: alunoDomain[] = [];

  exibirModalPrincipal: boolean = false;
  alterar: boolean = false;
  alunoSelecionado: alunoDomain | null = null;
  formAluno!: Aluno;

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required),
    status: new FormControl<number | null>(1, Validators.required),
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const dado = this.form.getRawValue() as alunoDomain;
    this.alunoServece.listarTodos().subscribe({
      next: (dados) => {
        this.listAlunos = dados ;
        this.alunosFiltrados = dados;
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

    this.alunosFiltrados = this.listAlunos.filter((a: alunoDomain) =>
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
    this.alunoSelecionado = null;
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(aluno: alunoDomain) {
    this.alunoSelecionado = aluno;
    this.abrirMeuPopup();
  }
}
