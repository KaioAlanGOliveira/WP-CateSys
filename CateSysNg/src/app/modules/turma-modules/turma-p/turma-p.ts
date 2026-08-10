import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TurmaService } from '../../../service/turma.service';
import { Professor } from '../../professor-modules/professor/professor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { TurmaD } from '../../../models/turma.model';
import { AlunoD } from '../../../models/aluno.model';
import { Aluno } from '../../aluno-modules/aluno/aluno'; 
import { AlunoService } from '../../../service/aluno.service';
import { TableModule } from "primeng/table";
import { ComponenteAluno } from "../../../shared/componente/componente-pesq-aluno/pesq-aluno";
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
    ComponenteAluno
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

  turmas: TurmaD[] = [];
  formulario!: FormGroup;
  tipoPagamento: any;
  formAlunos!: FormGroup;
  listAlunos: AlunoD[] = [];
  alunosFiltrados: any[] = [];
  alunoSelecionado!: any;

  @Input() Selecionado: TurmaD | null = null;
  @Output() visivelChange = new EventEmitter<boolean>();
  @Input() visivel = false;

  private modo: 'initial' | 'creating' | 'editing' = 'initial';
  private alunoServece = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private turmaService = inject(TurmaService);
  private originalTurma: TurmaD | null = null;
  turmasFiltradas: any;

  ngOnInit() {
    this.initForm();
    this.carregarDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel'] && !this.visivel) {
      this.resetToInitialState();
    }

    if (changes['Selecionado'] && this.Selecionado && this.formulario) {
      this.modo = 'initial';
      this.formulario.patchValue(this.Selecionado);
      this.originalTurma = this.Selecionado;
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
      professorMatricula: [{ value: null, disabled: true }],
      codCliente: [{ value: '', disabled: true }]
    });

    this.formAlunos = this.fb.group({
      codCliente: new FormControl<number | null>(null),
      nome: new FormControl<string | "">("", Validators.required)
    });
  }

  carregarTurmas() {
    this.turmaService.listarTodos().subscribe({
      next: (dados) => {
        this.turmas = dados || [];
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


  adicionarAluno(alunoSelecionado: AlunoD | null) {
    if (!alunoSelecionado) {
      return;
    }

    const matricula = (alunoSelecionado as any).matricula ?? (alunoSelecionado as any).codigo ?? (alunoSelecionado as any).id;
    if (!matricula) {
      return;
    }

    const jaExiste = this.listAlunos.some(item => (item as any).matricula === matricula);
    if (!jaExiste) {
      this.listAlunos = [
        ...this.listAlunos,
        {
          ...alunoSelecionado,
          matricula,
          status: alunoSelecionado.status ?? 1
        }
      ];
      this.cdr.detectChanges();
    }
  }

  selecionado(aluno: AlunoD) {
    this.alunoSelecionado = aluno;
    this.visivel = true;
  }

  fecharModal() {
    this.modo = 'initial';
    this.visivel = false;
    this.originalTurma = null;
    this.visivelChange.emit(false);
    this.formulario.reset();
  }


  private resetToInitialState() {
    this.modo = 'initial';
    this.originalTurma = null;
    if (this.Selecionado) {
      this.formulario.patchValue(this.Selecionado);
    }
    this.alterarEstadoUI();
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

  carregarDados() {
    const filtro = this.formAlunos.getRawValue() as AlunoD;
    this.alunoServece.listarTodosFiltrados(filtro).subscribe({
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

  private salvarNova(formValue: TurmaD) {

    this.turmaService.salvar(formValue).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (err) => { alert('Erro ao salvar a turma. A turma já existe.'); console.error('Erro ao salvar:', err); }
    });
  }

  private alterar(formValue: TurmaD) {
    if (!this.Selecionado) return;

    const atualizado: TurmaD = { ...this.Selecionado, ...formValue };

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
    this.carregarTurmas();
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

  recarregarPaginaInteira() {
    window.location.reload();
  }

  remover(): void {
    const index = this.listAlunos.indexOf(this.alunoSelecionado);
    if (index !== -1) {
      this.listAlunos.splice(index, 1);
    }
    this.alunoSelecionado = null;
  }

  protected add(aluno: AlunoD) {
    if (!aluno) {
      alert("Preencha o campo ");
    } else if (this.listAlunos.find(c => c.matricula == aluno.matricula)) {
      alert("Aluno já adicionado!");
    } else {

      this.alunoServece.listarTodosFiltrados(AlunoD as any).subscribe((msg) => {
        if (msg) {
          let a: AlunoD = new AlunoD();
          a.matricula = aluno.matricula;
          a.nome = aluno.nome;
          this.listAlunos.push(a)
        } else {
          alert(msg);
        }
      });
    }
  }
}