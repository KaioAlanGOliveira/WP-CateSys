import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { ProfessorService } from '../../../service/professor.service';
import { TableModule } from 'primeng/table';
import { professor } from '../../../domain/professor.model';
import { log } from 'node:console';
import { ProfessorP } from '../professor-p/professor-p';



@Component({
  selector: 'app-professor',
  imports: [ReactiveFormsModule, TableModule, ProfessorP],
  standalone: true,
  templateUrl: './professor.html',
  styleUrl: './professor.css',
})

export class Professor implements OnInit {

  private professorServece = inject(ProfessorService);
  private loginService = inject(LoginService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  exibirModalPrincipal: boolean = false;
  professorSelecionado!: any;
  formprofessor!: professor;
  listprofessors: professor[] = [];
  professorsFiltrados: any[] = [];

  alterar: boolean = false;
  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const dado = this.form.getRawValue() as professor;
    this.professorServece.listarTodos().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);

        this.listprofessors = dados || [];
        this.professorsFiltrados = dados || [];
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
      this.professorsFiltrados = [...this.listprofessors];
      return;
    }

    const buscaNome = termoNome ? termoNome.toLocaleLowerCase().trim() : '';
    const buscaMatricula = termoMatricula ? termoMatricula.trim() : '';

    this.professorsFiltrados = this.listprofessors.filter(a =>
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
  selecionado(professor: professor) {
    this.alterar = true;
    this.professorSelecionado = professor;
    this.form.patchValue(professor);
    this.abrirMeuPopup();
  }
}
