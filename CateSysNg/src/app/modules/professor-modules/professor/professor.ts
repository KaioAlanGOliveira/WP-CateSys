import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { ProfessorService } from '../../../service/professor.service';
import { TableModule } from 'primeng/table';
import { ProfessorD } from '../../../models/professor.model';
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
  private cdr = inject(ChangeDetectorRef);

  exibirModalPrincipal: boolean = false;
  professorSelecionado!: any;
  formprofessor!: ProfessorD;
  listprofessors: ProfessorD[] = [];
  professorsFiltrados: any[] = [];

  form = new FormGroup({
    matricula: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const filtro = this.form.value as ProfessorD;
    this.professorServece.listFiltrados(filtro).subscribe({
      next: (dados) => {

        this.listprofessors = dados || [];
        this.professorsFiltrados = dados || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar os professores:', err);
      }
    });
  }
  novo() {
    this.form.reset();
    this.professorSelecionado = null;
    this.abrirMeuPopup();
  }
  pesquisar(termoNome: string, termoMatricula: string) {

    if (!termoNome && !termoMatricula) {
      this.professorsFiltrados = [...this.listprofessors];
      return;
    }
    this.form.patchValue({
      nome: termoNome,
      matricula: termoMatricula ? Number(termoMatricula) : null
    });
    this.carregarDados();
  }
  abrirMeuPopup() {
    this.exibirModalPrincipal = true;
  }
  add() {
    this.form.reset();
    this.professorSelecionado = null;
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(professor: ProfessorD) {
    //this.form.patchValue(professor);
    this.professorSelecionado = professor;
    this.abrirMeuPopup();
  }
}
