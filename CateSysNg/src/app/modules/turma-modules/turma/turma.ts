import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurmaService } from '../../../service/turma.service';
import { TableModule } from 'primeng/table';
import { TurmaD } from '../../../models/turma.model';
import { TurmaP } from '../turma-p/turma-p';
import { RadioButton } from "primeng/radiobutton";

@Component({
  selector: 'app-turma',
  imports: [ReactiveFormsModule, TableModule, TurmaP, RadioButton],
  standalone: true,
  templateUrl: './turma.html',
  styleUrl: './turma.css',
})

export class Turma implements OnInit {

  private turmaServece = inject(TurmaService);
  private cdr = inject(ChangeDetectorRef);

  exibirModalPrincipal: boolean = false;
  turmaSelecionado!: any;
  formturma!: TurmaD;
  listTurmas: TurmaD[] = [];
  turmasFiltradas: TurmaD[] = [];

  form = new FormGroup({
    codigo: new FormControl<number | null>(null),
    nome: new FormControl<string | "">("", Validators.required),
    status: new FormControl<number>({ value: 1, disabled: false }, [Validators.required]),
    professorMatricula: new FormControl<number | null>(null)
  });

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const filtro = this.form.value as TurmaD;
   
    this.turmaServece.listFiltrados(filtro).subscribe({
      next: (dados) => {
        const normalized = (dados || []).map((item: any) => ({
          ...item,
          professorMatricula: item.professorMatricula ?? item.professor_matricula ?? null
        }));
        this.listTurmas = normalized;
        this.turmasFiltradas = normalized;
        this.cdr.detectChanges();        
      },
      error: (err) => {
        console.error('Erro ao carregar os dados:', err);
      }
      
    });
  }
  novo() {
    this.form.reset();
    this.turmaSelecionado = null;
    this.abrirMeuPopup();
  }
  pesquisar() {
    const { nome, codigo, status, professorMatricula } = this.form.value;
    if (!nome && !codigo && !status && !professorMatricula) {
      this.turmasFiltradas = [...this.listTurmas];
      return;
    }
    this.form.patchValue({
      nome: nome,
      codigo: codigo ? Number(codigo) : null,
      status: status,
      professorMatricula: professorMatricula ? Number(professorMatricula) : null,
    });

    this.carregarDados();
  }
  abrirMeuPopup() {
    this.exibirModalPrincipal = true;
  }
  add() {
    this.form.reset();
    this.turmaSelecionado = null;
    this.abrirMeuPopup();
  }
  retornoPopUp(exib: boolean) {

    if (!exib) {
      this.carregarDados();
    }
  }
  selecionado(turma: TurmaD) {

    this.turmaSelecionado = turma;
    this.abrirMeuPopup();
  }
}
