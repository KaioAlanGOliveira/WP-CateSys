import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { AlunoService } from '../../service/aluno.service';
import { loginDto } from '../../domain/login.model';
import { TableModule } from 'primeng/table';
import { aluno } from '../../domain/aluno.model';

class LoginResponse {
  status?: String;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TableModule],
  standalone: true,
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})

export class Aluno {
  private alunoServece = inject(AlunoService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  listAlunos:aluno[] = [];

  form = new FormGroup({
    login: new FormControl<string | null>(null, Validators.required),
    senha: new FormControl<string | null>(null, Validators.required)
  });

  entrar() {
    if (this.form.invalid) {
      return
    }

    const dados = this.form.getRawValue() as loginDto;
    this.loginService.logar(dados).subscribe({
      next: (resposta: any) => {
        const resultado = resposta as LoginResponse;
        if (resultado.status === 'sucesso') {
          this.router.navigate(['/aluno']);
        } else {
          alert('Login inválido');
        }
      },
      error: (err) => {
        console.error('Servidor Backend fora do ar ou inacessível!');
        alert('Não foi possível conectar ao servidor. Verifique se o backend está ligado.');
        console.error('Erro retornado pelo Java:', err.status, err.message);
        alert('Usuário ou senha inválidos.');
      }
    });
  }

  pesquisar() {
    this.alunoServece.listarTodos().subscribe({
      next: (dado) => {
        this.listAlunos = dado;
      },
      error: (err) => {
      }
    });
  }

  alunos = [
    {
      matricula: '001',
      nome: 'João',
      turma: 'A',
      status: 'Ativo'
    }
  ];
}
