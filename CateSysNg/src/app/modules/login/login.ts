import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { LoginDto } from '../../models/login.model';

class LoginResponse {
  status?: String;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  private loginService = inject(LoginService);
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

    const dados = this.form.getRawValue() as LoginDto;
    this.loginService.logar(dados).subscribe({
      next: (resposta: any) => {
        const resultado = resposta as LoginResponse;
        if (resultado.status === 'sucesso') {
          this.router.navigate(['/aluno']);
        } else {
          alert('Login inválido');
        }
      },
      error: (err) => console.error('Erro na requisição:', err),
    });
    // this.router.navigate(['/dashboard']);
  }
}
