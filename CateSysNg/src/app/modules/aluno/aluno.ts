import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { AlunoService } from '../../service/aluno.service';
import { loginDto } from '../../domain/login.model';
import { TableModule } from 'primeng/table';
import { aluno } from '../../domain/aluno.model';
import { log } from 'node:console';

@Component({
  selector: 'app-aluno',
  imports: [ReactiveFormsModule, TableModule],
  standalone: true,
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})

export class Aluno implements OnInit {

  private alunoServece = inject(AlunoService);
  private loginService = inject(LoginService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  listAlunos: aluno[] = [];
  alunosFiltrados: any[] = [];

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const dado = this.form.getRawValue() as aluno;
    this.alunoServece.listarTodos().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);

        this.listAlunos = dados || [];
        this.alunosFiltrados = dados || [];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  pesquisar(termoNome: string, termoMatricula: string) {

    if (!termoNome && !termoNome) {
      this.alunosFiltrados = this.listAlunos;
      return;
    }

    const buscaNome = termoNome ? termoNome.toLocaleLowerCase().trim() : '';
    const buscaMatricula = termoMatricula ? termoMatricula.trim() : '';

    this.alunosFiltrados = this.listAlunos.filter(a =>
      (termoNome && a.nome && a.nome.toLocaleLowerCase().includes(termoNome.toLocaleLowerCase().trim())) ||
      (termoMatricula && a.matricula && String(a.matricula).includes(termoMatricula.trim()))
    );
  }

  add() {
    throw new Error('Method not implemented.');
  }
}
