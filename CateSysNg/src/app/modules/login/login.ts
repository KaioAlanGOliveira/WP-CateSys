import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { loginDto } from '../../domain/login.model';
import { log } from 'node:console';

class LoginResponse {
 status?:String;
}
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private loginService = inject(LoginService);
// 2. Injete o Router se precisar redirecionar o usuário após o login
  private router = inject(Router);
 
 idProfessor:  number | null = null; 

  

  form = new FormGroup({
    login: new FormControl<string | null>(null, Validators.required),
    senha: new FormControl<string | null>(null, Validators.required)
  });
  

  entrar() {
    const dados = this.form.getRawValue() as loginDto;
    console.log(dados.login);
    
    if (this.form.invalid) {
      return
    }
    this.loginService.listarTodos(dados).subscribe({
       next: (resposta: any) => { // Corrigido de 'respota' para 'resposta'
      const resultado = resposta as LoginResponse;
      if (resultado.status === 'sucesso') {
        this.router.navigate(['/dashboard']); 
      } else {
        alert('Login inválido');
      }
    },
    error: (err) => console.error('Erro na requisição:', err)
  }); 
 // this.router.navigate(['/dashboard']);
  }
}
