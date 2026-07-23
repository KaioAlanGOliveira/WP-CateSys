import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { loginDto } from '../../domain/login.model';

class LoginResponse {
  status?: String;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})
export class Aluno {
  private loginService = inject(LoginService);
  // 2. Injete o Router se precisar redirecionar o usuário após o login
  private router = inject(Router);

  idProfessor: number | null = null;



  form = new FormGroup({
    login: new FormControl<string | null>(null, Validators.required),
    senha: new FormControl<string | null>(null, Validators.required)
  });


  entrar() {
    if (this.form.invalid) {
      return
    }

    const dados = this.form.getRawValue() as loginDto;
    this.loginService.listarTodos(dados).subscribe({
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
}
