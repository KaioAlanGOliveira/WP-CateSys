import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { AlunoService } from '../../service/aluno.service';
import { loginDto } from '../../domain/login.model';
import { TableModule } from 'primeng/table';
import { aluno } from '../../domain/aluno.model';

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
    this.pesquisar();
  }
  pesquisar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dado = this.form.getRawValue() as aluno;
    this.alunoServece.listarTodos(dado).subscribe({
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
}
