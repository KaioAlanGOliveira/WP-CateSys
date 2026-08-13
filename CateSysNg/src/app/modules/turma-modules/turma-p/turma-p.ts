import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TurmaService } from '../../../service/turma.service';
import { professor } from '../../../models/professor.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TurmaDomain } from '../../../models/turma.model';
import { Aluno } from '../../aluno-modules/aluno/aluno';
import { aluno } from '../../../models/aluno.model';
import { AlunoService } from '../../../service/aluno.service';
import { TableModule } from "primeng/table";
import { ComponenteAluno } from "../../../shared/componente/componente-pesq-aluno/componente-aluno";
import { ComponenteProfessor } from '../../../shared/componente/componente-pesq-professor/componente-professor';
@Component({
  selector: 'app-turma-p',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputMaskModule,
    MessageModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    DatePickerModule,
    TableModule,
    ComponenteAluno,
    ComponenteProfessor
  ],
  templateUrl: './turma-p.html',
  styleUrl: './turma-p.css'
})
export class TurmaP implements OnChanges, OnInit {

  get novoHabilitado() { return this.modo === 'initial'; }
  get alterarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get apagarHabilitado() { return this.modo === 'initial' && !!this.Selecionado; }
  get salvarHabilitado() { return this.modo !== 'initial'; }
  get cancelarHabilitado() { return this.modo !== 'initial'; }
  get fecharHabilitado() { return true; }

  turmas: TurmaDomain[] = [];
  formulario!: FormGroup;
  tipoPagamento: any;
  formAlunos!: FormGroup;
  listAlunos: aluno[] = [];
  alunosFiltrados: any[] = [];
  alunoSelecionado!: any;


