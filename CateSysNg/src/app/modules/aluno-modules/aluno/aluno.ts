import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlunoService } from '../../../service/aluno.service';
import { TableModule } from 'primeng/table';
import { alunoDomain } from '../../../models/aluno.model';
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
    const { nome, matricula } = this.form.getRawValue();
    const filtro: alunoDomain = {
      ...(nome?.trim() ? { nome: nome.trim() } : {}),
      ...(matricula ? { matricula } : {})
    };
    const operacao = Object.keys(filtro).length
      ? this.alunoServece.listarTodosFiltrados(filtro)
      : this.alunoServece.listarTodos();

    operacao.subscribe({
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
    this.form.patchValue({
      nome: termoNome,
      matricula: termoMatricula ? Number(termoMatricula) : null
    });
    this.carregarDados();
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
