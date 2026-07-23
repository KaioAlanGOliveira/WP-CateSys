import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { loginDto } from '../../domain/login.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private LoginService = inject(LoginService);

  

  form = new FormGroup({
    matricula: new FormControl<number | null>(null, Validators.required),
    senha: new FormControl<number | null>(null, Validators.required)
  });
  

  entrar() {
    alert("asdfas");

    const dados = this.form.value as loginDto;
    this.LoginService.listarTodos(dados ).subscribe({
      next: () => console.log('s'),
      error: () => console.error('Erro')
    }) 

  }
}