  private modo: 'initial' | 'creating' | 'editing' = 'initial';

  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);

  @Input() Selecionado: TurmaDomain | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private fb = inject(FormBuilder);
  private turmaService = inject(TurmaService);

  private originalTurma: TurmaDomain | null = null;
  turmasFiltradas: any;

  ngOnInit() {
    this.initForm();
    // this.formulario.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'initial';
      this.carregarTurmaSelecionada();
      this.carregarTurma();
      this.originalTurma = { ...this.Selecionado };

    } else if (changes['visivel'] && this.visivel && !this.Selecionado && this.formulario) {
      this.modo = 'creating';
      this.formulario.reset();
    }

    this.alterarEstadoUI();
  }


  private initForm(): void {
    this.formulario = this.fb.group({
      codigo: [{ value: '', disabled: true }, [Validators.required]],
      nome: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      status: [{ value: 1, disabled: true }, [Validators.required]],
      professor: [{ value: "", disabled: true }],
      codAluno: [{ value: null, disabled: true }],
      professorMatricula: [{ value: null }]
    });

    this.formAlunos = this.fb.group({
      matricula: new FormControl<number | null>(null),
      nome: new FormControl<string | "">("", Validators.required)
    });
  }

  carregarTurma() {
    const codigo = this.Selecionado?.codigo;
    if (!codigo) return;

    this.turmaService.getEntity(codigo).subscribe({
      next: (dados) => {
        this.formulario.patchValue(dados);
      }
    });
  }

  // ==================== CONTROLE CENTRALIZADO ====================
  private alterarEstadoUI(): void {
    if (!this.formulario) return;

    if (this.modo === 'initial') {
      this.formulario.disable();
    } else if (this.modo === 'editing') {
      this.formulario.enable();
      this.formulario.get('matricula')?.disable();
    } else {
      this.formulario.enable();
      this.formulario.get('matricula')?.enable();
    }
  }


  // ==================== AÇÕES ====================
  novo() {
    this.modo = 'creating';
    this.originalTurma = null;
    this.formulario.reset();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.formulario.enable();
    this.alterarEstadoUI();
  }

  editar() {
    if (!this.Selecionado) return;
    this.modo = 'editing';
    this.formulario.patchValue(this.Selecionado);
    this.originalTurma = { ...this.Selecionado };
    this.formulario.enable();
    this.formulario.markAllAsDirty();
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    this.alterarEstadoUI();
  }

  private removerMascaras(valor: any): string {
    if (!valor) return '';
    return valor.toString().replace(/\D/g, '');
  }

  cancelar() {
    if (this.modo === 'creating') {
      this.formulario.reset();
      this.fecharModal();
    } else if (this.modo === 'editing' && this.originalTurma) {
      this.formulario.patchValue(this.originalTurma);
      this.modo = 'initial';
      this.alterarEstadoUI();
    }
  }

  fecharModal() {
    this.modo = 'initial';
    this.visivel = false;
    this.originalTurma = null;
    this.visivelChange.emit(false);
    this.formulario.reset();
  }

  recarregarPaginaInteira() {
    window.location.reload();
  }

  private resetToInitialState() {
    this.modo = 'initial';
    this.originalTurma = null;
    if (this.Selecionado) {
      this.formulario.patchValue(this.Selecionado);
    }
    this.alterarEstadoUI();
  }


  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();

    if (this.modo === 'creating') {
      this.salvarNova(formValue);
      this.fecharModal();
    } else {
      this.alterar(formValue);
    }
    this.modo = 'initial';
    this.alterarEstadoUI();
  }

  private salvarNova(formValue: TurmaDomain) {

    this.turmaService.salvar(formValue).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => { alert('Erro ao salvar a turma. A turma já existe.'); console.error('Erro ao salvar:', err); }
    });
  }

  private alterar(formValue: TurmaDomain) {
    if (!this.Selecionado) return;

    const atualizado: TurmaDomain = { ...this.Selecionado, ...formValue };

    this.turmaService.editar(atualizado).subscribe({
      next: () => {
        alert('Turma atualizada com sucesso.');
        this.finalizarComSucesso();
      },
      error: (err) => console.error('Erro ao alterar:', err)
    });
  }

  apagar() {
    const respota = window.confirm('Deseja realmente apagar o elemento selecionado?');
    if (respota) {
      if (!this.Selecionado?.codigo) return;

      this.turmaService.apagar(this.Selecionado).subscribe({
        next: () => { this.finalizarComSucesso(); },
        error: (err) => { alert('Erro ao apagar a turma.'); this.finalizarComSucesso(); },
      });
      this.fecharModal();
    }

  }

  private finalizarComSucesso() {
    this.carregarTurma();
  }

  habilitarCampos(formulario: FormGroup, habilitar: boolean) {
    Object.keys(formulario.controls).forEach((campo) => {
      const controle = formulario.get(campo);
      if (controle) {
        if (habilitar) {
          controle.enable();
        } else {
          controle.disable();
        }
      }
    });
  }

  selecionado(aluno: aluno) {
    this.alunoSelecionado = aluno;
    this.visivel = true;
  }

  remover(): void {
    const index = this.listAlunos.indexOf(this.alunoSelecionado);
    if (index !== -1) {
      this.listAlunos.splice(index, 1);
    }
    this.alunoSelecionado = null;
  }

  add(aluno: aluno | null): void {
    if (!aluno) {
      alert('Nenhum aluno selecionado!');
      return;
    } else if (this.listAlunos.find(c => c.matricula == aluno.matricula)) {
      alert("Cliente já adicionado!");
      return;
    } else {

      const alunoPesquisa: aluno = {
        matricula: aluno
      } as aluno;

      this.alunoServece.listarTodosFiltrados(alunoPesquisa).subscribe({
        next: (dados) => {

          if (!dados || dados.length === 0) {
            alert('Aluno não encontrado.');
            return;
          }

          const alunoEncontrado = dados[0];

          this.listAlunos = [
            ...this.listAlunos,
            alunoEncontrado
          ];

          this.alunoSelecionado = alunoEncontrado;
        },

        error: (err) => {
          console.error('Erro ao buscar aluno:', err);
          alert('Erro ao buscar o aluno.');
        }
      });
      this.alunoSelecionado = aluno;
    }
  }
  private carregarTurmaSelecionada(): void {
    if (!this.Selecionado) {
      return;
    }

    const filtro: TurmaDomain = {
      codigo: this.Selecionado.codigo
    } as TurmaDomain;

    this.turmaService.listFiltrados(filtro).subscribe({
      next: (dados) => {

        if (!dados || dados.length === 0) {
          alert('Turma não encontrada.');
          return;
        }

        const turma = dados[0];

        this.formulario.patchValue(turma);

        this.originalTurma = { ...turma };

        console.log('Turma carregada:', turma);
      },

      error: (err) => {
        console.error('Erro ao buscar turma:', err);
        alert('Erro ao buscar a turma.');
      }
    });
    
  }
}